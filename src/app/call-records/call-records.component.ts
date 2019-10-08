import { Component, OnInit, QueryList, ViewChildren, Input } from '@angular/core';
import { UserService } from '../users/user.service';
import { CallRecordService } from './call-record.service';
import { User } from '../users/user';
import { CallRecordItem } from './call-record-item/call-record-item.model';


@Component({
  selector: 'app-call-records',
  templateUrl: './call-records.component.html',
  styleUrls: ['./call-records.component.scss'],
  providers: [CallRecordService]
})
export class CallRecordsComponent implements OnInit {
  component = 'CallRecordsComponent'
  currentUser: User;
  myCallRecords: CallRecordItem[] = [];
  dateSortOrderDesc: boolean = true;
  numberSortOrderDesc: boolean = true;
  noCallRecords: boolean

  @Input() page = 1;
  @Input() pageSize = 3;
  @Input() collectionSize = this.myCallRecords.length;
  isLoading: boolean = false;

  constructor(private userService: UserService, private callRecordservice: CallRecordService) { }

  ngOnInit() {
    this.userService.currentUser.subscribe((user) => {
      this.noCallRecords = false
      this.currentUser = user;

      // Get call records
      this.callRecordservice.retrieveCallRecords(this.currentUser.token, this.currentUser.accountId, this.currentUser.selectedTn.number)
        .subscribe((data) => {
          let jsonResponse = this.callRecordservice.parseXml(data);

          this.noCallRecords = false
          // Loop over call records inserting them into object array
          const usermyCallRecords = jsonResponse["Response"]["CDR"]
          // Handle converting XML response into usable CallRecordItem(s)
          if (usermyCallRecords["Record"].length > 1) {
            // Multiple records
            usermyCallRecords["Record"].map(item => {
              this.myCallRecords.push(new CallRecordItem(item["CallDateTime"], item["CallAmount"], item["CallDuration"], item["CallType"], item["CalledFrom"].trim(), item["CalledTo"].trim()))
            });
          } else if (typeof usermyCallRecords["Record"] == "object") {
            // Only one record returned
            let item = usermyCallRecords["Record"];
            this.myCallRecords.push(
              new CallRecordItem(
                item["CallDateTime"], item["CallAmount"], item["CallDuration"], item["CallType"], item["CalledFrom"].trim(), item["CalledTo"].trim()
              )
            )
          } else {
            // ?
          }
        }, error => {
          if (error.status == 422){
            // No voicemails on account
            this.noCallRecords = true;
            // this.stillLoadingVoicemails = false;
          }
        })
    })
  }

  get callRecords(): CallRecordItem[] {
    return this.myCallRecords
      .map((callRecord, i) => ({id: i + 1, ...callRecord}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  onSort(eventData) {
    const field_to_sort_on = eventData.currentTarget.dataset["sortable"]
    switch (field_to_sort_on) {
      case "Date":
        this.sortmyCallRecordsByDate();
        break;
      case "Number":
        this.sortmyCallRecordsByNumber();
        break;
      default:
        break;
    }
  }

  // Sort call records by date & time
  sortmyCallRecordsByDate(){
    if (this.dateSortOrderDesc){
      this.myCallRecords.sort(function (a, b) {
        if (a.callDateTime > b.callDateTime) {
          return 1;
        }
        if (a.callDateTime < b.callDateTime) {
          return -1;
        }
        return 0;
      });
    } else {
      this.myCallRecords.sort(function (a, b) {
        if (a.callDateTime < b.callDateTime) {
          return 1;
        }
        if (a.callDateTime > b.callDateTime) {
          return -1;
        }
        return 0;
      });
    }
    this.dateSortOrderDesc = !this.dateSortOrderDesc;
  }

  // Sort call records by phone number
  sortmyCallRecordsByNumber(){
    if (this.numberSortOrderDesc) {
      this.myCallRecords.sort(function (a, b) {
        const a_field = (a.callType == "Outbound") ? a.calledTo : a.calledFrom
        const b_field = (b.callType == "Outbound") ? b.calledTo : b.calledFrom
        if (a_field > b_field) {
          return 1;
        }
        if (a_field < b_field) {
          return -1;
        }
        return 0;
      });
    } else {
      this.myCallRecords.sort(function (a, b) {
        const a_field = (a.callType == "Outbound") ? a.calledTo : a.calledFrom
        const b_field = (b.callType == "Outbound") ? b.calledTo : b.calledFrom
        if (a_field < b_field) {
          return 1;
        }
        if (a_field > b_field) {
          return -1;
        }
        return 0;
      });
    }
    this.numberSortOrderDesc = !this.numberSortOrderDesc
  }
}
