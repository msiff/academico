import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// Componentes
import { ListadoAlumnosComponent } from './listado-alumnos/listado-alumnos.component';
import { EditarAlumnoComponent } from './editar-alumno/editar-alumno.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Alumnos'
        },
        children: [
            {
                path: '',
                redirectTo: 'listado-alumnos'
            },
            {
                path: 'listado-alumnos',
                component: ListadoAlumnosComponent,
                data: {
                    title: 'Lista de alumnos'
                }
            },
            {
                path: 'editar-alumno',
                component: EditarAlumnoComponent,
                data: {
                    title: 'Editar alumno'
                }
            }
        ]
 }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AlumnosRouting {}
