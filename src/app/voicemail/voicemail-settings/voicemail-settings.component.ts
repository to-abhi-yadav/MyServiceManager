import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { VoicemailService } from '../voicemail.service';
import { UserService } from 'src/app/users/user.service';
import { User } from 'src/app/users/user';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-voicemail-settings',
  templateUrl: './voicemail-settings.component.html',
  styleUrls: ['./voicemail-settings.component.scss']
})
export class VoicemailSettingsComponent implements OnInit, OnDestroy {
  closeResult: string;
  @ViewChild('content') public content: ElementRef;
  @Input() currentUser: User;

  // attributes for driving the settings
  public enableVoicemail: Boolean = false;
  public numberOfRings: number = 0;
  public forwardVoicemailToEmail: Boolean = false;
  public forwardVoicemailEmail: string = '';
  public sendNotifToEmail: Boolean = false;
  public notifyEmail: string = '';
  public callerIdName: Boolean = false;
  public messageLength: Boolean = false;
  public dateOfMessage: Boolean = false;
  public callerIdNumber: Boolean = false;
  public timeOfMessage: Boolean = false;
  public yourMailboxNumber: Boolean = false;

  // Display attributes
  public stillLoadingVoicemail: boolean = true;
  public stillLoadingVoicemailOptions: boolean = true;
  public saving: boolean = false;
  public invalidForwardEmail: boolean = false;
  public invalidNotifyEmail: boolean = false;

  subs = new Subscription()

  constructor(private modalService: NgbModal, private voicemailService: VoicemailService, private userService: UserService) {
    // Assume we have current user from the parent component

  }

  ngOnInit() {
    this.retrieveVoicemailSettings()
  }

  retrieveVoicemailSettings() {
    this.subs.add(
      // GetVoicemail to get the # of rings and whether they have VM or not
    // GetVoicemailOptions to get the remaining items
    this.voicemailService.retrieveVoicemailSettings(this.currentUser.token, this.currentUser.accountId, this.currentUser.selectedTn.number)
    .pipe(take(1))
    .subscribe((data) => {
      // If enabled, enable all other fields & get the settings
      const jsonData = this.voicemailService.parseXml(data);
      const voicemailSettings = jsonData["Response"]["SwitchGetVoicemail"]
      
      if (voicemailSettings["result"] == "OK" && this.voicemailService.stringToBoolOrNull(voicemailSettings["subscribed"])) {
        this.enableVoicemail = true;
        this.numberOfRings = parseInt(voicemailSettings["rings"]);
        this.stillLoadingVoicemail = false;

        // Get Voicemail Options
        this.voicemailService.retreiveVoicemailOptions(this.currentUser.token, this.currentUser.accountId, this.currentUser.selectedTn.number).subscribe((data) => {
          const jsonOptionObj = this.voicemailService.parseXml(data);
          let jsonOptions = null;
          // If the call came back successful
          if (jsonOptionObj["Response"]["Status"]["Code"] == "200") {
            jsonOptions = jsonOptionObj["Response"]["Voicemail"]
          }
          // Loop over the object and convert their string "True" and "False" and "None" into true, false, null values
          for (var key in jsonOptions) {
            if (jsonOptions.hasOwnProperty(key)) {           
                jsonOptions[key] = this.voicemailService.stringToBoolOrNull(jsonOptions[key])
            }
          }
          // Now we have a usable object for these values
          this.forwardVoicemailToEmail = jsonOptions["AllowForward"]
          if (typeof jsonOptions["ForwardEmail"] == "string"){
            this.forwardVoicemailEmail = jsonOptions["ForwardEmail"]
          }
          this.sendNotifToEmail = jsonOptions["AllowNotify"]
          if (typeof jsonOptions["NotifyEmail"] == "string") {
            this.notifyEmail = jsonOptions["NotifyEmail"]
          }
          this.callerIdName = jsonOptions["CallerIDName"]
          this.callerIdNumber = jsonOptions["CallerNumber"]
          this.messageLength = jsonOptions["MessageLength"]
          this.timeOfMessage = jsonOptions["TimeOfMessage"]
          this.dateOfMessage = jsonOptions["DateOfMessage"]
          this.yourMailboxNumber = jsonOptions["MailboxNumber"]
          this.stillLoadingVoicemailOptions = false;
        })
      } else {
        this.enableVoicemail = false;
        this.numberOfRings = 0;
        this.stillLoadingVoicemail = false;
        this.stillLoadingVoicemailOptions = false;
      }
    })
    )
  }

  public open() {
    let content = this.content
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    this.retrieveVoicemailSettings()
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  updateForwardingEmail(eventData){
    this.forwardVoicemailEmail = eventData.currentTarget.value;
  }

  updateNotifyEmail(eventData) {
    this.notifyEmail = eventData.currentTarget.value;
  }

  updateVoicemailSettings(){
    this.stillLoadingVoicemail = true;
    this.saving = true;
    // We need to actually make two calls, one to update getvoicemail and one to update voicemail settings
    const config = {
      subscribed: this.enableVoicemail,
      rings: this.numberOfRings
    }
    this.subs.add(
      this.voicemailService.setVoicemail(this.currentUser.token, this.currentUser.accountId, this.currentUser.selectedTn.number, config)
      .pipe(take(1))
      .subscribe((data) => {
        let jsonResponse = this.voicemailService.parseXml(data)
        // Stop spinning the top row
        this.stillLoadingVoicemail = false;
  
        if (this.enableVoicemail){
          // update voicemail options
          // Setup for setVoicemailOptions
          let updateConfig = {
            callerIdName: this.callerIdName,
            callerIdNumber: this.callerIdNumber,
            messageLength: this.messageLength,
            messageTime: this.timeOfMessage,
            messageDate: this.dateOfMessage,
            mailboxNumber: this.yourMailboxNumber
          }
          if (this.forwardVoicemailToEmail && this.emailFormattedCorrectly(this.forwardVoicemailEmail)) {
            updateConfig["allowForward"] = this.forwardVoicemailToEmail;
            updateConfig["forwardEmail"] = this.forwardVoicemailEmail;
          } else if (!this.forwardVoicemailToEmail){
            updateConfig["allowForward"] = this.forwardVoicemailToEmail;
            updateConfig["forwardEmail"] = null;
            this.forwardVoicemailEmail = "";
          }
  
          if (this.sendNotifToEmail && this.emailFormattedCorrectly(this.notifyEmail)){
            updateConfig["notifyByEmail"] = this.sendNotifToEmail;
            updateConfig["notifyEmail"] = this.notifyEmail;
          } else if (!this.sendNotifToEmail){
            updateConfig["notifyByEmail"] = this.sendNotifToEmail;
            updateConfig["notifyEmail"] = null;
            this.notifyEmail = "";
          }
          this.updateVoicemailOptions(updateConfig)
        } else {
          // Don't update voicemail options
          this.stillLoadingVoicemail = false;
          this.saving = false;
        }
        
      })
    )
  }

  updateVoicemailOptions(updateConfig: any) {
    this.subs.add(
      this.voicemailService.updateVoicemailOptions(this.currentUser.token, this.currentUser.accountId, this.currentUser.selectedTn.number, updateConfig)
      .pipe(take(1))
      .subscribe((data) => {
        let jsonResponse = this.voicemailService.parseXml(data)
        // stop spinning the save button
        this.saving = false;
      })
    )
  }

  emailFormattedCorrectlyForInput(eventData: any){
    if (eventData.target.classList.contains("notifyEmail")){
      // This is the notify input
      this.invalidNotifyEmail = false;
      var emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (eventData.target.value == "") {
        this.invalidNotifyEmail = false;
        return true;
      }else if (eventData.target.value.search(emailRegEx) == -1) {
        this.invalidNotifyEmail = true;
        return false;
      } else {
        this.invalidNotifyEmail = false;
        return true;
      }
    } else if (eventData.target.classList.contains("forwardEmail")) {
      // This is the forward input
      this.invalidForwardEmail = false;
      var emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (eventData.target.value == "") {
        this.invalidForwardEmail = false;
        return true;
      } else if (eventData.target.value.search(emailRegEx) == -1){
        this.invalidForwardEmail = true;
        return false;
      } else {
        this.invalidForwardEmail = false;
        return true;
      }
    }
  }
  
  emailFormattedCorrectly(email: string){
    var status = false;     
    var emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (email.search(emailRegEx) == -1) {
      alert("Please enter a valid email address.");
      this.saving = false
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe()
  }
}
