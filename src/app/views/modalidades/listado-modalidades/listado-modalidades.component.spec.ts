import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoModalidadesComponent } from './listado-modalidades.component';

describe('ListadoModalidadesComponent', () => {
  let component: ListadoModalidadesComponent;
  let fixture: ComponentFixture<ListadoModalidadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoModalidadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoModalidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
