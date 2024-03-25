import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalharServicoComponent } from './detalhar-servico.component';

describe('DetalharServicoComponent', () => {
  let component: DetalharServicoComponent;
  let fixture: ComponentFixture<DetalharServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalharServicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalharServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
