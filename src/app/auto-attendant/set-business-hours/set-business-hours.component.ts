import { Component, ElementRef, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AutoAttendantService } from '../auto-attendant.service';
import { UserService } from 'src/app/users/user.service';
import { User } from 'src/app/users/user';

@Component({
    selector: 'app-set-business-hours',
    templateUrl: './set-business-hours.component.html',
    styleUrls: ['./set-business-hours.component.scss']
})
export class SetBusinessHoursComponent implements OnInit {
    closeResult : string;
    saving : Boolean = false;
    aa_hours : string = '';
    hasError : Boolean = false;
    errorMsg : string = '';
    @ViewChild('busHoursComponent') public busHoursComponent: ElementRef;
    @Input() currentUser: User;

    monStart : string = '';
    monEnd : string = '';
    tueStart : string = '';
    tueEnd : string = '';
    wedStart : string = '';
    wedEnd : string = '';
    thursStart : string = '';
    thursEnd : string = '';
    friStart : string = '';
    friEnd : string = '';
    satStart : string = '';
    satEnd : string = '';
    sunStart : string = '';
    sunEnd : string = '';

    constructor(private modalService: NgbModal, private aaService : AutoAttendantService, private userService: UserService) { }

    ngOnInit(){
      this.userService.currentUser.subscribe((user) => {
        this.currentUser = user;
        this.aaService.getBusinessHours(
          this.currentUser.token,
          this.currentUser.selectedTn.number,
          this.currentUser.accountId,
          'hours').subscribe((data) => {
            let jsonResponse = this.aaService.parseXml(data);
            if (jsonResponse["Response"]["Status"]["Code"] == "200"){
              let obj = jsonResponse["Response"]["AutoAttendant"]["Hours"]
              this.monStart = this.returnStringIfEmpty(obj["Mon"]["start"]);
              this.monEnd = this.returnStringIfEmpty(obj["Mon"]["end"]);
              this.tueStart = this.returnStringIfEmpty(obj["Tue"]["start"]);
              this.tueEnd = this.returnStringIfEmpty(obj["Tue"]["end"]);
              this.wedStart = this.returnStringIfEmpty(obj["Wed"]["start"]);
              this.wedEnd = this.returnStringIfEmpty(obj["Wed"]["end"]);
              this.thursStart = this.returnStringIfEmpty(obj["Thu"]["start"]);
              this.thursEnd = this.returnStringIfEmpty(obj["Thu"]["end"]);
              this.friStart = this.returnStringIfEmpty(obj["Fri"]["start"]);
              this.friEnd = this.returnStringIfEmpty(obj["Fri"]["end"]);
              this.satStart = this.returnStringIfEmpty(obj["Sat"]["start"]);
              this.satEnd = this.returnStringIfEmpty(obj["Sat"]["end"]);
              this.sunStart = this.returnStringIfEmpty(obj["Sun"]["start"]);
              this.sunEnd = this.returnStringIfEmpty(obj["Sun"]["end"]);
            }
            else{
              this.hasError = true;
              this.errorMsg = "Business hours cannot be retrived."
            }
          })
      })
    }

    updateBusinessHours(){
      this.saving = true;
      this.aa_hours = '{"Thu":{"end":' + '"' + this.thursEnd + '"' + ',"start":' + '"' + this.thursStart + '"},' +
      '"Wed":{"end":' + '"' + this.wedEnd + '"' + ',"start":' + '"' + this.wedStart + '"},' +
      '"Fri":{"end":' + '"' + this.friEnd + '"' + ',"start":' + '"' + this.friStart + '"},' +
      '"Tue":{"end":' + '"' + this.tueEnd + '"' + ',"start":' + '"' + this.tueStart + '"},' +
      '"Sun":{"end":' + '"' + this.sunEnd + '"' + ',"start":' + '"' + this.sunStart + '"},' +
      '"Sat":{"end":' + '"' + this.satEnd + '"' + ',"start":' + '"' + this.satStart + '"},' + 
      '"Mon":{"end":' + '"' + this.monEnd + '"' + ',"start":' + '"' + this.monStart + '"}}'
      this.aaService.setBusinessHours(
        this.currentUser.token,
        this.currentUser.selectedTn.number,
        this.currentUser.accountId,
        'hours',
        this.aa_hours).subscribe((response) =>{
          this.saving = false;
        }, (error) => {
          this.saving = false;
          this.hasError = true;
          this.errorMsg = "Business hours cannot be set.";
        })
    }

    public open() {
        let content = this.busHoursComponent
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

    returnStringIfEmpty(obj){
      for(var prop in obj) {
        if(obj.hasOwnProperty(prop)) {
          return obj
        }
      }
      return '';
    }
} 