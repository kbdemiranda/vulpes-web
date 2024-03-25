export interface Servico {
  id: number;
  nome: string;
  preco: number;
  url: string;
  tipo_servico: string;
  total_vagas: number;
  vagas_disponiveis: number;
  imagem: string;
  cadastrado_em: string;
  atualizado_em?: string; // Opcional pois nem todos os objetos têm esta chave
}
