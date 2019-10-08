import { Component, OnInit } from '@angular/core';
import { UserService } from '../users/user.service';
import { User } from '../users/user';
import { AnonymousCallRejectionService } from './anonymous-call-rejection.service';

@Component({
  selector: 'app-anonymous-call-rejection',
  templateUrl: './anonymous-call-rejection.component.html',
  styleUrls: ['./anonymous-call-rejection.component.scss'],
  providers: [AnonymousCallRejectionService]
})
export class AnonymousCallRejectionComponent implements OnInit {
  component = 'AnonymousCallRejectionComponent'
  currentUser: User;
  isEnabled: Boolean = false;
  isToggling: Boolean = false;

  constructor(private acrService: AnonymousCallRejectionService, private userService: UserService) { }

  ngOnInit() {
    this.userService.currentUser.subscribe((user) => {
      this.currentUser = user;
      console.log(this.currentUser)
      // Get the anonymous call rejection fields from the server & set isEnabled
      this.acrService.retreiveAnonymousCallRejection(this.currentUser.token, this.currentUser.accountId, this.currentUser.selectedTn.number).subscribe((data) => {
        let jsonResponse = this.acrService.parseXml(data);
        if (jsonResponse["Response"]["Status"]["Code"] == "200") {
          let obj = jsonResponse["Response"]["SwitchGetAnonymousCallRejection"];
          this.isEnabled = this.stringToBoolOrNull(obj["enabled"]);
        } else {
          // Error
        }
      })
    })
  }

  toggleEnabledStatus(){
    this.isToggling = true;
    // Set the new value on BR servers first, then change the value locally
    this.acrService.setAnonymousCallRejection(
      this.currentUser.token, 
      this.currentUser.accountId, 
      this.currentUser.selectedTn.number, 
      { 
        subscribed: !this.isEnabled, 
        enabled: !this.isEnabled
      }).subscribe((data) => {
        this.isToggling = false;
        // If the data is good, set new value
        this.isEnabled = !this.isEnabled;
      }, (error) => {
        this.isToggling = false;
        console.log("error occurred");
      }
    )
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
