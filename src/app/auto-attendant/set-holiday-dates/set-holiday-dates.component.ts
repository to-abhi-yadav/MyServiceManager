import { Component, ElementRef, Input, OnInit, AfterViewInit, ViewChild, NgModule } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDate, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoAttendantService } from '../auto-attendant.service';
import { UserService } from 'src/app/users/user.service';
import { User } from 'src/app/users/user';
import { Holiday } from './holiday.model';
import { isArray } from 'util';

@Component({
    selector: 'app-set-holiday-dates',
    templateUrl: './set-holiday-dates.component.html',
    styleUrls: ['./set-holiday-dates.component.scss']
})
export class SetHolidayDatesComponent implements OnInit {
    closeResult : string;
    date: {year: string, month: string, day: string};
    saving : Boolean = false;
    aa_holidays : string = '';
    hasError : Boolean = false;
    errorMsg : string = '';
    isDeleting : Boolean = false;
    n2019 : Holiday[] = [];
    holiday: String[] = [];
    x: String;
    page = 5;
    pageSize = 5;
    currentYear: Date;
    minDate = {year: 2019, month: 1, day: 1};
    maxDate = {year: 2019, month: 12, day: 31};
    @ViewChild('holidayDates') public holidayDates: ElementRef;
    @Input() currentUser: User;

    constructor(private modalService: NgbModal, private aaService : AutoAttendantService, private userService: UserService) { }

    ngOnInit(){
      this.userService.currentUser.subscribe((user) => {
        this.currentUser = user;
        this.aaService.getHolidayDates(
          this.currentUser.token,
          this.currentUser.selectedTn.number,
          this.currentUser.accountId,
          'holidays').subscribe((data) => {
            let jsonResponse = this.aaService.parseXml(data);
            if (jsonResponse["Response"]["Status"]["Code"] == "200") {
              let obj = jsonResponse["Response"]["AutoAttendant"]["Holidays"]["n2019"];
              this.n2019 = obj["Holiday"];
              if(isArray(this.n2019)){
                for (let i in this.n2019) {
                   this.x = this.n2019[i].month + '/' + this.n2019[i].day + '/' + this.n2019[i].year;
                   this.holiday.push(this.x);
                 }
              }
              else {
                let day: '';
                let month: '';
                let year: '';
                day = obj["Holiday"]["day"];
                month = obj["Holiday"]["month"];
                year = obj["Holiday"]["year"];
                if(day === ''){}
                else {
                  this.holiday.push(month + '/' + day + '/' + year);
                }
              }
            }
            else {
              this.hasError = true;
              this.errorMsg = "Cannot retrieve Holiday Dates!"
            }
          })
      })
    }

    updateHolidayDates(){
      this.saving = true;
      var d = this.date.day.toString();
      var m = this.date.month.toString();
      if(d.length < 2) {
        d = "0" + this.date.day;
      }
      if(m.length < 2) {
        m = "0" + this.date.month;
      }
      this.aaService.setHolidayDates(
        this.currentUser.token,
        this.currentUser.selectedTn.number,
        this.currentUser.accountId,
        'holidays',
        this.date.year,
        m,
        d).subscribe((data) => {
          this.holiday.push(m + '/' + d + '/' + this.date.year);
          this.saving = false;
        }, (error) => {
          this.saving = false;
          this.hasError = true;
          this.errorMsg = "Cannot set Holiday Date!";
        })
    }

    deleteHolidayDate(n){
      this.isDeleting = true;
      this.aaService.deleteHolidayDate(
        this.currentUser.token,
        this.currentUser.selectedTn.number,
        this.currentUser.accountId,
        'del_holidays',
        n.substring(6,10),
        n.substring(0,2),
        n.substring(3,5)).subscribe((data) => {
          const index = this.holiday.indexOf(n, 0)
          if (index > -1) {
            this.holiday.splice(index, 1)
          }
          this.isDeleting = false;
        }, (error) => {
          this.isDeleting = false;
        })
    }

    public open() {
        let content = this.holidayDates
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg'}).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    
    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
      } else {
      return  `with: ${reason}`;
      }
  }
}
