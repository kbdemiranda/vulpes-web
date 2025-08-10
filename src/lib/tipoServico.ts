import type { Plataforma } from "./types";

export type TipoServico = Plataforma["tipo_servico"];

const labels: Record<TipoServico, string> = {
  STREAMING_VIDEO: "Streaming de Vídeo",
  STREAMING_MUSICA: "Streaming de Música",
  SOFTWARE: "Software",
  JOGOS: "Jogos",
  NOTICIAS: "Notícias",
  CLOUD_STORAGE: "Armazenamento em Nuvem",
  FITNESS: "Fitness",
};

function normalize(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// Mapa adicional de sinônimos comuns (PT/EN) para robustez no "vise e versa"
const synonyms: Record<string, TipoServico> = (() => {
  const entries: Array<[string, TipoServico]> = [
    ["streaming de video", "STREAMING_VIDEO"],
    ["streaming de vídeo", "STREAMING_VIDEO"],
    ["video", "STREAMING_VIDEO"],
    ["vídeo", "STREAMING_VIDEO"],

    ["streaming de musica", "STREAMING_MUSICA"],
    ["streaming de música", "STREAMING_MUSICA"],
    ["musica", "STREAMING_MUSICA"],
    ["música", "STREAMING_MUSICA"],
    ["audio", "STREAMING_MUSICA"],
    ["áudio", "STREAMING_MUSICA"],

    ["software", "SOFTWARE"],

    ["jogos", "JOGOS"],
    ["games", "JOGOS"],
    ["game", "JOGOS"],

    ["noticias", "NOTICIAS"],
    ["notícias", "NOTICIAS"],
    ["news", "NOTICIAS"],

    ["cloud storage", "CLOUD_STORAGE"],
    ["armazenamento em nuvem", "CLOUD_STORAGE"],
    ["armazenamento na nuvem", "CLOUD_STORAGE"],
    ["nuvem", "CLOUD_STORAGE"],

    ["fitness", "FITNESS"],
    ["saude", "FITNESS"],
    ["saúde", "FITNESS"],
    ["exercicio", "FITNESS"],
    ["exercício", "FITNESS"],
  ];

  const map: Record<string, TipoServico> = {};
  for (const [label, value] of entries) {
    map[normalize(label)] = value;
  }
  // Também aceitar diretamente os próprios labels oficiais
  (Object.keys(labels) as TipoServico[]).forEach((k) => {
    map[normalize(labels[k])] = k;
  });
  return map;
})();

export const TIPO_SERVICO_LABELS: Record<TipoServico, string> = labels;

export const TIPO_SERVICO_OPTIONS: Array<{ value: TipoServico; label: string }> = (Object.keys(labels) as TipoServico[]).map((k) => ({
  value: k,
  label: labels[k],
}));

export function tipoServicoToLabel(value?: string | null): string | undefined {
  if (!value) return undefined;
  // Se já for um label conhecido, retorna ele; se for o enum, converte
  const asEnum = (Object.keys(labels) as TipoServico[]).find((k) => k === value);
  if (asEnum) return labels[asEnum];
  // Senão, tentar normalizar e ver se bate em algum label conhecido
  const bySyn = synonyms[normalize(value)];
  if (bySyn) return labels[bySyn];
  // Fallback: retorna o próprio valor
  return value;
}

export function labelToTipoServico(label?: string | null): TipoServico | undefined {
  if (!label) return undefined;
  const norm = normalize(label);
  // Caso já venham os enums
  const direct = (Object.keys(labels) as TipoServico[]).find((k) => normalize(k) === norm);
  if (direct) return direct;
  // Sinônimos e labels oficiais
  return synonyms[norm];
}
