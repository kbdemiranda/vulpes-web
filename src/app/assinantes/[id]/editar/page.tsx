"use client";

import Protected from "@/components/Protected";
import { Api } from "@/lib/api";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function EditarAssinantePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = use(params);
  const id = Number(idParam);
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoadingData(true);
        const a = await Api.getAssinante(id);
        if (!isMounted) return;
        setNome(a?.nome ?? a?.name ?? "");
        setEmail(a?.email ?? a?.Email ?? "");
      } catch (e: any) {
        setError(e?.message || "Erro ao carregar assinante");
      } finally {
        setLoadingData(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body: any = {
        nome,
        email,
      };
      await Api.atualizarAssinante(id, body);
      router.push(`/assinantes/${id}`);
    } catch (e: any) {
      setError(e?.message || "Erro ao atualizar assinante");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Protected>
      <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
        <section
          className={[
            "group relative w-full max-w-2xl rounded-2xl border p-5 transition-all",
            "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]",
            "backdrop-blur-sm",
          ].join(" ")}
          style={{
            borderColor: "var(--border)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.0))",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(600px 200px at 0% 0%, rgba(139,92,246,0.08), transparent 60%)",
            }}
          />
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>
                Editar Assinante
              </h3>
              <Link
                href={`/assinantes/${id}`}
                className="rounded-md border p-2"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                aria-label="Fechar"
                title="Fechar"
              >
                <FontAwesomeIcon icon={faXmark} />
              </Link>
            </div>

            {error && <p className="mb-2 text-sm text-red-400">{error}</p>}

            {loadingData ? (
              <p className="text-sm opacity-80">Carregando...</p>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm" style={{ color: "var(--muted)" }}>
                      Nome
                    </label>
                    <input
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--input)] p-3 outline-none transition focus:ring-2 focus:ring-[var(--primary)]/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm" style={{ color: "var(--muted)" }}>
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--input)] p-3 outline-none transition focus:ring-2 focus:ring-[var(--primary)]/30"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Link
                    href={`/assinantes/${id}`}
                    className="rounded-md border px-4 py-2"
                    style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                  >
                    Cancelar
                  </Link>
                  <button
                    disabled={loading}
                    className="rounded-md px-4 py-2"
                    style={{ background: "var(--primary)", color: "var(--fg)" }}
                  >
                    {loading ? "Salvando..." : "Salvar alterações"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </Protected>
  );
}
