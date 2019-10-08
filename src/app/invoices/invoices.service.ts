import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable()
export class InvoicesService{
    apiRoot: string;

    constructor(private http: HttpClient, private ngxXml2jsonService: NgxXml2jsonService) {
        this.apiRoot = `${environment.brApiUrl}/tn`
    }

    retrieveBillMonths(token, tn, accountId){
        const headers = new HttpHeaders().set('token', token);
        let res = this.http.get(`${this.apiRoot}/get/getbillmonths`, {headers: headers, params: {tn: tn, accountid: accountId}, responseType: 'text'});
        return res;
    }

    retrieveInvoice(token, tn, accountId, billMonth){
        const headers = new HttpHeaders().set('token', token);
        let res = this.http.get(`${this.apiRoot}/download/getaccountbillfile`, {headers: headers, params: {tn: tn, accountid: accountId, bm_billmonth: billMonth}, responseType: 'blob'});
        return res;
    }

    parseXml(xmlStr) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlStr, 'text/xml');
        const obj = this.ngxXml2jsonService.xmlToJson(xml);
        return obj;
    }
}