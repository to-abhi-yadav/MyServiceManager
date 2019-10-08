import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable()
export class CallForwardingNoAnswerService{
    apiRoot: string;

    constructor(private http: HttpClient, private ngxXml2jsonService: NgxXml2jsonService) {
        this.apiRoot = `${environment.brApiUrl}/tn`
    }

    retrieveCallForwardingNoAnswer(token, tn, accountId){
        const headers = new HttpHeaders().set('token', token);
        let res = this.http.get(`${this.apiRoot}/get/getdelayedcallforwarding`, {headers: headers, params: {tn: tn, accountid: accountId}, responseType: 'text'});
        return res;
    }

    setCallForwardingNoAnswer(token, tn, accountId, enabled, forwarding_number, variant, rings){
        const headers = new HttpHeaders().set('token', token);
        const queryParams = new HttpParams()
                                .set('tn', tn)
                                .set('accountid', accountId)
                                .set('enabled', enabled)
                                .set('forwarding_number', forwarding_number)
                                .set('variant', variant)
                                .set('rings', rings)
        let res = this.http.get(`${this.apiRoot}/set/setdelayedcallforwarding`, {headers: headers, params: queryParams, responseType: 'text'});
        return res;
    }

    parseXml(xmlStr) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlStr, 'text/xml');
        const obj = this.ngxXml2jsonService.xmlToJson(xml);
        return obj;
    }
}