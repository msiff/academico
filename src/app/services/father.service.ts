import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

// Services
import { GLOBAL } from './global.service';

@Injectable()
export class FatherService {
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

    getFathers() {
        // user lleva el usuario que esta logueado al momento de hacer la peticion, para poder dejar registro en el sv.
        const user = JSON.stringify(this.getIdentity());
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });
        return this._http.get(this.url + 'getFathers', { headers: headers }).pipe(map(res => res.json()));
    }

    updateFather(fatherToUpdate) {
        // user lleva el usuario que esta logueado al momento de hacer la peticion, para poder dejar registro en el sv.
        const user = JSON.stringify(this.getIdentity());
        const params = JSON.stringify(fatherToUpdate);
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });

        return this._http.put(this.url + 'updateFather/' + fatherToUpdate._id, params, { headers: headers }).
            pipe(map(res => res.json()));
    }

    addFather(fatherToAdd) {
        const params = JSON.stringify(fatherToAdd);
        const user = JSON.stringify(this.getIdentity());
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });
        // return this._http.post(this.url + 'loginUser', params, { headers: headers }).map(res => res.json());
        return this._http.post(this.url + 'addFather', params, { headers: headers }).pipe(map(res => res.json()));
    }

    deleteFather(fatherToDelete) {
        const user = JSON.stringify(this.getIdentity());
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });
        // return this._http.post(this.url + 'loginUser', params, { headers: headers }).map(res => res.json());
        return this._http.delete(this.url + 'deleteFather/' + fatherToDelete._id , { headers: headers }).pipe(map(res => res.json()));
    }

    getHijosPorId(father) {
        // user lleva el usuario que esta logueado al momento de hacer la peticion, para poder dejar registro en el sv.
        const user = JSON.stringify(this.getIdentity());
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': user });
        return this._http.get(this.url + 'getHijosPorId/' + father._id , { headers: headers }).pipe(map(res => res.json()));
    }

}
