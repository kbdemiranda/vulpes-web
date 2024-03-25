import {Servico} from "./servico";

export interface Assinante {
  id: number;
  nome: string;
  email: string;
  servicos: Servico[];
  imagem: string;
}
