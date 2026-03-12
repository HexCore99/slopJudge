import { Terminal } from "lucide-react";
import { Link } from "react-router-dom";
function LandingNavbar() {
  return (
    <header className="flex items-center justify-between border-b border-slate-300/80 px-6 py-4 md:px-10">
      <Link to="/">
        <Terminal className="h-4 w-4 text-slate-700" />
        <span className="font-mono text-2xl font-semibold tracking-tight md:text-3xl ">
          QuickJudge
        </span>
      </Link>
    </header>
  );
}

export default LandingNavbar;
