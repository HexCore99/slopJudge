import { Children } from "react";

function PublicLayout({ children }) {
  return (
    <div>
      <div className="min-h-screen bg-[#edf1f5] text-slate-800">
        <div className="mx-auto max-w-360 overflow-hidden rounded-2xl border border-slate-300/80 bg[#edf1f5]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default PublicLayout;
