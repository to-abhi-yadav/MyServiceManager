import { environment } from 'src/environments/environment';

export class VoicemailItem {
  private audioBlob: Blob = null;
  apiRoot: string

  constructor(
    public messageId: string, 
    public from: string, 
    public recorded: string, 
    public reviewed: boolean, 
    public audioFile: any,
    public voicemailToken: any){ 
      this.apiRoot = `${environment.brApiUrl}`
  }

  getAudioBlob(){
    return this.audioBlob;
  }

  setAudioBlob(blob){
    this.audioBlob = blob;
  }

  getUrlForVoicemailFile(tn, accountid){
    return `${this.apiRoot}/tn/stream/getvoicemailfile?tn=` + tn + "&accountid=" + accountid + "&fileid=" + this.messageId + "&token=" + this.voicemailToken
  }
}
