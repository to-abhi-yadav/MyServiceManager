import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable({
  providedIn: 'root'
})
export class SpeedDialingService {
  apiRoot: string;

  constructor(
    private http: HttpClient, 
    private ngxXml2jsonService: NgxXml2jsonService
    ) {
      this.apiRoot = `${environment.brApiUrl}/tn`
  }

  getSpeedDialing(tn, accountId) {
    let res = this.http.get(`${this.apiRoot}/get/getspeedcalling`, { params: {tn: tn, accountid: accountId}, responseType: 'text'});
    return res;
  }

  setSpeedDialing(tn, accountId, enabled) {
    let res = this.http.get(`${this.apiRoot}/set/setspeedcalling`, { params: {tn: tn, accountid: accountId, enabled: enabled}, responseType: 'text'});
    return res;
  }

  getSpeedDialingNumbers(tn, accountId) {
    let res = this.http.get(`${this.apiRoot}/get/getspeedcallingnumbers`, { params: {tn: tn, accountid: accountId}, responseType: 'text'});
    return res;
  }

  addSpeedDialingNumber(tn, accountId, speedCode, numberToCall) {
    let res = this.http.get(`${this.apiRoot}/set/addspeedcallingnumber`, { params: {tn: tn, accountid: accountId, speed_code: speedCode, number_to_call: numberToCall}, responseType: 'text'});
    return res;
  }

  deleteSpeedDialingNumber(tn, accountId, speedCode, numberToCall) {
    let res = this.http.get(`${this.apiRoot}/set/deletespeedcallingnumber`, { params: {tn: tn, accountid: accountId, speed_code: speedCode, number_to_call: numberToCall}, responseType: 'text'});
    return res;
  }

  parseXml(xmlStr) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlStr, 'text/xml');
    const obj = this.ngxXml2jsonService.xmlToJson(xml);
    return obj;
  }

}
