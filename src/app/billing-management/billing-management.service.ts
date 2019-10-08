import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BillingManagementService {

  apiRoot: string;
  
  constructor(private http: HttpClient, private ngxXml2jsonService: NgxXml2jsonService) {
    this.apiRoot = `${environment.brApiUrl}/tn`
  }

  retrieveCurrentBalance(tn, accountID) {
    const params = new HttpParams()
      .set('tn', tn)
      .set('accountid', accountID)
    let res = this.http.get(`${this.apiRoot}/get/getbillbalance`, {params: params, responseType: 'text'})
    return res 
  }

  async retrieveClientToken(tn, accountID) {
    const params = new HttpParams() 
      .set('tn', tn)
      .set('accountid', accountID)
    let res = this.http.get(`${this.apiRoot}/get/getbilltoken`, {params: params, responseType: 'text'}).toPromise()
    return res
  }

  makePayment(tn, accountID, price, paymentnonce) {
    const params = new HttpParams()
      .set('tn', tn)
      .set('accountid', accountID)
      .set('bm_price', price)
      .set('bm_paymentnonce', paymentnonce)
    let res = this.http.get(`${this.apiRoot}/set/makebillpayment`, {params: params, responseType: 'text'})
    return res
    //set/makebillpayment?tn=%7btn%7d&accountid=%7baccountid%7d&bm_price=%7bbm_price%7d&bm_paymentnonce=%7bbm_paymentnonce%7d
  }

  retrieveAutopayInfo(tn, accountID) {
    const params = new HttpParams()
      .set('tn', tn)
      .set('accountid', accountID)
    let res = this.http.get(`${this.apiRoot}/get/getbillautopayinfo`, {params: params, responseType: 'text'})
    return res 
  }

  async retrieveAutopayInfo2(tn, accountID) {
    const params = new HttpParams()
      .set('tn', tn)
      .set('accountid', accountID)
    let res = this.http.get(`${this.apiRoot}/get/getbillautopayinfo`, {params: params, responseType: 'text'}).toPromise()
    return res 
  }

  setAutopay(tn, accountID, email, nonce) {
    const params = new HttpParams()
      .set('tn', tn)
      .set('accountid', accountID)
      .set('bm_email', email)
      .set('bm_paymentnonce', nonce)
    let res = this.http.get(`${this.apiRoot}/set/setbillautopay`, {params: params, responseType: 'text'})
    return res
  }

  updateAutopay(tn, accountID, email, nonce) {
    const params = new HttpParams()
      .set('tn', tn)
      .set('accountid', accountID)
      .set('bm_email', email)
      .set('bm_paymentnonce', nonce)
    let res = this.http.get(`${this.apiRoot}/set/updatebillautopay`, {params: params, responseType: 'text'})
    return res
  }
  // Parse the XML coming back from Big River into JSON
  parseXml(xmlStr) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlStr, 'text/xml');
    const obj = this.ngxXml2jsonService.xmlToJson(xml);
    return obj;
  }

}
