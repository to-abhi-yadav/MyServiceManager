import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { environment } from 'src/environments/environment';
import { Branding } from '../shared/models/branding';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandingOptionsService {
  apiRoot: string
  token: string
  private currentBrandingSubject: BehaviorSubject<Branding>
  public currentBranding: Observable<Branding>

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private ngxXml2jsonService: NgxXml2jsonService
  ) {
    this.token = this.storage.getItem('bigRiverAccessToken')
    this.apiRoot = `${environment.brApiUrl}`
    this.currentBrandingSubject = new BehaviorSubject<Branding>(JSON.parse(localStorage.getItem('branding')))
    this.currentBranding = this.currentBrandingSubject.asObservable()
    
  }

  retrieveBrandingOptions(accountId, params) {
    const queryParams = new HttpParams()
      .set('accountid', accountId)
    return this.http.get(`${this.apiRoot}`, { params: queryParams, responseType: 'text'})
  }

  setBrandingOptions(params) {
    const options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    const formParams = params.form
    let logo = params.image
    const companyName = params.company
    if (!logo) { logo = formParams.logo}
    const regex = /#/gi
    const brandingData = {
      font_family: formParams.fontFamily,
      tagline_font_family: formParams.taglineFont,
      tagline_font_color: formParams.taglineFontColor.replace(regex, ""),
      primary_font_color: formParams.primaryFontColor.replace(regex, ""),
      secondary_font_color: formParams.secondaryFontColor.replace(regex, ""),
      primary_button_color: formParams.primaryButtonColor.replace(regex, ""),
      secondary_button_color: formParams.secondaryButtonColor.replace(regex, ""),
      forwarding_url: formParams.forwardingUrl,
      domain_name: formParams.domainName,
      background_color: formParams.backgroundColor.replace(regex, ""),
      logo: formParams.logo
    }
    console.log('Branding Post Data = ', brandingData)
    return this.http.post(`${this.apiRoot}/user/setbranding`, brandingData, options)
  }

  public get brandingValue(): any {
    return this.currentBrandingSubject.value
  }

  setCurrentBranding(branding: Branding) {
    this.currentBrandingSubject.next(branding)
    console.log('Current Branding = ', branding)
  }


  // Parse the XML coming back from Big River into JSON
  parseXml(xmlStr) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlStr, 'text/xml');
    const obj = this.ngxXml2jsonService.xmlToJson(xml);
    return obj;
  }

}
