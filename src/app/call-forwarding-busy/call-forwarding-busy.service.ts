import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable()
export class CallForwardingBusyService{
  apiRoot: string;
  
  constructor(private http: HttpClient, private ngxXml2jsonService: NgxXml2jsonService) {
    this.apiRoot = `${environment.brApiUrl}/tn`
  }

  retreiveCallForwardingBusy(token, tn, accountId){
    const headers = new HttpHeaders().set('token', token);
    let res = this.http.get(`${this.apiRoot}/get/getbusycallforwarding`, {headers: headers, params: {tn: tn, accountid: accountId}, responseType: 'text'});
    return res;
  }

  setCallForwardingBusy(token, tn, accountId, subscribed, enabled, forwarding_number, variant){
    const headers = new HttpHeaders().set('token', token);
    const queryParams = new HttpParams()
                            .set('tn', tn)
                            .set('accountid', accountId)
                            .set('subscribed', subscribed)
                            .set('enabled', enabled)
                            .set('forwarding_number', forwarding_number)
                            .set('variant', variant)
    let res = this.http.get(`${this.apiRoot}/set/setbusycallforwarding`, {headers: headers, params: queryParams, responseType: 'text'});
    return res;
  }

  parseXml(xmlStr) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlStr, 'text/xml');
    const obj = this.ngxXml2jsonService.xmlToJson(xml);
    return obj;
  }
}