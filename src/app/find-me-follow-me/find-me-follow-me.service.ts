import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable()
export class FindMeFollowMeService{
    apiRoot: string;

    constructor(private http: HttpClient, private ngxXml2jsonService: NgxXml2jsonService) {
        this.apiRoot = `${environment.brApiUrl}/tn`
    }
    
    retrieveFmFmSettings(tn, accountId){
        // const headers = new HttpHeaders().set('token', token);
        let res = this.http.get(`${this.apiRoot}/get/getfindmefollowme`, {params: {tn: tn, accountid: accountId}, responseType: 'text'});
        return res;
    }

    setFmFmSettings(tn, accountId, enabled){
        const queryParams = new HttpParams()
                                .set('tn', tn)
                                .set('accountid', accountId)
                                .set('enabled', enabled)
                                .set('service_level', "enhanced") //hardcoded value to tell them it's a FM-FM request
        let res = this.http.get(`${this.apiRoot}/set/setfindmefollowme`, {params: queryParams, responseType: 'text'});
        return res;
    }
    
    retrieveFmFmRules(tn, accountId){
        let res = this.http.get(`${this.apiRoot}/get/getfindmefollowmerules`, {params: {tn: tn, accountid: accountId}, responseType: 'text'});
        return res;
    }

    AddFmFmRules(tn, accountId, numbers){
        let res = this.http.get(`${this.apiRoot}/set/addfindmefollowmerules`, {params: {
            tn: tn, 
            accountid: accountId,
            fmfm_list: numbers
        }, responseType: 'text'});
        return res;
    }

    DeleteAllFmFmRules(tn, accountId){
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