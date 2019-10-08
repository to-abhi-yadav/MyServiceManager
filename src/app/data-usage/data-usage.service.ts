import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class DataUsageService {
  apiRoot: string
  token: string


  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private ngxXml2jsonService: NgxXml2jsonService
  ) {
    this.token = this.storage.getItem('bigRiverAccessToken')
    this.apiRoot = `${environment.brApiUrl}`
  }

  async retrieveDataUsage(tn, accountID): Promise<string> {
    const params = new HttpParams()
      .set('tn', tn)
      .set('accountid', accountID)
    let res = await this.http.get(`${this.apiRoot}/tn/get/getcurrentdatausage`, {params: params, responseType: 'text'}).toPromise()
    return res
  }

   async retrieveDetailDataUsage(tn, accountID, startDate, endDate, msi): Promise<string> {
    const params = new HttpParams() 
      .set('tn', tn)
      .set('accountid', accountID)
      .set('data_startdate', startDate)
      .set('data_enddate', endDate)
      .set('data_msi', msi)
    let res = await this.http.get(`${this.apiRoot}/tn/get/getdetaildatausage`, {params: params, responseType: 'text'}).toPromise()
    return res
  }

   async retrieveDatesDetailUsage(tn, accountID): Promise<string> {
    const params = new HttpParams()
      .set('tn', tn)
      .set('accountid', accountID)
    let res = await this.http.get(`${this.apiRoot}/tn/get/getdatesdetailusage`, {params: params, responseType: 'text'}).toPromise()
    return res
  }

  updateEmail(tn, accountID, email) {
    const params = new HttpParams()
      .set('tn', tn)
      .set('accountid', accountID)
      .set('data_email', email)
    let res = this.http.get(`${this.apiRoot}tn/set/updateemail`, {params: params, responseType: 'text'})
    return res

  }

  setNotificationEmail(tn, accountID, msi, data_email, enabled) {
    const params = new HttpParams()
      .set('tn', tn)
      .set('accountid', accountID)
      .set('data_msi', msi)
      .set('data_email', data_email)
      .set('enabled', enabled)
    let res = this.http.get(`${this.apiRoot}/tn/set/updateemailnotifications`, {params: params, responseType: 'text'})
    return res
  }

  parseXml(xmlStr) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlStr, 'text/xml');
    const obj = this.ngxXml2jsonService.xmlToJson(xml);
    return obj;
  }
}