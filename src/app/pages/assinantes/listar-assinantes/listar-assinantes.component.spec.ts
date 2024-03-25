import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAssinantesComponent } from './listar-assinantes.component';

describe('ListarAssinantesComponent', () => {
  let component: ListarAssinantesComponent;
  let fixture: ComponentFixture<ListarAssinantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarAssinantesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarAssinantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
