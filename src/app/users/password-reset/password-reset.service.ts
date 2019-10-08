import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  apiRoot: string
  partnerApiRoot: string


  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private ngxXml2jsonService: NgxXml2jsonService
  ) {
    this.apiRoot = `${environment.brApiUrl}/user`
    this.partnerApiRoot = `${environment.brApiUrl}/partner`
  }

  reset(params) {
    const queryParams = new HttpParams()
    .set('username', params.userName)
    .set('email', params.email)
    .set('subid', params.subId)
    .set('state', params.state)
    .set('zipcode', params.zipCode)
    .set('password', params.password)
    .set('tn', params.phone)
    .set('uri', params.uri)
    let res = this.http.get(`${this.partnerApiRoot}/passwordreset`, {params: queryParams, responseType: 'text'})
    return res
  }

  parseXml(xmlStr) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlStr, 'text/xml');
    const obj = this.ngxXml2jsonService.xmlToJson(xml);
    return obj;
  }
}
