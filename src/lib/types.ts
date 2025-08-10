export type ErrorResponse = {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
};

export type TokenResponse = {
  token: string;
};

export type LoginRequest = {
  email: string;
  senha: string;
};

export type Usuario = {
  id?: number;
  nome: string;
  sobrenome: string;
  email: string;
  senha?: string;
  perfis_id: number[];
};

export type Plataforma = {
  id?: number;
  nome: string;
  preco: number;
  url?: string;
  tipo_servico: "STREAMING_VIDEO" | "STREAMING_MUSICA" | "SOFTWARE" | "JOGOS" | "NOTICIAS" | "CLOUD_STORAGE" | "FITNESS";
  total_vagas: number;
  vagas_disponiveis?: number;
};

export type Pagamento = {
  id?: number;
  assinante_id: number;
  valor_pago: number;
  meses_cobertos: number;
  meses?: string[];
  data_pagamento?: string;
};

export type PlataformaResumo = {
  id: number;
  nome: string;
  precoMensal: number;
  precoIndividual: number;
};

export type Assinante = {
  id?: number;
  nome: string;
  email: string;
  plataformas_associadas?: PlataformaResumo[];
  valor_por_mes?: number;
};

