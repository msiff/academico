import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Componentes del modulo
import { ListadoPadresComponent } from './listado-padres/listado-padres.component';
import { AltaPadreComponent } from './alta-padre/alta-padre.component';

// Rutas del modulo
import { PadresRouting } from './padres.routing';

// Modulos externos
import { AlertModule } from 'ngx-bootstrap/alert';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
    declarations: [
        ListadoPadresComponent,
        AltaPadreComponent
    ],
    imports: [
        CommonModule,
        PadresRouting,
        AlertModule.forRoot(),
        DataTablesModule,
        ModalModule.forRoot(),
        FormsModule
    ],
    exports: [AltaPadreComponent],
    providers: [],
})
export class PadresModule {}
