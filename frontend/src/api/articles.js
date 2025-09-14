import { api } from "./client.js";

export async function getArticles() {
  const { data } = await api.get("/articles");
  return data; // [{ id, translated_title, publication_date, sentiment }]
}

export async function getArticle(id) {
  const { data } = await api.get(`/articles/${id}`);
  return data; // { id, original_url, translated_title, publication_date, long_summary, sentiment, entities }
}

export async function getSimilar(id) {
  const { data } = await api.get(`/articles/${id}/similar`);
  return data; // { target_id, similar_articles: [{ id, original_url, translated_title, similarity_score }] }
}

export async function createArticle(url) {
  const { data } = await api.post("/articles", { url });
  return data;
}