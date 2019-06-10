import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// componentes
import { UsuariosComponent } from './usuarios/usuarios.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Administracion'
        },
        children: [
            {
                path: '',
                redirectTo: 'usuarios'
            },
            {
                path: 'usuarios',
                component: UsuariosComponent,
                data: {
                    title: 'Usuarios'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministracionRouting { }
