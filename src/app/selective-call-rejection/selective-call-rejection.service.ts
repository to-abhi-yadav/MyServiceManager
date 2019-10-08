import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable()
export class SelectiveCallRejectionService{
    apiRoot: string;

    constructor(private http: HttpClient, private ngxXml2jsonService: NgxXml2jsonService) {
        this.apiRoot = `${environment.brApiUrl}/tn`
    }

    retrieveSelectiveCallRejection(token, tn, accountId){
        const headers = new HttpHeaders().set('token', token);
        let res = this.http.get(`${this.apiRoot}/get/getselectivecallrejection`, {headers: headers, params: {tn: tn, accountid: accountId}, responseType: 'text'});
        return res;
    }

    setSelectiveCallRejection(token, tn, accountId, subscribed, enabled){
        const headers = new HttpHeaders().set('token', token);
        const queryParams = new HttpParams()
                                .set('tn', tn)
                                .set('accountid', accountId)
                                .set('subscribed', subscribed)
                                .set('enabled', enabled)
        let res = this.http.get(`${this.apiRoot}/set/setselectivecallrejection`, {headers: headers, params: queryParams, responseType: 'text'});
        return res;
    }

    retrieveSelectiveCallRejectionNumbers(token, tn, accountId){
        const headers = new HttpHeaders().set('token', token);
        let res = this.http.get(`${this.apiRoot}/get/getselectivecallrejectionnumbers`, {headers: headers, params: {tn: tn, accountid: accountId}, responseType: 'text'});
        return res;
    }

    AddSelectiveCallRejectionNumber(token, tn, accountId, rejection_number){
        const headers = new HttpHeaders().set('token', token);
        let res = this.http.get(`${this.apiRoot}/set/addselectivecallrejectionnumber`, {headers: headers, params: {tn: tn, accountid: accountId, rejection_number: rejection_number}, responseType: 'text'});
        return res;
    }

    DeleteSelectiveCallRejectionNumber(token, tn, accountId, rejection_number){
        const headers = new HttpHeaders().set('token', token);
        let res = this.http.get(`${this.apiRoot}/set/deleteselectivecallrejectionnumber`, {headers: headers, params: {tn: tn, accountid: accountId, rejection_number: rejection_number}, responseType: 'text'});
        return res;
    }

    parseXml(xmlStr) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlStr, 'text/xml');
        const obj = this.ngxXml2jsonService.xmlToJson(xml);
        return obj;
    }
}