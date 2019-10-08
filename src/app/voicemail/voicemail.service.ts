import { EventEmitter, Injectable } from "@angular/core";
import { VoicemailItem } from "./voicemail-item/voicemail-item.model";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable()
export class VoicemailService {
  voicemailsChanged = new EventEmitter<VoicemailItem[]>();
  voicemailsLoaded = new EventEmitter<VoicemailItem[]>();
  apiRoot: string;
  public voicemails:VoicemailItem[] = [];
  
  constructor(private http: HttpClient, private ngxXml2jsonService: NgxXml2jsonService) {
    this.apiRoot = `${environment.brApiUrl}/tn`
  }

  // ====================== In-Memory Functions ======================

  // Add a single voicemail to the voicemails array and emit a voicemailsChanged event
  addVoicemail(voicemail: VoicemailItem){
    this.voicemails.push(voicemail);
    this.voicemailsChanged.emit(this.voicemails.slice());
  }

  // Add many voicemails to the voicemails array and emit a voicemailsChanged event
  addVoicemails(voicemails: VoicemailItem[]){
    this.voicemails.push(...voicemails);
    this.voicemailsChanged.emit(this.voicemails.slice());
  }

  // Returns a copy of the in-memory voicemails array
  getVoicemails(){
    return this.voicemails.slice();
  }

  // Removes one of the items from the in-memory voicemails and emits the new list to listeners
  removeVoicemailFromArray(voicemailItem: VoicemailItem) {
    // TODO: Show spinner while deletion is running
      const index = this.voicemails.indexOf(voicemailItem, 0);
      if (index > -1) {
        this.voicemails.splice(index, 1);
        this.voicemailsChanged.emit(this.voicemails.slice());
      }
  }

  // ====================== HTTP Calls ======================

  // Get voicemails from server
  retrieveVoicemails(token, accountId, tn){
    const headers = new HttpHeaders().set('token', token);
    let res = this.http.get(`${this.apiRoot}/get/getvoicemailmessages`, {headers: headers, params: {tn: tn, accountid: accountId}, responseType: 'text'});
    return res;
  }

  // Get the voicemail file from the server
  retrieveVoicemailFile(accountId, tn, voicemailId, voicemailToken) {
    let queryParams = new HttpParams()
                        .set("tn", tn)
                        .set("accountid", accountId)
                        .set("fileid", voicemailId)
                        .set("token", voicemailToken)
    let res = this.http.get(`${this.apiRoot}/stream/getvoicemailfile`, {params: queryParams, responseType: 'blob'});
    return res;
  }

  retrieveVoicemailSettings(token, accountId, tn){
    const headers = new HttpHeaders().set('token', token);
    let res = this.http.get(`${this.apiRoot}/get/getvoicemail`, {headers: headers, params: {tn: tn, accountid: accountId}, responseType: 'text'});
    return res;
  }

  retreiveVoicemailOptions(token, accountId, tn){
    const headers = new HttpHeaders().set('token', token);
    let res = this.http.get(`${this.apiRoot}/get/getvoicemailoptions`, {headers: headers, params: {tn: tn, accountid: accountId}, responseType: 'text'});
    return res;
  }

  setVoicemail(token, accountId, tn, configObj){
    const headers = new HttpHeaders().set('token', token);
    const queryParams = new HttpParams()
                            .set('tn', tn)
                            .set('accountid', accountId)
                            .set('subscribed', configObj["subscribed"])
                            .set('rings', configObj["rings"])
    let res = this.http.get(`${this.apiRoot}/set/setvoicemail`, {headers: headers, params: queryParams, responseType: 'text'});
    return res;
  }

  setVoicemailAsRead(token, accountId, tn, vm_messageid){
    const headers = new HttpHeaders().set('token', token);
    const queryParams = new HttpParams()
                            .set('tn', tn)
                            .set('accountid', accountId)
                            .set('vm_messageid', vm_messageid)
    let res = this.http.get(`${this.apiRoot}/set/setvoicemailread`, {headers: headers, params: queryParams, responseType: 'text'});
    return res;
  }

  updateVoicemailOptions(token:string, accountId:string, tn:string, configObj:object){
    const headers = new HttpHeaders().set('token', token);
    const queryParams = new HttpParams()
                              .set('tn', tn)
                              .set('accountid', accountId)
                              .set('vm_allowforward', configObj["allowForward"])
                              .set('vm_forwardemail', configObj["forwardEmail"])
                              .set('vm_allownotify', configObj["notifyByEmail"])
                              .set('vm_notifyemail', configObj["notifyEmail"])
                              .set('vm_callname', configObj["callerIdName"])
                              .set('vm_callnumber', configObj["callerIdNumber"])
                              .set('vm_messagelen', configObj["messageLength"])
                              .set('vm_messagetime', configObj["messageTime"])
                              .set('vm_messagedate', configObj["messageDate"])
                              .set('vm_mailboxtn', configObj["mailboxNumber"])
    let res = this.http.get(`${this.apiRoot}/set/updatevoicemailoptions`, {headers: headers, params: queryParams, responseType: 'text'});
    return res;
  }

  // Delete the voicemail from Big River servers
  deleteVoicemail(token, accountId, tn, voicemail: VoicemailItem){
    // TODO: Make HTTP call to BR to delete the voicemail, THEN remove it from the list
    const headers = new HttpHeaders().set('token', token);
    let res = this.http.get(
      `${this.apiRoot}/set/deletevoicemailmessage`, 
      {
        headers: headers, 
        params: {
          tn: tn,
          accountid: accountId,
          vm_messageid: voicemail.messageId
        }, 
      responseType: 'text'
    });
    return res;
  }

  // ====================== Utility Functions ======================

  // Parse the XML coming back from Big River into JSON
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
      return str;
    }
  }
}
