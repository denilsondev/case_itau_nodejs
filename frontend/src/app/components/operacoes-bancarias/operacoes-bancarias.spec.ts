import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacoesBancarias } from './operacoes-bancarias';

describe('OperacoesBancarias', () => {
  let component: OperacoesBancarias;
  let fixture: ComponentFixture<OperacoesBancarias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperacoesBancarias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperacoesBancarias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
