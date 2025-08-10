"use client";

import Protected from "@/components/Protected";
import { Api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCloud, faCreditCard } from "@fortawesome/free-solid-svg-icons";

type Panel = "subscribers" | "platforms" | "payments";

export default function Dashboard() {
  const [active, setActive] = useState<Panel | null>(null);

  return (
    <Protected>
      <h1 className="mb-6 text-2xl font-semibold" style={{ color: "var(--primary)" }}>
        Vulpes — Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Square href="/assinantes" label="Assinantes" icon={<FontAwesomeIcon icon={faUsers} style={{ color: "var(--fg)" }} />} />
        <Square href="/plataformas" label="Plataformas" icon={<FontAwesomeIcon icon={faCloud} style={{ color: "var(--fg)" }} />} />
        <Square href="/pagamentos" label="Pagamentos" icon={<FontAwesomeIcon icon={faCreditCard} style={{ color: "var(--fg)" }} />} />
      </div>

      <div className="mt-6">
        {active === "subscribers" && <SubscribersView />}
        {active === "platforms" && <PlatformsView />}
        {active === "payments" && <PaymentsView />}
        {!active && (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Selecione um quadro acima para carregar os dados.
          </p>
        )}
      </div>
    </Protected>
  );
}

function Square({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      className="theme-transition h-28 w-full rounded-lg border p-4 text-left text-lg font-semibold hover:opacity-90"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
        color: "var(--fg)",
      }}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md" style={{ background: "var(--bg)" }}>
          {icon}
        </span>
        <span>{label}</span>
      </div>
    </button>
  );
}

function Box({ title, children, onRefresh, loading }: { title: string; children: React.ReactNode; onRefresh: () => void; loading: boolean }) {
  return (
    <section className="theme-transition rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button onClick={onRefresh} className="theme-transition rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>
      {children}
    </section>
  );
}

function SubscribersView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await Api.listarAssinantes({ pagina: 0, quantidade: 10 });
      setData(res);
    } catch (e: any) {
      setError(e?.message || "Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box title="Assinantes" onRefresh={fetchData} loading={loading}>
      {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
      <pre className="theme-transition overflow-auto rounded bg-[var(--bg)] p-3 text-xs">{JSON.stringify(data, null, 2)}</pre>
    </Box>
  );
}

function PlatformsView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await Api.listarPlataformas({ pagina: 0, quantidade: 10 });
      setData(res);
    } catch (e: any) {
      setError(e?.message || "Failed to load platforms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box title="Plataformas" onRefresh={fetchData} loading={loading}>
      {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
      <pre className="theme-transition overflow-auto rounded bg-[var(--bg)] p-3 text-xs">{JSON.stringify(data, null, 2)}</pre>
    </Box>
  );
}

function PaymentsView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await Api.listarPagamentos({ pagina: 0, quantidade: 10 });
      setData(res);
    } catch (e: any) {
      setError(e?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box title="Pagamentos" onRefresh={fetchData} loading={loading}>
      {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
      <pre className="theme-transition overflow-auto rounded bg-[var(--bg)] p-3 text-xs">{JSON.stringify(data, null, 2)}</pre>
    </Box>
  );
}
