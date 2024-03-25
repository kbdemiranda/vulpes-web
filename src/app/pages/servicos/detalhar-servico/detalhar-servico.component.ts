import { Component } from '@angular/core';
import {Servico} from "../../../models/servico";

@Component({
  selector: 'app-detalhar-servico',
  templateUrl: './detalhar-servico.component.html',
  styleUrls: ['./detalhar-servico.component.scss']
})
export class DetalharServicoComponent {

  tiposServico = [
    { id: 'STREAMING_VIDEO', descricao: 'Streaming de Vídeo' },
    { id: 'STREAMING_MUSICA', descricao: 'Streaming de Música' },
    { id: 'SOFTWARE', descricao: 'Software' },
    { id: 'JOGOS', descricao: 'Jogos' },
    { id: 'NOTICIAS', descricao: 'Notícias' },
    { id: 'CLOUD_STORAGE', descricao: 'Armazenamento na Nuvem' },
    { id: 'FITNESS', descricao: 'Fitness' }
  ];

  servico: Servico = {
    id: 1,
    nome: 'MAX',
    preco: 34.90,
    url: 'https://www.max.com',
    tipo_servico: 'Streaming de Vídeo',
    total_vagas: 5,
    vagas_disponiveis: 2,
    imagem: '/assets/images/fox.svg',
    cadastrado_em: '2021-01-01T00:00:00Z',
  }

}
