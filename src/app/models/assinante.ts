import {Servico} from "./servico";

export interface Assinante {
  id: number;
  nome: string;
  email: string;
  servicos: Servico[];
  imagem: string;
}

export interface AssinanteDetalhado extends Assinante{
  plataformas_associadas: Servico[];
  valor_por_mes: number;
}
