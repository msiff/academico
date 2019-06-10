import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Datatables
import { DataTablesModule } from 'angular-datatables';

// Componentes
import { UsuariosComponent } from './usuarios/usuarios.component';

// Rutas del modulo
import { AdministracionRouting } from './administracion-routing';

// Modulos
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    UsuariosComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    AdministracionRouting,
    FormsModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    ReactiveFormsModule
  ]
})
export class AdministracionModule { }
