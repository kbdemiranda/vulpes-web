import type { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <section className="relative min-h-dvh">
      {/* Fundo com gradiente sutil para combinar com o tema */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/15 via-transparent to-violet-700/20" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative grid min-h-dvh place-items-center px-4 py-10">
        <div
          className="w-full max-w-md overflow-hidden rounded-2xl border shadow-lg"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          {/* Cabeçalho do cartão de login */}
          <div
            className="flex items-center gap-3 border-b px-6 py-5"
            style={{ borderColor: "var(--border)" }}
          >
            <span
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
              style={{ background: "var(--primary)" }}
            >
              <img src="/logo.svg" alt="Logo" className="h-5" />
            </span>
            <div>
              <h1 className="text-base font-semibold" style={{ color: "var(--fg)" }}>
                Acessar Vulpes
              </h1>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Entre com suas credenciais para continuar
              </p>
            </div>
          </div>

          {/* Área do formulário de login (conteúdo da página) */}
          <div className="px-6 py-6">{children}</div>

          {/* Rodapé opcional */}
          <div
            className="flex items-center justify-between border-t px-6 py-4 text-xs"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            <span>© {new Date().getFullYear()} Vulpes</span>
            <span>Segurança em primeiro lugar</span>
          </div>
        </div>
      </div>
    </section>
  );
}
