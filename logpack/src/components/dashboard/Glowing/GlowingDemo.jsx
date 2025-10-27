// components/ui/Glowing/GlowingDemo.jsx
"use client";
import { DollarSign, Users, Wallet } from "lucide-react";
import { GlowingEffect } from "./glowing-effect";

export function GlowingEffectDemo() {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-4 w-full">
      <GridItem
        icon={<Wallet className="h-4 w-4 text-chart-4 dark:text-neutral-400" />}
        title="P P"
        description="$3,567.80"
      />
      <GridItem
        icon={<Users className="h-4 w-4 text-chart-4 dark:text-neutral-400" />}
        title="P L A"
        description="$1,189.53"
      />
      <GridItem
        icon={<DollarSign className="h-4 w-4 text-chart-4 dark:text-neutral-400" />}
        title="Solvente"
        description="$2,651.50"
      />
      <GridItem
        icon={<DollarSign className="h-4 w-4 text-chart-4 dark:text-neutral-400" />}
        title="Água"
        description="$5,367.54"
      />
    </ul>
  );
}

const GridItem = ({ icon, title, description }) => {
  return (
    <li className="min-h-[8rem] list-none">
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-chart-5 p-2">
              {icon}
            </div>
            <div className="space-y-1">
              <h2 className="font-sans text-2xl font-bold text-black md:text-3xl dark:text-white">
                {description}
              </h2>
              <h3 className="-tracking-4 pt-0.5 font-sans text-sm font-semibold text-balance text-black dark:text-neutral-400">
                {title}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};