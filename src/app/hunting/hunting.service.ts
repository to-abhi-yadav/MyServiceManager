import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable()
export class HuntingService{
    apiRoot: string;

    constructor(private http: HttpClient, private ngxXml2jsonService: NgxXml2jsonService) {
        this.apiRoot = `${environment.brApiUrl}`
    }
    
    retrieveHuntingSettings(tn, accountId){
        // const headers = new HttpHeaders().set('token', token);
        let res = this.http.get(`${this.apiRoot}/tn/get/gethunting`, {params: {tn: tn, accountid: accountId}, responseType: 'text'});
        return res;
    }

    setHuntingSettings(tn, accountId, enabled){
        const queryParams = new HttpParams()
                                .set('tn', tn)
                                .set('accountid', accountId)
                                .set('enabled', enabled)
                                .set('rings', "6")
                                .set('arrangement', "regular") //hardcoded value
        let res = this.http.get(`${this.apiRoot}/tn/set/sethunting`, {params: queryParams, responseType: 'text'});
        return res;
    }
    
    retrieveHuntingRules(tn, accountId){
        let res = this.http.get(`${this.apiRoot}/tn/get/gethuntingnumbers`, {params: {tn: tn, accountid: accountId}, responseType: 'text'});
        return res;
    }

    retrieveEligibleHuntingNumbers(tn, accountId, subId){
        let res = this.http.get(`${this.apiRoot}/subid/get/geteligiblehuntingnumbers`, {params: {tn: tn, accountid: accountId, subid: subId}, responseType: 'text'});
        return res;
    }

    AddHuntingRules(tn, accountId, numbers){
        let res = this.http.get(`${this.apiRoot}/tn/set/addhuntingnumbers`, {params: {tn: tn, accountid: accountId, hunting_list: numbers}, responseType: 'text'});
        return res;
    }

    DeleteAllHuntingRules(tn, accountId){
        let res = this.http.get(`${this.apiRoot}/tn/set/deleteallhuntingnumbers`, {params: {tn: tn, accountid: accountId}, responseType: 'text'});
        return res;
    }

    parseXml(xmlStr) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlStr, 'text/xml');
        const obj = this.ngxXml2jsonService.xmlToJson(xml);
        return obj;
    }

    isResponseDataOk(responseData){
        return responseData["Response"]["Status"]["Code"] == "200"
    }
}