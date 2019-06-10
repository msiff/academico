import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// Componentes
import { ListadoPadresComponent } from './listado-padres/listado-padres.component';


const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Padres'
        },
        children: [
            {
                path: '',
                redirectTo: 'listado-padres'
            },
            {
                path: 'listado-padres',
                component: ListadoPadresComponent,
                data: {
                    title: 'Lista de padres'
                }
            }
        ]
 }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PadresRouting {}
