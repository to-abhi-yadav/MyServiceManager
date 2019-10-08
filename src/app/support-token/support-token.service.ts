import { Injectable } from '@angular/core';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxXml2jsonService } from 'ngx-xml2json';
import * as xml2js from 'xml2js';

@Injectable()
export class SupportTokenService{
  apiRoot: string;
  
  constructor(private http: HttpClient,
    private storage: LocalStorageService,
    private ngxXml2jsonService: NgxXml2jsonService) {
    this.apiRoot = `${environment.brApiUrl}`
  }

  callSupportToken(supportToken){
    const headers = new HttpHeaders()
    .set('token', supportToken)
    .set('Content-Type', 'application/json')
    .set('Cache-Control', 'no-store')
    .set('Pragma', 'no-cache')
    .set('Expires', '0');
    let res = this.http.get(`${this.apiRoot}/token/support`, {headers: headers});
    console.log(res)
    return res;
  }

  parseXml(xmlStr) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlStr, 'text/xml');
    const obj = this.ngxXml2jsonService.xmlToJson(xml);
    return obj;
  }
}