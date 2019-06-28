import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

// Services
import { GLOBAL } from './global.service';

@Injectable()
export class OptionsService {
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

    getOptions() {
        // user lleva el usuario que esta logueado al momento de hacer la peticion, para poder dejar registro en el sv.
        const user = JSON.stringify(this.getIdentity());
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });
        return this._http.get(this.url + 'getOptions', { headers: headers }).pipe(map(res => res.json()));
    }

    updateModality(optionToUpdate) {
        // user lleva el usuario que esta logueado al momento de hacer la peticion, para poder dejar registro en el sv.
        const user = JSON.stringify(this.getIdentity());
        const params = JSON.stringify(optionToUpdate);
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });

        return this._http.put(this.url + 'updateOptions/' + optionToUpdate._id, params, { headers: headers }).
            pipe(map(res => res.json()));
    }

    addModality(optionToAdd) {
        const params = JSON.stringify(optionToAdd);
        const user = JSON.stringify(this.getIdentity());
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });
        // return this._http.post(this.url + 'loginUser', params, { headers: headers }).map(res => res.json());
        return this._http.post(this.url + 'addOptions', params, { headers: headers }).pipe(map(res => res.json()));
    }
}
