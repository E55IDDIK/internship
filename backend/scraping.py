import requests
from bs4 import BeautifulSoup
import re

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/117.0",
    "Accept-Language": "en-US,en;q=0.9",
}

def fetch_and_parse(url: str) -> dict:
    """Fetch an article URL and extract title + main text."""

    # 1. Fetch page
    resp = requests.get(url, headers=HEADERS, timeout=20)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "lxml")

    # 2. Title (try multiple strategies)
    title_tag = (
        soup.find("meta", property="og:title")
        or soup.find("meta", attrs={"name": "title"})
        or soup.find("span", class_="interviewed-title")  # case: lejournaldesentreprises
        or soup.find("h1")
        or soup.find("title")
    )
    # handle <div id="block-jde2-page-title"> case: lejournaldesentreprises
    if not title_tag:
        jde2 = soup.find("div", id="block-jde2-page-title")
        if jde2:
            span = jde2.find("span")
            if span:
                title_tag = span

    # Extract text from the chosen tag
    title = None
    if title_tag:
        if hasattr(title_tag, "has_attr") and title_tag.has_attr("content"):
            title = title_tag["content"]
        else:
            title = title_tag.get_text(" ", strip=True)

    if not title:
        title = "Untitled"


    # 3. Collect candidate paragraphs
    paragraphs = []

    # From <article>
    for art in soup.find_all("article"):
        paragraphs.extend([p.get_text(" ", strip=True) for p in art.find_all("p")])

    # From <p>
    paragraphs.extend([p.get_text(" ", strip=True) for p in soup.find_all("p")])

    # From <div> with "content-like" classes
    content_divs = soup.find_all(
        "div",
        class_=lambda x: x and any(
            kw in x.lower() for kw in ["content", "main", "body", "post", "article"]
        ),
    )
    for div in content_divs:
        paragraphs.extend([p.get_text(" ", strip=True) for p in div.find_all("p")])
        text_in_div = div.get_text(" ", strip=True)
        if text_in_div:
            paragraphs.append(text_in_div)

    # 4. Clean, filter, and deduplicate
    clean_paragraphs = []
    seen = set()
    for p in paragraphs:
        p = re.sub(r"\s+", " ", p).strip()
        if len(p) >= 40 and p not in seen:  # skip boilerplate/short
            clean_paragraphs.append(p)
            seen.add(p)

    text = " ".join(clean_paragraphs)

    # 5. Fallback validation
    if not text or len(text) < 300:  # stricter minimum
        raise ValueError(f"Could not extract sufficient article text from {url}")

    return {
        "title": title.strip(),
        "text": text.strip(),
    }
