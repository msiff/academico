import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Componentes del modulo
import { TipoModalidadesComponent } from './tipo-modalidades/tipo-modalidades.component';
import { ListadoModalidadesComponent } from './listado-modalidades/listado-modalidades.component';

// Rutas del modulo
import { ModalidadesRouting } from './modalidades.routing';

// Modulos externos
import { AlertModule } from 'ngx-bootstrap/alert';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    declarations: [
        TipoModalidadesComponent,
        ListadoModalidadesComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ModalidadesRouting,
        AlertModule.forRoot(),
        ModalModule.forRoot(),
        DataTablesModule,
        BsDatepickerModule.forRoot(),
        NgSelectModule
    ],
    exports: [],
    providers: [],
})
export class ModalidadesModule {}
