"use client";

import Protected from "@/components/Protected";

export default function ProfilePage() {
  return (
    <Protected>
      <h1 className="mb-4 text-2xl font-semibold" style={{ color: "var(--primary)" }}>
        Perfil
      </h1>
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Em breve: detalhes do usuário, alteração de senha e preferências.
      </p>
    </Protected>
  );
}

