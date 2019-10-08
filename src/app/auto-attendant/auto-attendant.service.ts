import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { NgxXml2jsonService } from 'ngx-xml2json';
import { OffBusinessHoursComponent } from './off-business-hours/off-business-hours.component'



@Injectable()
export class AutoAttendantService{
  apiRoot: string;
  
  constructor(private http: HttpClient, private ngxXml2jsonService: NgxXml2jsonService) {
    this.apiRoot = `${environment.brApiUrl}/tn`
  }

  getBusinessHours(token, tn, accountId, aa_type){
    const headers = new HttpHeaders().set('token', token);
    const queryParams = new HttpParams()
                            .set('tn', tn)
                            .set('accountid', accountId)
                            .set('aa_type', aa_type)
    let res = this.http.get(`${this.apiRoot}/get/getautoattendantinfo`, {headers: headers, params: queryParams, responseType: 'text'});
    return res;
  }

  setBusinessHours(token, tn, accountId, aa_type, aa_hours){
    const headers = new HttpHeaders().set('token', token);
    const queryParams = new HttpParams()
                            .set('tn', tn)
                            .set('accountid', accountId)
                            .set('aa_type', aa_type)
                            .set('aa_hours', aa_hours)
    let res = this.http.get(`${this.apiRoot}/set/setautoattendantinfo`, {headers: headers, params: queryParams, responseType: 'text'});
    return res;
  }

  getHolidayDates(token, tn, accountId, aa_type){
    const headers = new HttpHeaders().set('token', token);
    const queryParams = new HttpParams()
                            .set('tn', tn)
                            .set('accountid', accountId)
                            .set('aa_type', aa_type)
    let res = this.http.get(`${this.apiRoot}/get/getautoattendantinfo`, {headers: headers, params: queryParams, responseType: 'text'});
    return res;
  }

  setHolidayDates(token, tn, accountId, aa_type, aa_year, aa_month, aa_day){
    const headers = new HttpHeaders().set('token', token);
    const queryParams = new HttpParams()
                            .set('tn', tn)
                            .set('accountid', accountId)
                            .set('aa_type', aa_type)
                            .set('aa_year', aa_year)
                            .set('aa_month', aa_month)
                            .set('aa_day', aa_day)
    let res = this.http.get(`${this.apiRoot}/set/setautoattendantinfo`, {headers: headers, params: queryParams, responseType: 'text'});
    return res;
  }

  deleteHolidayDate(token, tn, accountId, aa_type, aa_year, aa_month, aa_day){
    const headers = new HttpHeaders().set('token', token);
    const queryParams = new HttpParams()
                            .set('tn', tn)
                            .set('accountid', accountId)
                            .set('aa_type', aa_type)
                            .set('aa_year', aa_year)
                            .set('aa_month', aa_month)
                            .set('aa_day', aa_day)
    let res = this.http.get(`${this.apiRoot}/set/setautoattendantinfo`, {headers: headers, params: queryParams, responseType: 'text'});
    return res;
  }

  addAnnouncementFile(tn, accountID, type, id, uploadfile, description) {
    const  headers = new HttpHeaders({ "Content-Type": "multipart/form-data" })
  
    const formData = new FormData();
    formData.append('uploadfile', uploadfile);
    const params = new HttpParams() 
      .set('tn', tn)
      .set('accountid', accountID)
      .set('aa_type', type)
      .set('aa_announcementid', id )
      .set('aa_description', description)
    let res = this.http.post(`${this.apiRoot}/upload/uploadannouncementfile`, formData, {params, responseType: 'text'})
    //let res = this.http.post(`${this.apiRoot}/upload/uploadannouncementfile`, formData)
    return res
  }

  updateAnnouncementFile(tn, accountID, type, id, uploadfile, description) {
    const  headers = new HttpHeaders({ "Content-Type": "multipart/form-data" })
  
    const formData = new FormData();
    formData.append('uploadfile', uploadfile);
    const params = new HttpParams() 
      .set('tn', tn)
      .set('accountid', accountID)
      .set('aa_type', type)
      .set('aa_announcementid', id )
      .set('aa_description', description)
    let res = this.http.post(`${this.apiRoot}/upload/uploadannouncementfile`, formData, {params, responseType: 'text'})
    //let res = this.http.post(`${this.apiRoot}/upload/uploadannouncementfile`, formData)
    return res
  }

  retrieveAnnouncementFile(tn, accountID, id) {
    const params = new HttpParams() 
      .set('tn', tn)
      .set('accountid', accountID)
      .set('aa_announcementid', id )
    let res = this.http.post(`${this.apiRoot}/download/getannouncementfile`, {params: params, responseType: 'text'})
    return res
  }

  retrieveTTSFile(tn, accountID, message) {
    const params = new HttpParams() 
      .set('tn', tn)
      .set('accountid', accountID)
      .set('tts_message', message)
    let res = this.http.get(`${this.apiRoot}/download/getttsfile`, {params: params, responseType: 'blob'})
    return res
  }

  retrieveAutoattendantInfo(tn, accountID, type) {
    const params = new HttpParams() 
      .set('tn', tn)
      .set('accountid', accountID)
      .set('aa_type', type)
    let res = this.http.get(`${this.apiRoot}/get/getautoattendantinfo`, {params: params, responseType: 'text'})
    return res
  }

  retrieveAutoattendantAnouncements(tn, accountID, type, id) {
    const params = new HttpParams() 
      .set('tn', tn)
      .set('accountid', accountID)
      .set('aa_type', type)
      .set('aa_menuid', id)
    let res = this.http.get(`${this.apiRoot}/get/getautoattendantinfo`, {params: params, responseType: 'text'})
    return res
  }

  retrieveAAFile(tn, accountId, aa_announcementid){
    const params = new HttpParams() 
      .set('tn', tn)
      .set('accountid', accountId)
      .set('aa_announcementid', aa_announcementid)
    let res = this.http.get(`${this.apiRoot}/download/getannouncementfile`, {params: params, responseType: 'blob'})
    return res
  }

  getAAKey(token, tn, accountId, aa_type, aa_menuid) {
    const headers = new HttpHeaders().set('token', token);
    const queryParams = new HttpParams()
                            .set('tn', tn)
                            .set('accountid', accountId)
                            .set('aa_type', aa_type)
                            .set('aa_menuid', aa_menuid)
    let res = this.http.get(`${this.apiRoot}/get/getautoattendantinfo`, {headers: headers, params: queryParams, responseType: 'text'});
    return res;
  }

  setAAKey(token, tn, accountId, aa_type, aa_menuid, aa_action, aa_keypress, aa_parm){
    const headers = new HttpHeaders().set('token', token);
    const queryParams = new HttpParams()
                            .set('tn', tn)
                            .set('accountid', accountId)
                            .set('aa_type', aa_type)
                            .set('aa_menuid', aa_menuid)
                            .set('aa_action', aa_action)
                            .set('aa_keypress', aa_keypress)
                            .set('aa_parm', aa_parm)
    let res = this.http.get(`${this.apiRoot}/set/setautoattendantinfo`, {headers: headers, params: queryParams, responseType: 'text'});
    return res;
  }

  retrieveAutoAttendantStatus(token, tn, accountId){
    const headers = new HttpHeaders().set('token', token);
    const queryParams = new HttpParams()
                            .set('tn', tn)
                            .set('accountid', accountId)
    let res = this.http.get(`${this.apiRoot}/get/getautoattendant`, {headers: headers, params: queryParams, responseType: 'text'});
    return res;
  }

  setAutoAttendantStatus(token, tn, accountId, enabled){
    const headers = new HttpHeaders().set('token', token);
    const queryParams = new HttpParams()
                            .set('tn', tn)
                            .set('accountid', accountId)
                            .set('enabled', enabled)
    let res = this.http.get(`${this.apiRoot}/set/setautoattendant`, {headers: headers, params: queryParams, responseType: 'text'});
    return res;
  }

  retrieveUploadFile(token, tn, accountid, aa_announcementid) {
    const headers = new HttpHeaders().set('token', token);
    const queryParams = new HttpParams()
                            .set('tn', tn)
                            .set('accountid', accountid)
                            .set('aa_announcementid', aa_announcementid)
    let res = this.http.get(`${this.apiRoot}/set/setannouncementfile`, {headers: headers, params: queryParams, responseType: 'text'});
    return res;
  }

  retrieveTTSPreviewFile(tn, accountID, aa_type, aa_announcementid, tts_message) {
    const params = new HttpParams() 
      .set('tn', tn)
      .set('accountid', accountID)
      .set('aa_type', aa_type)
      .set('aa_announcementid', aa_announcementid)
      .set('tts_message', tts_message)
    let res = this.http.get(`${this.apiRoot}/set/setttsmessage`, {params: params, responseType: 'text'})
    return res
  }

  setTTSFile(tn, accountID, aa_type, aa_description, fileid) {
    const params = new HttpParams() 
      .set('tn', tn)
      .set('accountid', accountID)
      .set('aa_type', aa_type)
      .set('aa_description', aa_description)
      .set('fileid', fileid)
    let res = this.http.get(`${this.apiRoot}/set/uploadttsmessage`, {params: params, responseType: 'text'})
    return res
  }

  updateTTSFile(tn, accountID, aa_type, aa_announcementid, fileid) {
    const params = new HttpParams() 
      .set('tn', tn)
      .set('accountid', accountID)
      .set('aa_type', aa_type)
      .set('aa_announcementid', aa_announcementid)
      .set('fileid', fileid)
    let res = this.http.get(`${this.apiRoot}/set/uploadttsmessage`, {params: params, responseType: 'text'})
    return res
  }

  parseXml(xmlStr) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlStr, 'text/xml');
    const obj = this.ngxXml2jsonService.xmlToJson(xml);
    return obj;
  }
}