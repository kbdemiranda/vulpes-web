import { TestBed } from '@angular/core/testing';

import { AutenteicacaoInterceptor } from './autenteicacao.interceptor';

describe('AutenteicacaoInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AutenteicacaoInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AutenteicacaoInterceptor = TestBed.inject(AutenteicacaoInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
