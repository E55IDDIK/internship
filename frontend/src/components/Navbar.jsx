// Navbar — fixed top navigation with brand logo and links
import { NavLink } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
 

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const linkBase = "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const linkActive = "text-white bg-sky-900/50";
  const linkIdle = "text-slate-300 hover:text-white hover:bg-sky-900/40";

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur bg-slate-900/80 border-b border-slate-800 shadow-lg shadow-black/20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <a className="inline-flex items-center gap-0" href="/">
              <Logo height={40} className="navbar-logo-white" />
              <span className=" ml-[-6px] text-slate-100 font-semibold">I-Powered Article Analyzer</span>
            </a>
          </div>
          {/* Right cluster: links*/}
          <div className="flex items-center gap-2">
            {/* Desktop menu (right aligned) */}
            <div className="hidden md:flex items-center gap-2">
              <NavLink
                to="/"
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
                end
              >Home</NavLink>
              <NavLink
                to="/articles"
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
              >Articles</NavLink>
            </div>
            <button
              aria-label="Menu"
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-slate-700 text-slate-200 hover:bg-slate-800/60"
              onClick={() => setOpen((v) => !v)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile panel */}
        {open && (
          <div className="md:hidden pb-3 pt-1">
            <div className="flex flex-col gap-1">
              <NavLink onClick={() => setOpen(false)} to="/" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}` } end>Home</NavLink>
              <NavLink onClick={() => setOpen(false)} to="/articles" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}` }>Articles</NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
