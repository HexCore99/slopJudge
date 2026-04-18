import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Plus, BookOpen } from "lucide-react";

const ITEMS = [
  { label: "Create Contest", to: "/admin/contests/create", Icon: Plus     },
  { label: "Create Problem", to: "/admin/problems/create", Icon: Plus     },
  { label: "Editorials",     to: "/admin/editorials",      Icon: BookOpen },
];

export default function AdminMoreMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-4 py-2 text-[14px] font-medium tracking-tight transition ${
          open
            ? "bg-amber-50 text-amber-700 shadow-sm"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        }`}
        aria-label="More actions"
      >
        More
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 origin-top-right animate-[fadeSlideDown_0.15s_ease] rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg">
          {ITEMS.map(({ label, to, Icon }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <Icon className="h-4 w-4 text-slate-400" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
