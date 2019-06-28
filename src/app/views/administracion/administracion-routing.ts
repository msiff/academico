import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// componentes
import { UsuariosComponent } from './usuarios/usuarios.component';
import { OptionsComponent } from './options/options.component';

// Guards
import { AdminGuard } from '../../services/admin.guard';

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
            },
            {
                path: 'opciones',
                component: OptionsComponent,
                data: {
                    title: 'Opciones'
                },
                canActivate: [AdminGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministracionRouting { }
