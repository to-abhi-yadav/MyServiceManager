import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxXml2jsonService } from 'ngx-xml2json';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
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

  register(params) {
    // let token = this.storage.getItem('bigRiverAccessToken')
    // const headers = new HttpHeaders().set('token', token);
    const queryParams = new HttpParams()
    .set('username', params.userName)
    .set('email', params.email)
    .set('subid', params.subId)
    .set('state', params.state)
    .set('zipcode', params.zipCode)
    .set('password', params.password)
    .set('tn', params.phone)
    .set('uri', params.uri)
    let res = this.http.get(`${this.partnerApiRoot}/register`, {params: queryParams, responseType: 'text'})
    return res
  }

  parseXml(xmlStr) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlStr, 'text/xml');
    const obj = this.ngxXml2jsonService.xmlToJson(xml);
    return obj;
  }
}
