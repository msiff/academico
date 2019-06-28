import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Datatables
import { DataTablesModule } from 'angular-datatables';

// Componentes
import { UsuariosComponent } from './usuarios/usuarios.component';
import { OptionsComponent } from './options/options.component';

// Rutas del modulo
import { AdministracionRouting } from './administracion-routing';

// Modulos
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';

// Guards
import { AdminGuard } from '../../services/admin.guard';

@NgModule({
  declarations: [
    UsuariosComponent,
    OptionsComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    AdministracionRouting,
    FormsModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [
    AdminGuard
  ]
})
export class AdministracionModule { }
