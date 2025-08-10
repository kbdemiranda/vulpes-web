"use client";

import Protected from "@/components/Protected";
import { Api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function PagamentosPage() {
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
      setError(e?.message || "Erro ao carregar pagamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Protected>
      <h1 className="mb-4 text-2xl font-semibold" style={{ color: "var(--primary)" }}>
        Pagamentos
      </h1>
      <section className="theme-transition rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lista</h2>
          <button onClick={fetchData} className="theme-transition rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
            {loading ? "Carregando..." : "Atualizar"}
          </button>
        </div>
        {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
        <pre className="theme-transition overflow-auto rounded bg-[var(--bg)] p-3 text-xs">{JSON.stringify(data, null, 2)}</pre>
      </section>
    </Protected>
  );
}

