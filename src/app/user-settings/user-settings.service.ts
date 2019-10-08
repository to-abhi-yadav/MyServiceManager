import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable()
export class UserSettingsService {
    apiRoot: string;

    constructor(private http: HttpClient, private ngxXml2jsonService: NgxXml2jsonService) {
        this.apiRoot = `${environment.brApiUrl}`
    }

    resetEmail(token, email) {
        const headers = new HttpHeaders().set('token', token);
        let res = this.http.get(`${this.apiRoot}/user/updateemail`, {headers: headers, params: {email: email}, responseType: 'text'});
        return res;
    }

    resetPassword(token, cu_password, nw_password) {
        const headers = new HttpHeaders().set('token', token);
        let res = this.http.get(`${this.apiRoot}/user/updatepassword`, {headers: headers, params: {cu_password: cu_password, nw_password: nw_password}, responseType: 'text'});
        return res;
    }

    resetDefaultTN(token, tn, subid) {
        const headers = new HttpHeaders().set('token', token);
        let res = this.http.get(`${this.apiRoot}/subid/set/updatedefaulttn`, {headers: headers, params: {tn: tn, subid: subid}, responseType: 'text'});
        return res;
    }

    resetLabel(token, tn, accountid, label) {
        const headers = new HttpHeaders().set('token', token);
        let res = this.http.get(`${this.apiRoot}/tn/set/settnlabel`, {headers: headers, params: {tn: tn, accountid: accountid, label: label}, responseType: 'text'});
        return res;
    }

    parseXml(xmlStr) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlStr, 'text/xml');
        const obj = this.ngxXml2jsonService.xmlToJson(xml);
        return obj;
    }
}