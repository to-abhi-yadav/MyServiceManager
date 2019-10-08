import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable()
export class CallRecordService {
  apiRoot: string;
  
  constructor(private http: HttpClient, private ngxXml2jsonService: NgxXml2jsonService) {
    this.apiRoot = `${environment.brApiUrl}/tn`
  }

  // ====================== HTTP Calls ======================

  retrieveCallRecords(token, accountId, tn){
    const headers = new HttpHeaders().set('token', token);
    let res = this.http.get(`${this.apiRoot}/get/getcdr`, {headers: headers, params: {tn: tn, accountid: accountId}, responseType: 'text'});
    return res;
  }

  retrieveArchivedCallRecord(token, accountId, tn) {
    const headers = new HttpHeaders().set('token', token);
    let res = this.http.get(`${this.apiRoot}/get/getarchivedcallrecordsinfo`, {headers: headers, params: {tn: tn, accountid: accountId}, responseType: 'text'});
    return res;
  }

  retrieveArchivedCallRecordPdf(token, accountId, tn) {
    const headers = new HttpHeaders().set('token', token);
    let res = this.http.get(`${this.apiRoot}/download/getarchivecallrecordfile`, {headers: headers, params: {tn: tn, accountid: accountId}, responseType: 'blob'});
    return res;
  }

  // ====================== Utility Functions ======================

  // Parse the XML coming back from Big River into JSON
  parseXml(xmlStr) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlStr, 'text/xml');
    const obj = this.ngxXml2jsonService.xmlToJson(xml);
    return obj;
  }
}
