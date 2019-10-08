import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiRoot: string
  token: string
  component: string

  private componentToHideSubject: BehaviorSubject<any>
  public componentToHideValue: Observable<any>


  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private ngxXml2jsonService: NgxXml2jsonService
  ) {
    this.token = this.storage.getItem('bigRiverAccessToken')
    console.log("Token = ", this.token)
    this.apiRoot = `${environment.brApiUrl}`
    this.componentToHideSubject = new BehaviorSubject<any>(this.component)
    this.componentToHideValue = this.componentToHideSubject.asObservable()
  }

  public get componentToHide() {
    return this.componentToHideSubject.value
  }

  retrieveMenu(tn, accountId) {
    const headers = new HttpHeaders().set('token', this.token);
    const queryParams = new HttpParams()
    .set('tn', tn)
    .set('accountid', accountId)
    console.log('tn acctId = ', queryParams)
    let res = this.http.get(`${this.apiRoot}/tn/get/menu`, { headers: headers, params: queryParams, responseType: 'text'})
    return res
  }

  setComponentSequence(token, tn, accountId, sequence) {
    const headers = new HttpHeaders().set('token', token);
    const queryParams = new HttpParams()
    .set('tn', tn)
    .set('accountid', accountId)
    .set('component_sequence', "[" + sequence.toString() + "]")
    let res = this.http.get(`${this.apiRoot}/tn/set/updatecomponentsequence`, { headers: headers, params: queryParams, responseType: 'text'})
    return res
  }

  getComponentSequence(token, tn, accountId) {
    console.log('Token = ', token)
    const headers = new HttpHeaders().set('token', token);
    const queryParams = new HttpParams()
    .set('tn', tn)
    .set('accountid', accountId)
    let res = this.http.get(`${this.apiRoot}/tn/get/getcomponentsequence`, { headers: headers, params: queryParams, responseType: 'text'})
    return res
  }

  parseXml(xmlStr) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlStr, 'text/xml');
    const obj = this.ngxXml2jsonService.xmlToJson(xml);
    return obj;
  }

  stringToBoolOrNull(str: string) {
    if (str == "True" || str == "TRUE" || str == "true") {
      return true;
    } else if (str == "False" || str == "FALSE" || str == "false"){
      return false;
    } else {
      return null;
    }
  }

  removeComponentFromDashboard(component) {
    this.component = component
    this.componentToHideSubject.next(component)
  }

}
