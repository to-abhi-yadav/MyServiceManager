import { Injectable } from '@angular/core';
import { Branding } from '../models/branding';
import { environment } from 'src/environments/environment';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { LocalStorageService } from './local-storage.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BrandingService {
  apiRoot: string
  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private ngxXml2jsonService: NgxXml2jsonService
  ) { 
    this.apiRoot = `${environment.brApiUrl}`
  }

  setLogoAndName(logo: string, companyName: string) {
    if (logo !== 'None') {
      this.storage.setItem('logo', logo)
    } else {
      this.storage.setItem('logo', '../assets/images/logo-bigriver.png')
    }
    if (companyName !== 'None') {
      this.storage.setItem('companyName', companyName)
    } else {
      this.storage.setItem('logo', 'Big River')
    }
  }

  setBrandingOptions(branding: {}) {
    Object.keys(branding).forEach(k =>
      document.documentElement.style.setProperty(`--${k}`, branding[k])
    );
    const res = 'Successfully updated the css values'
    return res
  }

  setAllBranding(partner) {
    const queryParams = new HttpParams()
    .set('uri', partner)
    let res = this.http.get(`${this.apiRoot}/partner/getbranding`, {params: queryParams, responseType: 'text'})
    return res
  }

  parseXml(xmlStr) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlStr, 'text/xml');
    const obj = this.ngxXml2jsonService.xmlToJson(xml);
    return obj;
  }
}
