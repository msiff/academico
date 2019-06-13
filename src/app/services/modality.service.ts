import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

// Services
import { GLOBAL } from './global.service';

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

    getModalitys() {
        // user lleva el usuario que esta logueado al momento de hacer la peticion, para poder dejar registro en el sv.
        const user = JSON.stringify(this.getIdentity());
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });
        return this._http.get(this.url + 'getModalitys', { headers: headers }).pipe(map(res => res.json()));
    }

    updateModality(modalityToUpdate) {
        // user lleva el usuario que esta logueado al momento de hacer la peticion, para poder dejar registro en el sv.
        const user = JSON.stringify(this.getIdentity());
        const params = JSON.stringify(modalityToUpdate);
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });

        return this._http.put(this.url + 'updateModality/' + modalityToUpdate._id, params, { headers: headers }).
            pipe(map(res => res.json()));
    }

    addModality(modalityToAdd) {
        const params = JSON.stringify(modalityToAdd);
        const user = JSON.stringify(this.getIdentity());
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });
        // return this._http.post(this.url + 'loginUser', params, { headers: headers }).map(res => res.json());
        return this._http.post(this.url + 'addModality', params, { headers: headers }).pipe(map(res => res.json()));
    }

    deleteModality(modalityToDelete) {
        const user = JSON.stringify(this.getIdentity());
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });
        // return this._http.post(this.url + 'loginUser', params, { headers: headers }).map(res => res.json());
        return this._http.delete(this.url + 'deleteModality/' + modalityToDelete._id , { headers: headers })
        .pipe(map(res => res.json()));
    }

    // Obtiene los tipos de modalidades activos
    getTipoModalitysActive() {
        // user lleva el usuario que esta logueado al momento de hacer la peticion, para poder dejar registro en el sv.
        const user = JSON.stringify(this.getIdentity());
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });
        return this._http.get(this.url + 'getModalitysActive', { headers: headers }).pipe(map(res => res.json()));
    }

}
