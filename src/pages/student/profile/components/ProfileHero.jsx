import { useEffect, useRef } from "react";
import {
  Crown,
  GraduationCap,
  IdCard,
  CalendarDays,
  Pencil,
  Share2,
  Github,
  ArrowUp,
  Check,
  X,
  Flame,
  Flag,
  Trophy,
  Zap,
  Star,
  Code,
  Rocket,
  Brain,
  Gem,
  Shield,
  Swords,
  Infinity,
} from "lucide-react";

const lucideIcons = {
  Zap, Flame, Star, Crown, Code, Rocket, Brain, Gem, Shield, Swords, Infinity, Trophy,
};

const statItems = [
  {
    label: "Solved",
    key: "solved",
    delta: (u) => `+${u.solvedDelta} this week`,
    deltaColor: "text-green-600",
    iconBg: "bg-green-600/7",
    Icon: Check,
    iconColor: "text-green-600",
  },
  {
    label: "Submissions",
    key: "totalSubmissions",
    delta: (u) => `${u.acRate} AC rate`,
    deltaColor: "text-slate-500",
    iconBg: "bg-red-600/6",
    Icon: X,
    iconColor: "text-red-600",
  },
  {
    label: "Streak",
    key: "streak",
    suffix: "days",
    delta: (u) => `Best: ${u.bestStreak} days`,
    deltaColor: "text-amber-600",
    iconBg: "bg-amber-600/7",
    Icon: Flame,
    iconColor: "text-amber-600",
  },
  {
    label: "Contests",
    key: "contestCount",
    delta: (u) => `${u.ratedContests} rated`,
    deltaColor: "text-blue-600",
    iconBg: "bg-blue-600/6",
    Icon: Flag,
    iconColor: "text-blue-600",
  },
  {
    label: "Rank",
    key: "rank",
    prefix: "#",
    delta: (u) => (
      <span className="inline-flex items-center">
        <ArrowUp className="mr-0.5 inline h-2.5 w-2.5" />
        Up {u.rankDelta}
      </span>
    ),
    deltaColor: "text-green-600",
    iconBg: "bg-blue-600/6",
    Icon: Trophy,
    iconColor: "text-blue-600",
  },
];

export default function ProfileHero({
  user,
  difficulties,
  achievements,
  onEditClick,
  onShareClick,
}) {
  const barRefs = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      barRefs.current.forEach((bar) => {
        if (bar) {
          const targetWidth = bar.getAttribute("data-w");
          bar.style.width = targetWidth + "%";
        }
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="mb-6 grid items-stretch gap-6"
      style={{ gridTemplateColumns: "1fr 320px" }}
    >
      {/* Left: Profile info + Stats */}
      <div className="relative flex flex-col overflow-hidden rounded-2xl border border-black/7 bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Avatar ring */}
          <div
            className="relative h-[120px] w-[120px] shrink-0 rounded-full p-[3px]"
            style={{
              background:
                "conic-gradient(#c2850a 0deg, #c2850a 260deg, rgba(0,0,0,0.06) 260deg, rgba(0,0,0,0.06) 360deg)",
            }}
          >
            <img
              src="https://picsum.photos/seed/student42/300/300.jpg"
              alt={user.name}
              className="h-full w-full rounded-full border-[3px] border-white object-cover"
            />
            <div className="absolute right-0.5 bottom-0.5 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white bg-amber-600">
              <Crown className="h-3 w-3 text-white" />
            </div>
          </div>

          {/* Info block */}
          <div className="flex-1 text-center sm:text-left">
            <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center">
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                {user.name}
              </h1>
              <span className="inline-block self-center rounded-md bg-green-600/8 px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide text-green-600">
                PRO
              </span>
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-500 sm:justify-start">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-amber-600" />
                {user.dept}
              </span>
              <span className="flex items-center gap-1.5">
                <IdCard className="h-3.5 w-3.5 text-amber-600" />
                {user.id}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-amber-600" />
                Joined {user.joinedDate}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <button
                onClick={onEditClick}
                className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-amber-700"
              >
                <Pencil className="mr-2 inline h-3.5 w-3.5" />
                Edit Profile
              </button>
              <button
                onClick={onShareClick}
                className="rounded-xl border border-black/7 px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
              >
                <Share2 className="mr-1.5 inline h-3.5 w-3.5" />
                Share
              </button>
              <a
                href={user.git}
                target="_blank"
                rel="noreferrer"
                className="flex items-center rounded-xl border border-black/7 px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
              >
                <Github className="mr-1.5 h-3.5 w-3.5" />
                GitHub
              </a>
            </div>
          </div>

          {/* Rating box */}
          <div className="shrink-0 rounded-2xl border border-amber-600/20 bg-amber-600/7 p-4 text-center">
            <div className="mb-0.5 text-[10px] font-medium text-slate-500">
              RATING
            </div>
            <div className="font-mono text-3xl font-bold text-amber-600">
              {user.rating}
            </div>
            <div className="mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-green-600">
              <ArrowUp className="h-2.5 w-2.5" />
              {user.ratingDelta}
            </div>
            <div className="mt-1.5 text-[9px] font-medium tracking-wider text-amber-600">
              {user.ratingTier}
            </div>
          </div>
        </div>

        {/* Stats row inside the card */}
        <div className="mt-auto grid grid-cols-5 gap-3 border-t border-black/5 pt-5 mt-6">
          {statItems.map(({ label, key, prefix, suffix, delta, deltaColor, iconBg, Icon, iconColor }) => (
            <div key={label} className="group relative overflow-hidden rounded-xl bg-slate-50/80 p-3.5">
              {/* Hover accent line */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="mb-2 flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${iconBg}`}>
                  <Icon className={`h-3 w-3 ${iconColor}`} />
                </div>
                <span className="text-[10px] font-medium text-slate-400">{label}</span>
              </div>
              <div className="font-mono text-lg font-bold text-slate-800">
                {prefix}{user[key]}
                {suffix && <span className="ml-1 text-[11px] font-normal text-slate-400">{suffix}</span>}
              </div>
              <div className={`mt-0.5 text-[10px] ${deltaColor}`}>
                {typeof delta === "function" ? delta(user) : delta}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Problem Breakdown + Achievements */}
      <div className="flex flex-col gap-6">
        {/* Problem Breakdown */}
        <div className="rounded-2xl border border-black/7 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <h2 className="mb-5 font-semibold text-slate-800">
            Problem Breakdown
          </h2>
          <div className="space-y-4">
            {difficulties.map((d, i) => {
              const pct = Math.max(
                Math.round((d.solved / d.total) * 100),
                2,
              );
              return (
                <div key={d.label}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span
                      className="flex items-center gap-2 text-sm font-medium"
                      style={{ color: d.color }}
                    >
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ background: d.color }}
                      />
                      {d.label}
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      {d.solved} / {d.total}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      ref={(el) => (barRefs.current[i] = el)}
                      data-w={pct}
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: "0%",
                        background: d.color,
                        transitionTimingFunction:
                          "cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="rounded-2xl border border-black/7 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Achievements</h2>
            <span className="font-mono text-xs text-slate-500">
              {achievements.filter((a) => !a.locked).length} /{" "}
              {achievements.length}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {achievements.map((a) => {
              const Icon = lucideIcons[a.icon] || Zap;
              return (
                <div
                  key={a.label}
                  title={a.label + (a.locked ? " (Locked)" : "")}
                  className={`flex h-14 w-14 cursor-default items-center justify-center rounded-[14px] text-xl transition-all ${
                    a.locked
                      ? "opacity-25 grayscale"
                      : "hover:-translate-y-0.5 hover:scale-105"
                  } ${a.bg}`}
                >
                  <Icon className={`h-5 w-5 ${a.color}`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
