import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable()
export class AnonymousCallRejectionService {
  apiRoot: string;
  
  constructor(private http: HttpClient, private ngxXml2jsonService: NgxXml2jsonService) {
    this.apiRoot = `${environment.brApiUrl}/tn`
  }

  // ====================== HTTP Calls ======================

  retreiveAnonymousCallRejection(token, accountId, tn){
    const headers = new HttpHeaders().set('token', token);
    let res = this.http.get(`${this.apiRoot}/get/getanonymouscallrejection`, {headers: headers, params: {tn: tn, accountid: accountId}, responseType: 'text'});
    return res;
  }

  setAnonymousCallRejection(token, accountId, tn, configObj){
    const headers = new HttpHeaders().set('token', token);
    // SUBSCRIBED MUST ALWAYS BE TRUE, PER DEREK SUMMERS ON 2/21/19
    const queryParams = new HttpParams()
                            .set('tn', tn)
                            .set('accountid', accountId)
                            .set('subscribed', "true")
                            .set('enabled', configObj["enabled"])
    let res = this.http.get(`${this.apiRoot}/set/setanonymouscallrejection`, {headers: headers, params: queryParams, responseType: 'text'});
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
