import {Component, OnInit} from '@angular/core';
import {Assinante} from "../../../models/assinante";
import {AssinanteService} from "../../../services/assinante.service";

@Component({
  selector: 'app-listar-assinantes',
  templateUrl: './listar-assinantes.component.html',
  styleUrls: ['./listar-assinantes.component.scss']
})
export class ListarAssinantesComponent implements OnInit{

  // assinantes: Assinante[]= [
  //   {
  //     id: 1,
  //     nome: 'Bruce Wayne',
  //     email: 'bruce@wayne.com',
  //     servicos: [{
  //       id: 1,
  //       nome: "Disney+ e Star+",
  //       preco: 0.00,
  //       url: "https://www.disneyplus.com/",
  //       tipo_servico: "STREAMING_VIDEO",
  //       total_vagas: 5,
  //       vagas_disponiveis: 1,
  //       imagem: '/assets/fox.svg',
  //       cadastrado_em: "2023-10-11T21:00:00",
  //       atualizado_em: "2023-10-17T12:13:48.028599"
  //     }],
  //     imagem: '/assets/user.svg'
  //   },
  //   {
  //     id: 2,
  //     nome: 'Clark Kent',
  //     email: 'clark@dailyplanet.com',
  //     servicos: [{
  //       id: 2,
  //       nome: "HBO Max",
  //       preco: 0.00,
  //       url: "https://www.hbomax.com/",
  //       tipo_servico: "STREAMING_VIDEO",
  //       total_vagas: 5,
  //       vagas_disponiveis: 2,
  //       imagem: '/assets/superman.svg',
  //       cadastrado_em: "2023-11-01T10:00:00",
  //       atualizado_em: "2023-11-05T09:20:30.123456"
  //     }],
  //     imagem: '/assets/user.svg'
  //   },
  //
  //   {
  //     id: 3,
  //     nome: 'Diana Prince',
  //     email: 'diana@themyscira.com',
  //     servicos: [{
  //       id: 3,
  //       nome: "Netflix",
  //       preco: 0.00,
  //       url: "https://www.netflix.com/",
  //       tipo_servico: "STREAMING_VIDEO",
  //       total_vagas: 5,
  //       vagas_disponiveis: 3,
  //       imagem: '/assets/wonderwoman.svg',
  //       cadastrado_em: "2023-11-10T15:30:00",
  //       atualizado_em: "2023-11-12T11:45:22.334455"
  //     }],
  //     imagem: '/assets/user.svg'
  //   },
  //
  //   {
  //     id: 4,
  //     nome: 'Barry Allen',
  //     email: 'barry@ccpd.com',
  //     servicos: [{
  //       id: 4,
  //       nome: "Amazon Prime Video",
  //       preco: 0.00,
  //       url: "https://www.primevideo.com/",
  //       tipo_servico: "STREAMING_VIDEO",
  //       total_vagas: 5,
  //       vagas_disponiveis: 4,
  //       imagem: '/assets/flash.svg',
  //       cadastrado_em: "2023-12-01T08:20:00",
  //       atualizado_em: "2023-12-03T10:10:10.101010"
  //     }],
  //     imagem: '/assets/user.svg'
  //   },
  //
  //   {
  //     id: 5,
  //     nome: 'Arthur Curry',
  //     email: 'arthur@atlantis.com',
  //     servicos: [{
  //       id: 5,
  //       nome: "Disney+",
  //       preco: 0.00,
  //       url: "https://www.disneyplus.com/",
  //       tipo_servico: "STREAMING_VIDEO",
  //       total_vagas: 5,
  //       vagas_disponiveis: 5,
  //       imagem: '/assets/aquaman.svg',
  //       cadastrado_em: "2024-01-20T14:40:00",
  //       atualizado_em: "2024-01-25T16:50:50.505050"
  //     }],
  //     imagem: '/assets/user.svg'
  //   },
  //
  //   {
  //     id: 6,
  //     nome: 'Victor Stone',
  //     email: 'victor@starlabs.com',
  //     servicos: [{
  //       id: 6,
  //       nome: "Apple TV+",
  //       preco: 0.00,
  //       url: "https://www.apple.com/apple-tv-plus/",
  //       tipo_servico: "STREAMING_VIDEO",
  //       total_vagas: 5,
  //       vagas_disponiveis: 0,
  //       imagem: '/assets/cyborg.svg',
  //       cadastrado_em: "2024-02-15T19:00:00",
  //       atualizado_em: "2024-02-18T20:20:20.202020"
  //     }],
  //     imagem: '/assets/user.svg'
  //   }
  //
  // ];
  assinantes: Assinante[] = [];
  totalPages: number = 0;
  currentPage: number = 0;


  constructor(private assinanteService: AssinanteService) {}


  ngOnInit(): void {
    this.carregarAssinantes();
  }

  carregarAssinantes(page: number = 0): void {
    this.assinanteService.getAssinantes(page).subscribe({
      next: (pagina) => {
        this.assinantes = pagina.content;
        this.totalPages = pagina.totalPages;
        this.currentPage = pagina.number;
      },
      error: (erro) => console.error(erro),
      complete: () => console.log('Carregamento de assinantes completo')
    });
  }


}
