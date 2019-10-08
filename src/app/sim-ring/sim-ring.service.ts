import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable()
export class SimRingService{
    apiRoot: string;

    constructor(private http: HttpClient, private ngxXml2jsonService: NgxXml2jsonService) {
        this.apiRoot = `${environment.brApiUrl}/tn`
    }
    
    retrieveSimRingSettings(tn, accountId){
        // const headers = new HttpHeaders().set('token', token);
        let res = this.http.get(`${this.apiRoot}/get/getsimring`, {params: {tn: tn, accountid: accountId}, responseType: 'text'});
        return res;
    }

    setSimRingSettings(tn, accountId, enabled){
        const queryParams = new HttpParams()
                                .set('tn', tn)
                                .set('accountid', accountId)
                                .set('enabled', enabled)
                                .set('service_level', "simring") //hardcoded value to tell them it's a sim ring request
        let res = this.http.get(`${this.apiRoot}/set/setfindmefollowme`, {params: queryParams, responseType: 'text'});
        return res;
    }
    
    retrieveSimRingRules(tn, accountId){
        let res = this.http.get(`${this.apiRoot}/get/getfindmefollowmerules`, {params: {tn: tn, accountid: accountId}, responseType: 'text'});
        return res;
    }

    AddSimRingRules(tn, accountId, numbers){
        let res = this.http.get(`${this.apiRoot}/set/addsimringrules`, {params: {
            tn: tn, 
            accountid: accountId,
            simring_list: numbers
        }, responseType: 'text'});
        return res;
    }

    DeleteAllSimRingRules(tn, accountId){
        let res = this.http.get(`${this.apiRoot}/set/deleteallfindmefollowmerules`, {params: {tn: tn, accountid: accountId}, responseType: 'text'});
        return res;
    }

    parseXml(xmlStr) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlStr, 'text/xml');
        const obj = this.ngxXml2jsonService.xmlToJson(xml);
        return obj;
    }
}