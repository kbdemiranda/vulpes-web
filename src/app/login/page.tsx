"use client";

import { useState } from "react";
import { Api } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await Api.login({ email, senha });
      setToken(res.token);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Falha no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="theme-transition mx-auto max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow">
      <h1 className="mb-6 text-2xl font-semibold" style={{ color: "var(--primary)" }}>Vulpes — Login</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm" style={{ color: "var(--muted)" }}>Email</label>
          <input
            type="email"
            className="theme-transition w-full rounded-md border border-[var(--border)] bg-[var(--input)] p-2 outline-none focus:outline-[var(--primary)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm" style={{ color: "var(--muted)" }}>Senha</label>
          <input
            type="password"
            className="theme-transition w-full rounded-md border border-[var(--border)] bg-[var(--input)] p-2 outline-none focus:outline-[var(--primary)]"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="theme-transition w-full rounded-md p-2 font-medium text-[var(--fg)] disabled:opacity-50"
          style={{ background: "var(--primary)" }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
