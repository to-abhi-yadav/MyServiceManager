import { Injectable } from '@angular/core';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxXml2jsonService } from 'ngx-xml2json';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiRoot: string


  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private ngxXml2jsonService: NgxXml2jsonService
  ) {
    this.apiRoot = `${environment.brApiUrl}/token`
  }

  login(params) {
    let comboKey = btoa(params.userName + ":" + params.password);
    const auth_key = "Basic " + comboKey;
    const headers = new HttpHeaders().set('Authorization', auth_key).set('Content-Type', 'application/json')
    let res = this.http.get(`${this.apiRoot}/create`, {headers: headers})
    return res
  }

  parseXml(xmlStr) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlStr, 'text/xml');
    const obj = this.ngxXml2jsonService.xmlToJson(xml);
    return obj;
  }
}
