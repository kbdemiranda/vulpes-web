import { Component } from '@angular/core';
import {Assinante} from "../../../models/assinante";

@Component({
  selector: 'app-detalhar-assinante',
  templateUrl: './detalhar-assinante.component.html',
  styleUrls: ['./detalhar-assinante.component.scss']
})
export class DetalharAssinanteComponent {
  assinante: Assinante = {
    id: 1,
    nome: 'Bruce Wayne',
    email: 'bruce@wayne.com',
    servicos: [{
      id: 1,
      nome: "Disney+ e Star+",
      preco: 0.00,
      url: "https://www.disneyplus.com/",
      tipo_servico: "STREAMING_VIDEO",
      total_vagas: 5,
      vagas_disponiveis: 1,
      imagem: '/assets/fox.svg',
      cadastrado_em: "2023-10-11T21:00:00",
      atualizado_em: "2023-10-17T12:13:48.028599"
    }],
    imagem: '/assets/images/user.svg'
  };

}
