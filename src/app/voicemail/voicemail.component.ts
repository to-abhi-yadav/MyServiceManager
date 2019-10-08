import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VoicemailService } from './voicemail.service';
import { VoicemailItem } from './voicemail-item/voicemail-item.model';
import { VoicemailSettingsComponent } from './voicemail-settings/voicemail-settings.component'
import { UserService } from '../users/user.service';
import { User } from '../users/user';

@Component({
  selector: 'app-voicemail',
  templateUrl: './voicemail.component.html',
  styleUrls: ['./voicemail.component.scss'],
  providers: [VoicemailService]
})
export class VoicemailComponent implements OnInit {
  component = 'VoicemailComponent'
  currentUser: User;
  voicemails: VoicemailItem[];
  // to toggle the VoicemailSettingsComponent
  showSettings: Boolean = true;
  noVoicemails: Boolean = false;
  // Reference to the child VoicemailSettingsComponent
  @ViewChild('voicemailSettings') private voicemailSettings: VoicemailSettingsComponent;

  // display
  stillLoadingVoicemails: boolean = true;

  constructor(private userService: UserService, private voicemailService: VoicemailService) { 
    
  }

  ngOnInit() {
      
      this.currentUser = this.userService.currentUserValue

      // Retrieve voicemails from Big River and convert them to VoicemailItem objects, and add them to the service's list of voicemails
      this.voicemailService.retrieveVoicemails(this.currentUser.token, this.currentUser.accountId, this.currentUser.selectedTn.number).subscribe(voicemails => {
        let voicemailData = this.voicemailService.parseXml(voicemails);
        this.convertAndAddVoicemailDataToVoicemailItems(voicemailData);
        this.noVoicemails = false;
      }, error => {
        if (error.status == 423){
          // No voicemails on account
          this.noVoicemails = true;
          this.stillLoadingVoicemails = false;
        }
      });
      
      // Get new voicemails from service when the voicemails list has changed
      this.voicemailService.voicemailsChanged
        .subscribe((voicemails: VoicemailItem[]) => {
          this.voicemails = voicemails;
          this.stillLoadingVoicemails = false;
          if (this.voicemails.length == 0) {
            this.noVoicemails = true;
          } else {
            this.noVoicemails = false;
          }
        })

  }

  convertAndAddVoicemailDataToVoicemailItems(voicemailData: any){
    // Loop over voicemails converting them to VoicemailItems
    let voicemailItems = [];
    const myVoicemails = voicemailData["Response"]["Voicemail"]
    // Object comes back as an array of >1 and as an object if just 1
    if (myVoicemails["Message"].length > 1) {
      myVoicemails["Message"].map((element) => {
        const reviewed = (element.Reviewed == "True") ? true : false;
        let vI = new VoicemailItem(element.MessageID, element.ANI, element.Recorded, reviewed, '', element.token);
        voicemailItems.push(vI);
      })
      this.voicemailService.addVoicemails(voicemailItems);
    } else if (myVoicemails["Message"]) {
      const reviewed = (myVoicemails["Message"].Reviewed == "True") ? true : false;
      let vI = new VoicemailItem(myVoicemails["Message"].MessageID, myVoicemails["Message"].ANI, myVoicemails["Message"].Recorded, reviewed, '', myVoicemails["Message"].token);
      this.voicemailService.addVoicemail(vI);
    } else {
      // No voicemails
    }
  }

  launchModal(){
    this.showSettings = true;
    this.voicemailSettings.open()
  }
}
