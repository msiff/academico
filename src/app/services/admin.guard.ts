import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { User } from '../models/userModel';

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let identity = <User>{};
        identity = JSON.parse(sessionStorage.getItem('identity'));
        if (identity.role === 'admin') {
            // Es admin, entonces retorno true;
            return true;
        }
        // no es admin, retorno al inicio.
        this.router.navigate(['/dashboard']);
        return false;
    }
}
