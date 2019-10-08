import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class FeaturesService {
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

  setAnonymousCallRejection(tn, accountId, subscribed, enabled) {
    const headers = new HttpHeaders().set('token', this.token);
    const queryParams = new HttpParams()
    .set('tn', tn)
    .set('accountId', accountId)
    .set('subscribed', subscribed)
    .set('enabled', enabled)
    let res = this.http.get(`${this.apiRoot}/tn/set/setanonymouscallrejection`, {params: queryParams, headers: headers, responseType: 'text'})
    return res
  }

  setVoicemail() {

  }

  updateVoicemailOptions(tn, accountId, vmAllowForward, vmForwardEmail, vmAllowNotify, vmNotifyEmail, vmCallName, vmCallNumber, vmMessage, vmMessageLen, vmMessageTime, vmMessageDate, vmMailboxTn) {
    `${this.apiRoot}/tn/set/updatevoicemailoptions?tn={tn}&accountid={accountid}&vm_allowforward={vm_allowforward}&vm_forwardemail={vm_forwardemail}&vm_allownotify={vm_allownotify}&vm_notifyemail={vm_notifyemail}&vm_callname={vm_callname}&vm_callnumber={vm_callnumber}&vm_messagelen={vm_messagelen}&vm_messagetime={vm_messagetime}&vm_messagedate={vm_messagedate}&vm_mailboxtn={vm_mailboxtn}`
  }

  deleteVoicemailMessage() {

  }

  setBusyCallForwarding() {

  }

  retrieveDoNotDisturb(tn, accountId) {
    const queryParams = new HttpParams()
    .set('tn', tn)
    .set('accountid', accountId)
    let res = this.http.get(`${this.apiRoot}/tn/get/getdonotdisturb`, { params: queryParams, responseType: 'text'})
    return res
  }

  setDoNotDisturb(tn, accountId, subscribed, enabled, singleRing, selectiveCallAccepetance) {
    // const headers = new HttpHeaders().set('token', this.token);
    const queryParams = new HttpParams()
    .set('tn', tn)
    .set('accountid', accountId)
    .set('subscribed', subscribed)
    .set('enabled', enabled)
    .set('single_ring', singleRing)
    .set('selective_call_acceptance', selectiveCallAccepetance)
    let res = this.http.get(`${this.apiRoot}/tn/set/setdonotdisturb`, { params: queryParams, responseType: 'text'})
    return res
  }

  retrieveInternationalMinutes(token, tn, accountId) {
    const headers = new HttpHeaders().set('token', token);
    const queryParams = new HttpParams()
    .set('tn', tn)
    .set('accountid', accountId)
    let res = this.http.get(`${this.apiRoot}/tn/get/getinternationalminutes`, { headers: headers, params: queryParams, responseType: 'text'})
    return res
  }

  setAllCallForwarding(tn, accountId, subscribed, enabled, forwardingNumber, singleRing,) {
    const queryParams = new HttpParams()
    .set('tn', tn)
    .set('accountid', accountId)
    .set('subscribed', subscribed)
    .set('enabled', enabled)
    .set('forwarding_number', forwardingNumber)
    .set('single_ring', singleRing)
    let res = this.http.get(`${this.apiRoot}/tn/set/setunconditionalcallforwarding`, { params: queryParams, responseType: 'text'})
    return res

  }

  retrieveAllCallForwarding(tn, accountId) {
    const queryParams = new HttpParams()
      .set('tn', tn)
      .set('accountid', accountId)
      let res = this.http.get(`${this.apiRoot}/tn/get/getunconditionalcallforwarding`, {params: queryParams, responseType: 'text'})
      return res
  }

  setUnavailableCallForwarding(tn, accountId, subscribed, enabled, forwardingNumber) {
    const queryParams = new HttpParams()
      .set('tn', tn)
      .set('accountid', accountId)
      .set('subscribed', subscribed)
      .set('enabled', enabled)
      .set('forwarding_number', forwardingNumber)
    let res = this.http.get(`${this.apiRoot}/tn/set/setunavailablecallforwarding`, {params: queryParams, responseType: 'text'});
    return res

  }

  retrieveUnavailableCallForwarding(tn, accountID) {
    const queryParams = new HttpParams()
      .set('tn', tn)
      .set('accountid', accountID);
    let res = this.http.get(`${this.apiRoot}/tn/get/getunavailablecallforwarding`, {params: queryParams, responseType: 'text'})
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

}
