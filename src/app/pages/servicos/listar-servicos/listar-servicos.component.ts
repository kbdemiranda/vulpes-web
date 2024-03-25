import { Component } from '@angular/core';
import {Servico} from "../../../models/servico";

@Component({
  selector: 'app-listar-servicos',
  templateUrl: './listar-servicos.component.html',
  styleUrls: ['./listar-servicos.component.scss']
})
export class ListarServicosComponent {

  servicos: Servico[] = [
    {
      id: 1,
      nome: "Disney+ e Star+",
      preco: 0.00,
      url: "https://www.disneyplus.com/",
      tipo_servico: "STREAMING_VIDEO",
      total_vagas: 5,
      vagas_disponiveis: 1,
      imagem: '/assets/images/fox.svg',
      cadastrado_em: "2023-10-11T21:00:00",
      atualizado_em: "2023-10-17T12:13:48.028599"
    },
    {
      id: 2,
      nome: "HBO Max",
      preco: 24.43,
      url: "https://hbomax.com/",
      tipo_servico: "STREAMING_VIDEO",
      total_vagas: 5,
      vagas_disponiveis: 1,
      imagem: '/assets/images/fox.svg',
      cadastrado_em: "2023-10-11T21:00:00"
    },
    {
      id: 3,
      nome: "Microsoft 365 Family",
      preco: 0.00,
      url: "https://www.office.com/",
      tipo_servico: "SOFTWARE",
      total_vagas: 5,
      vagas_disponiveis: 2,
      imagem: '/assets/images/fox.svg',
      cadastrado_em: "2023-10-11T21:00:00"
    },
    {
      id: 4,
      nome: "Prime Vídeo",
      preco: 10.00,
      url: "https://www.primevideo.com/",
      tipo_servico: "STREAMING_VIDEO",
      total_vagas: 5,
      vagas_disponiveis: 3,
      imagem: '/assets/images/fox.svg',
      cadastrado_em: "2023-10-11T21:00:00"
    },
    {
      id: 5,
      nome: "Spotify",
      preco: 34.90,
      url: "https://spotify.com/",
      tipo_servico: "STREAMING_MUSICA",
      total_vagas: 6,
      vagas_disponiveis: 0,
      imagem: '/assets/images/fox.svg',
      cadastrado_em: "2023-10-11T21:00:00"
    },
    {
      id: 6,
      nome: "Youtube Premium",
      preco: 41.90,
      url: "https://www.youtube.com/",
      tipo_servico: "STREAMING_VIDEO",
      total_vagas: 5,
      vagas_disponiveis: 2,
      imagem: '/assets/images/fox.svg',
      cadastrado_em: "2023-10-11T21:00:00"
    }
  ]
}
