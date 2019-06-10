import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// Componentes
import { TipoModalidadesComponent } from './tipo-modalidades/tipo-modalidades.component';
import { ListadoModalidadesComponent } from './listado-modalidades/listado-modalidades.component';


const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Modalidades'
        },
        children: [
            {
                path: '',
                redirectTo: 'listado-modalidades'
            },
            {
                path: 'listado-modalidades',
                component: ListadoModalidadesComponent,
                data: {
                    title: 'Lista de Modalidades'
                }
            },
            {
                path: 'tipo-modalidades',
                component: TipoModalidadesComponent,
                data: {
                    title: 'Tipos de modalidades'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModalidadesRouting { }
