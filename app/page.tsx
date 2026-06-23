"use client";
import { SignUpButton, useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Zap,
  ArrowRight,
  ListTodo,
  Clock,
  BarChart3,
  MousePointerClick,
} from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: LayoutDashboard,
    title: "Visual Boards",
    desc: "Organize tasks into boards that match how you think.",
  },
  {
    icon: Zap,
    title: "Instant Updates",
    desc: "Changes to tasks and boards reflect immediately — no refreshing, no guessing.",
  },
  {
    icon: Clock,
    title: "Due Dates & Reminders",
    desc: "Never miss a deadline with smart reminders that surface at the right time.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    desc: "See how work is moving across every project at a glance.",
  },
  {
    icon: MousePointerClick,
    title: "Quick Actions",
    desc: "Create, move, and close tasks without breaking your flow.",
  },
  {
    icon: ListTodo,
    title: "Checklists",
    desc: "Break big tasks into steps and check them off as you go.",
  },
];

const steps = [
  {
    number: "1",
    title: "Create a board",
    desc: "Set up a board for any project, team, or workflow in seconds.",
  },
  {
    number: "2",
    title: "Add your tasks",
    desc: "Drop in everything you need to do — then organise by priority or status.",
  },
  {
    number: "3",
    title: "Get things done",
    desc: "Move tasks forward, collaborate with your team, and ship.",
  },
];

const kanbanCols = [
  {
    label: "To Do",
    color: "#9EC8B9",
    cards: ["Research competitors", "Write project brief"],
  },
  {
    label: "In Progress",
    color: "#008170",
    cards: ["Design homepage", "Set up database"],
  },
  {
    label: "Done",
    color: "#0D1F1C",
    cards: ["Kickoff meeting", "Define scope"],
  },
];

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  return (
    <main className="min-h-screen font-sans bg-brand-tint text-brand-dark">
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="bg-brand-card-bg text-brand-dark inline-block text-xs font-semibold tracking-widest uppercase mb-6 px-3 py-1 rounded-full">
            Task management
          </span>
          <h1 className="text-brand-dark text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Your work,{" "}
            <span className="relative inline-block text-brand-primary">
              finally clear.
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 6 Q50 2 100 5 Q150 8 198 4"
                  stroke="#9EC8B9"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </h1>
          <p
            className="text-lg leading-relaxed mb-8 max-w-md"
            style={{ color: "#3a5a54" }}
          >
            ZC-TASK gives you one place to plan, track, and ship work - no
            matter how big or small your project is.
          </p>
          <div className="flex flex-wrap gap-3">
            {isSignedIn ? (
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-brand-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 cursor-pointer"
              >
                Go to your boards <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <SignUpButton>
                <button className="bg-brand-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90">
                  Start for free <ArrowRight className="w-4 h-4" />
                </button>
              </SignUpButton>
            )}
          </div>
          <p className="text-xs mt-4" style={{ color: "#7aada3" }}>
            Free forever on your first board. No credit card needed.
          </p>
        </div>

        <div className="rounded-2xl p-5 shadow-xl border bg-white border-brand-card-bg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-300" />
            <div className="w-3 h-3 rounded-full bg-yellow-300" />
            <div className="w-3 h-3 rounded-full bg-green-300" />
            <span
              className="ml-2 text-xs font-medium"
              style={{ color: "#7aada3" }}
            >
              Q3 Launch — Design Team
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {kanbanCols.map((col) => (
              <div key={col.label}>
                <div className="flex items-center gap-1.5 mb-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: col.color }}
                  />
                  <span className="text-xs font-semibold text-brand-dark">
                    {col.label}
                  </span>
                </div>
                <div className="space-y-2">
                  {col.cards.map((card) => (
                    <div
                      key={card}
                      className="rounded-lg px-3 py-2 text-xs font-medium shadow-sm bg-brand-tint text-brand-dark"
                      style={{
                        borderLeft: `3px solid ${col.color}`,
                      }}
                    >
                      {card}
                    </div>
                  ))}
                  <div className="rounded-lg px-3 py-2 text-xs border border-dashed text-center border-brand-mint text-[#9EC8B9]">
                    + Add task
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: "white" }}>
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-brand-primary">
            Features
          </p>
          <h2 className="text-3xl font-bold mb-12 max-w-md text-brand-dark">
            Everything you need to stay on track, in one place.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-brand-tint rounded-xl p-6 border border-brand-card-bg transition-shadow hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-brand-card-bg">
                  <Icon className="w-5 h-5 text-brand-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1 text-brand-dark">
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#3a5a54" }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-6">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-brand-primary">
          How it works
        </p>
        <h2 className="text-3xl font-bold mb-12 text-brand-dark">
          Up and running in minutes.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-brand-primary">
                {step.number}
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-brand-dark">
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#3a5a54" }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-brand-primary">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to clear the chaos?
          </h2>
          <p className="text-base mb-8 text-brand-mint">
            Take control of your work and get more done with ZC-TASK. Sign up
            today and start your first board for free.
          </p>

          {isSignedIn ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-white text-brand-primary inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
            >
              Go to your boards <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <SignUpButton>
              <button className="bg-white text-brand-primary inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90">
                Create your first board <ArrowRight className="w-4 h-4" />
              </button>
            </SignUpButton>
          )}
        </div>
      </section>
    </main>
  );
}
