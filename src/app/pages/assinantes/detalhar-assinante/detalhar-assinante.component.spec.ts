import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalharAssinanteComponent } from './detalhar-assinante.component';

describe('DetalharAssinanteComponent', () => {
  let component: DetalharAssinanteComponent;
  let fixture: ComponentFixture<DetalharAssinanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalharAssinanteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalharAssinanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
