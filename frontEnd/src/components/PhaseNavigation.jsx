import { Sprout, Activity, Wheat, BadgeIndianRupee } from "lucide-react";

const PHASES = [
  { key: "planning", label: "Phase 1: Planning", icon: Sprout },
  { key: "health", label: "Phase 2: Health", icon: Activity },
  { key: "harvesting", label: "Phase 3: Harvesting", icon: Wheat },
  { key: "selling", label: "Phase 4: Selling", icon: BadgeIndianRupee },
];

function PhaseNavigation({ currentPhase, onPhaseChange, className = "" }) {
  return (
    <div className={className}>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2">
        <div className="mb-2 px-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-400">Workspace</p>
        </div>
        <div className="space-y-1.5">
          {PHASES.map((phase) => {
            const Icon = phase.icon;
            const active = currentPhase === phase.key;

            return (
              <button
                key={phase.key}
                type="button"
                onClick={() => onPhaseChange(phase.key)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-[13px] font-semibold transition-all ${
                  active
                    ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-900/30"
                    : "text-brand-200 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${active ? "bg-white/15" : "bg-white/[0.06]"}`}>
                  <Icon size={16} />
                </span>
                <span>{phase.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PhaseNavigation;
