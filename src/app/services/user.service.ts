import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';

// Services
import { GLOBAL } from './global.service';

@Injectable()
export class UserService {
    public url: string;
    public identity;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    getIdentity() {
        const identity = JSON.parse(sessionStorage.getItem('identity'));
        if (identity !== 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }

    loginUser(user_to_login) {
        const params = JSON.stringify(user_to_login);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        // return this._http.post(this.url + 'loginUser', params, { headers: headers }).map(res => res.json());
        return this._http.post(this.url + 'loginUser', params, { headers: headers }).pipe(map(res => res.json()));
    }

    getUsers() {
        // user lleva el usuario que esta logueado al momento de hacer la peticion, para poder dejar registro en el sv.
        const user = JSON.stringify(this.getIdentity());
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });
        return this._http.get(this.url + 'getUsers', { headers: headers }).pipe(map(res => res.json()));
    }

    updateUser(user_to_update) {
        // user lleva el usuario que esta logueado al momento de hacer la peticion, para poder dejar registro en el sv.
        const user = JSON.stringify(this.getIdentity());
        const params = JSON.stringify(user_to_update);
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });

        return this._http.put(this.url + 'updateUser/' + user_to_update._id, params, { headers: headers }).
            pipe(map(res => res.json()));
    }

    addUser(user_to_add) {
        const params = JSON.stringify(user_to_add);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        // return this._http.post(this.url + 'loginUser', params, { headers: headers }).map(res => res.json());
        return this._http.post(this.url + 'registrarUser', params, { headers: headers }).pipe(map(res => res.json()));
    }

    getUsersActive() {
        // user lleva el usuario que esta logueado al momento de hacer la peticion, para poder dejar registro en el sv.
        const user = JSON.stringify(this.getIdentity());
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });
        return this._http.get(this.url + 'getUsersActive', { headers: headers }).pipe(map(res => res.json()));
    }
}


