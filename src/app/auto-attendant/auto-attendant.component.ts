import { Component, OnInit, ViewChild } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../users/user.service';
import { User } from '../users/user';
import { SetBusinessHoursComponent} from './set-business-hours/set-business-hours.component';
import { SetHolidayDatesComponent} from './set-holiday-dates/set-holiday-dates.component';
import { AutoAttendantService} from './auto-attendant.service';
import { OffBusinessHoursComponent } from './off-business-hours/off-business-hours.component';
import { HolidaysComponent } from './holidays/holidays.component';


@Component({
  selector: 'app-auto-attendant',
  templateUrl: './auto-attendant.component.html',
  styleUrls: ['./auto-attendant.component.scss'],
  providers: [AutoAttendantService]
})
export class AutoAttendantComponent implements OnInit {
  component = 'AutoAttendantComponent';
  currentUser: User;
  isRegularBusinessHours = false;
  isOffBusinessHours = false;
  isHolidays = false;
  isEnabled: Boolean = false;
  isToggling: Boolean = false;
  hasError: Boolean = false;
  errorMsg: String = "";
  @ViewChild('setBusinessHours') private setBusinessHours: SetBusinessHoursComponent;
  @ViewChild('setHolidayDates') private setHolidayDates: SetHolidayDatesComponent;
  @ViewChild('holidayHours') public holidayHours: HolidaysComponent

  constructor(private aasService : AutoAttendantService, private userService : UserService) { }

  ngOnInit() {
    this.userService.currentUser.subscribe((user) =>{
      this.currentUser = user;
    })
    this.aasService.retrieveAutoAttendantStatus(
      this.currentUser.token,
      this.currentUser.selectedTn.number,
      this.currentUser.accountId).subscribe((data) => {
        let jsonResponse = this.aasService.parseXml(data);
        if (jsonResponse["Response"]["Status"]["Code"] == "200") {
          let obj = jsonResponse["Response"]["AutoAttendant"];
          this.isEnabled = this.stringToBoolOrNull(obj["enabled"]);
          console.log(this.isEnabled);
        }
        else {
          this.hasError = true;
          this.errorMsg = "Cannot retrieve the status of Auto Attendant!";
        } 
      })
  }

  toggleEnabledStatus() {
    this.isEnabled = !this.isEnabled;
    this.isToggling = true;
    this.aasService.setAutoAttendantStatus(
      this.currentUser.token,
      this.currentUser.selectedTn.number,
      this.currentUser.accountId,
      this.isEnabled).subscribe((data) => {
        this.isToggling = false;
      }, (error) => {
        this.isToggling = false;
        this.hasError = true;
        this.errorMsg = "Unable to change the Auto Attendant status!"
      })
  }

  isRegularHours() {
    this.isRegularBusinessHours = !this.isRegularBusinessHours
  }

  isOffHours() {
    this.isOffBusinessHours = !this.isOffBusinessHours
  }

  isHolidayHours() {
    this.isHolidays = !this.isHolidays
  }

  launchModalSetBusinessHours(){
    this.setBusinessHours.open();
  }
  
  launchModalSetHolidayDates(){
    this.setHolidayDates.open();
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
