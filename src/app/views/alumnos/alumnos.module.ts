import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Componentes del modulo
import { ListadoAlumnosComponent } from './listado-alumnos/listado-alumnos.component';
import { EditarAlumnoComponent } from './editar-alumno/editar-alumno.component';

// Rutas del modulo
import { AlumnosRouting } from './alumnos.routing';

// Modulos externos
import { AlertModule } from 'ngx-bootstrap/alert';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';

// Modulos propios
import { PadresModule } from '../padres/padres.module';

// RECOMMENDED
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    declarations: [
        ListadoAlumnosComponent,
        EditarAlumnoComponent,
    ],
    imports: [
        CommonModule,
        AlertModule.forRoot(),
        DataTablesModule,
        ModalModule.forRoot(),
        FormsModule,
        AlumnosRouting,
        NgSelectModule,
        PadresModule,
        BsDatepickerModule.forRoot()
     ],
    exports: [],
    providers: [],
})
export class AlumnosModule {}
