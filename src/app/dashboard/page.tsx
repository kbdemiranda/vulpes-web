"use client";

import Protected from "@/components/Protected";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCloud, faCreditCard } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  return (
    <Protected>
      <div
        className="relative min-h-[72vh]"
        style={{
          background:
            "radial-gradient(1200px 600px at -20% -10%, rgba(120,119,198,0.15), transparent 60%), radial-gradient(1000px 600px at 130% 20%, rgba(16,185,129,0.12), transparent 60%)",
        }}
      >
        <main className="pb-10">
          <HeaderBar title="Dashboard" subtitle="Bem‑vindo de volta" />

          <div className="grid grid-cols-12 gap-5">
            <QuickLinkCard
              className="col-span-12 sm:col-span-4"
              href="/assinantes"
              label="Assinantes"
              icon={<FontAwesomeIcon icon={faUsers} className="text-white/90" />}
              bubbleGradient="from-fuchsia-500 to-violet-600"
            />
            <QuickLinkCard
              className="col-span-12 sm:col-span-4"
              href="/plataformas"
              label="Plataformas"
              icon={<FontAwesomeIcon icon={faCloud} className="text-white/90" />}
              bubbleGradient="from-sky-500 to-cyan-500"
            />
            <QuickLinkCard
              className="col-span-12 sm:col-span-4"
              href="/pagamentos"
              label="Pagamentos"
              icon={<FontAwesomeIcon icon={faCreditCard} className="text-white/90" />}
              bubbleGradient="from-amber-500 to-orange-500"
            />

            <WidgetCard className="col-span-12 md:col-span-8 h-48 md:h-56">
              <div className="flex h-full items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold" style={{ color: "var(--fg)" }}>
                    Visão geral
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                    Suas métricas em um só lugar.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <MiniStat label="Assinantes" value="—" />
                    <MiniStat label="Receitas" value="—" />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <HeroStackCard />
                </div>
              </div>
            </WidgetCard>

            <StatSkeleton className="col-span-12 md:col-span-4 h-48 md:h-56" />
          </div>
        </main>
      </div>
    </Protected>
  );
}

/* UI Components */

function HeaderBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--primary)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}

function WidgetCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={[
        "group relative rounded-2xl border p-5 transition-all",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] hover:shadow-xl",
        "backdrop-blur-sm",
        className || "",
      ].join(" ")}
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.0))",
        borderColor: "var(--border)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px 200px at 0% 0%, rgba(139,92,246,0.08), transparent 60%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

function QuickLinkCard({
  href,
  label,
  icon,
  bubbleGradient = "from-fuchsia-500 to-violet-600",
  className,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  bubbleGradient?: string;
  className?: string;
}) {
  const router = useRouter();
  return (
    <WidgetCard className={["h-28 cursor-pointer", className || ""].join(" ")}>
      <button
        onClick={() => router.push(href)}
        className="flex h-full w-full items-center gap-3 text-left"
        aria-label={label}
      >
        <span
          className={[
            "inline-flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg",
            "bg-gradient-to-br",
            bubbleGradient,
          ].join(" ")}
        >
          {icon}
        </span>
        <span className="text-lg font-semibold" style={{ color: "var(--fg)" }}>
          {label}
        </span>
      </button>
    </WidgetCard>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold" style={{ color: "var(--fg)" }}>
        {value}
      </div>
    </div>
  );
}

function HeroStackCard() {
  return (
    <div className="relative h-40 w-40">
      <div className="absolute right-3 top-2 h-24 w-24 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 opacity-70 blur-[1px]" />
      <div className="absolute right-8 top-6 h-28 w-28 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 opacity-80" />
      <div className="absolute right-0 top-0 h-28 w-28 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-700 shadow-2xl shadow-violet-700/30" />
    </div>
  );
}

function StatSkeleton({ className }: { className?: string }) {
  return (
    <WidgetCard className={["overflow-hidden", className || ""].join(" ")}>
      <div
        className="h-full w-full animate-pulse rounded-xl"
        style={{
          background:
            "linear-gradient(100deg, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.04) 40%)",
          backgroundSize: "200% 100%",
        }}
      />
    </WidgetCard>
  );
}
