import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

// Services
import { GLOBAL } from './global.service';
import { TipoModality } from '../models/tipoModalityModel';

@Injectable()
export class TipoModalityService {
    public url: string;
    public identity;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    getIdentity() {
        const identity = JSON.parse(localStorage.getItem('identity'));
        if (identity !== 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }

    getTipoModalitys() {
        // user lleva el usuario que esta logueado al momento de hacer la peticion, para poder dejar registro en el sv.
        const user = JSON.stringify(this.getIdentity());
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });
        return this._http.get(this.url + 'getTipoModalitys', { headers: headers }).pipe(map(res => res.json()));
    }

    updateTipoModality(tipoModalityToUpdate) {
        // user lleva el usuario que esta logueado al momento de hacer la peticion, para poder dejar registro en el sv.
        const user = JSON.stringify(this.getIdentity());
        const params = JSON.stringify(tipoModalityToUpdate);
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });

        return this._http.put(this.url + 'updateTipoModality/' + tipoModalityToUpdate._id, params, { headers: headers }).
            pipe(map(res => res.json()));
    }

    addTipoModality(tipoModalityToAdd) {
        const params = JSON.stringify(tipoModalityToAdd);
        const user = JSON.stringify(this.getIdentity());
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });
        // return this._http.post(this.url + 'loginUser', params, { headers: headers }).map(res => res.json());
        return this._http.post(this.url + 'addTipoModality', params, { headers: headers }).pipe(map(res => res.json()));
    }

    deleteTipoModality(tipoModalityToDelete) {
        const user = JSON.stringify(this.getIdentity());
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });
        // return this._http.post(this.url + 'loginUser', params, { headers: headers }).map(res => res.json());
        return this._http.delete(this.url + 'deleteTipoModality/' + tipoModalityToDelete._id , { headers: headers })
        .pipe(map(res => res.json()));
    }

    // Obtiene los tipos de modalidades activos
    getTipoModalitysActive() {
        // user lleva el usuario que esta logueado al momento de hacer la peticion, para poder dejar registro en el sv.
        const user = JSON.stringify(this.getIdentity());
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });
        return this._http.get(this.url + 'getTipoModalitysActive', { headers: headers }).pipe(map(res => res.json()));
    }

}
