import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable()
export class SelectiveCallAcceptanceService{
    apiRoot: string;

    constructor(private http: HttpClient, private ngxXml2jsonService: NgxXml2jsonService) {
        this.apiRoot = `${environment.brApiUrl}/tn`
    }
    
    retrieveSelectiveCallAcceptance(token, tn, accountId){
        const headers = new HttpHeaders().set('token', token);
        let res = this.http.get(`${this.apiRoot}/get/getdonotdisturb`, {headers: headers, params: {tn: tn, accountid: accountId}, responseType: 'text'});
        return res;
    }

    setSelectiveCallAcceptance(token, tn, accountId, subscribed, enabled, single_ring, selective_call_acceptance){
        const headers = new HttpHeaders().set('token', token);
        const queryParams = new HttpParams()
                                .set('tn', tn)
                                .set('accountid', accountId)
                                .set('subscribed', subscribed)
                                .set('enabled', enabled)
                                .set('single_ring', single_ring)
                                .set('selective_call_acceptance', selective_call_acceptance)
        let res = this.http.get(`${this.apiRoot}/set/setdonotdisturb`, {headers: headers, params: queryParams, responseType: 'text'});
        return res;
    }
    
    retrieveSelectiveCallAcceptanceNumbers(token, tn, accountId){
        const headers = new HttpHeaders().set('token', token);
        let res = this.http.get(`${this.apiRoot}/get/getselectivecallacceptancenumbers`, {headers: headers, params: {tn: tn, accountid: accountId}, responseType: 'text'});
        return res;
    }

    AddSelectiveCallAcceptanceNumber(token, tn, accountId, acceptance_number){
        const headers = new HttpHeaders().set('token', token);
        let res = this.http.get(`${this.apiRoot}/set/addselectivecallacceptancenumber`, {headers: headers, params: {tn: tn, accountid: accountId, acceptance_number: acceptance_number}, responseType: 'text'});
        return res;
    }

    DeleteSelectiveCallAcceptanceNumber(token, tn, accountId, acceptance_number){
        const headers = new HttpHeaders().set('token', token);
        let res = this.http.get(`${this.apiRoot}/set/deleteselectivecallacceptancenumber`, {headers: headers, params: {tn: tn, accountid: accountId, acceptance_number: acceptance_number}, responseType: 'text'});
        return res;
    }

    parseXml(xmlStr) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlStr, 'text/xml');
        const obj = this.ngxXml2jsonService.xmlToJson(xml);
        return obj;
    }
}