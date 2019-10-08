import { Component, OnInit, Input, PipeTransform, Renderer2, ElementRef, OnChanges } from '@angular/core';
import { User } from '../users/user';
import { CallRecordItem } from '../call-records/call-record-item/call-record-item.model';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { CallRecordService } from '../call-records/call-record.service';
import { FormControl } from '@angular/forms';
import { UserService } from '../users/user.service';
import { DatePipe } from '@angular/common';
import * as FileSaver from 'file-saver';
import { FileSaverService } from 'ngx-filesaver';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'

@Component({
  selector: 'app-call-records-page',
  templateUrl: './call-records-page.component.html',
  styleUrls: ['./call-records-page.component.scss'],
  providers: [CallRecordService, DatePipe]
})
export class CallRecordsPageComponent implements OnInit, OnChanges {
  currentUser: User;
  myCallRecords: CallRecordItem[] = [];
  dateSortOrderDesc: boolean = true;
  fromSortOrderDesc: boolean = true;
  toSortOrderDesc: boolean = true;
  noCallRecords: boolean
  showPdfDownload: boolean
  showPdfDownloadMsg: string

  searchTerm: string = ''

  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() collectionSize = this.myCallRecords.length;
  isLoading: boolean = true;

  filter = new FormControl('');

  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: ['', 'Date', 'Amount', 'Duration', 'Inbound/Outbound', 'From', 'To'],
    showTitle: true,
    title: 'Call Records',
    useBom: false,
    removeNewLines: true,
  };

  constructor(private userService: UserService, 
    private callRecordservice: CallRecordService, 
    private render: Renderer2, private elRef: ElementRef, 
    private datePipe: DatePipe, private fileSaverService: FileSaverService) { 

    }

  ngOnInit() {
    this.render.addClass(this.elRef.nativeElement.parentElement, 'no-scroll')
    this.currentUser = this.userService.currentUserValue;
    this.retrieveCallRecords();
    this.retrieveArchivedCallRecord();
  }

  ngOnChanges() {
    this.render.addClass(this.elRef.nativeElement.parentElement, 'no-scroll')
    this.currentUser = this.userService.currentUserValue;
    this.retrieveCallRecords();
    this.retrieveArchivedCallRecord();
  }

  retrieveArchivedCallRecord() {
    this.callRecordservice.retrieveArchivedCallRecord(this.currentUser.token, this.currentUser.accountId, this.currentUser.selectedTn.number).subscribe(data => {
      let res = this.callRecordservice.parseXml(data)
      if (res) { 
        res = res['Response']
        const startDate = res['StartDate']
        const endDate = res['EndDate']
        const fileName = res['Filename']
        this.showPdfDownloadMsg = 'Archived Call Records from ' + startDate + ' to ' + endDate + ' now available'
        this.showPdfDownload = true
      }
    }, error => {
        if (error) {
          console.log(error)
        }
    })
  }

  downloadArchivedCallRecord(){
    this.callRecordservice.retrieveArchivedCallRecordPdf(this.currentUser.token, this.currentUser.accountId, this.currentUser.selectedTn.number).subscribe(data => {
      if (data) { 
          this.fileSaverService.save(data, 'archived-call-record.pdf');
        }
    }, error => {
        if (error) {
          console.log(error)
        }
    })
  }

  retrieveCallRecords() {
    this.noCallRecords = false
    this.isLoading = true;
    this.myCallRecords = [];
    // Get call records from server
    this.callRecordservice.retrieveCallRecords(this.currentUser.token, this.currentUser.accountId, this.currentUser.selectedTn.number)
      .subscribe((data) => {
        let jsonResponse = this.callRecordservice.parseXml(data);
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
        this.isLoading = false;
      }, error => {
        if (error.status == 422) {
          // No voicemails on account
          this.noCallRecords = true;
          this.isLoading = false
          // this.stillLoadingVoicemails = false;
        }
      })
  }


  getFileName(text) {
    const now = Date.now()
    const hr = this.datePipe.transform(now, 'hh')
    const min = this.datePipe.transform(now, 'mm')
    const amPm = this.datePipe.transform(now, 'a')
    const date = this.datePipe.transform(now, 'M-dd-yy')
    const fileName = text + date + '_' + hr + '-' + min + '-' + amPm
    return fileName
  }

  get callRecords(): CallRecordItem[] {
    if (this.searchTerm == '') {
      return this.myCallRecords
        .map((callRecord, i) => ({ id: i + 1, ...callRecord }))
        .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    } else {
      return this.myCallRecords.filter(callRecord => {
        return callRecord.calledFrom.toLowerCase().includes(this.searchTerm)
          || callRecord.calledTo.toLowerCase().includes(this.searchTerm)
          || callRecord.callDateTime.toLowerCase().includes(this.searchTerm);
      }).map((callRecord, i) => ({ id: i + 1, ...callRecord }))
        .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
  }

  onSort(eventData) {
    const field_to_sort_on = eventData.currentTarget.dataset["sortable"]
    switch (field_to_sort_on) {
      case "Date":
        this.sortmyCallRecordsByDate();
        break;
      case "From":
        this.sortmyCallRecordsByFromNumber();
        break;
      case "To":
        this.sortmyCallRecordsByToNumber();
        break;
      default:
        break;
    }
  }

  search(event) {
    this.searchTerm = event.currentTarget.value.toLowerCase().trim();
    this.myCallRecords.filter(callRecord => {
      return callRecord.calledFrom.toLowerCase().includes(this.searchTerm) || callRecord.calledTo.toLowerCase().includes(this.searchTerm);
    });
  }

  // Sort call records by date & time
  sortmyCallRecordsByDate() {
    if (this.dateSortOrderDesc) {
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
  sortmyCallRecordsByFromNumber() {
    if (this.fromSortOrderDesc) {
      this.myCallRecords.sort(function (a, b) {
        if (a.calledFrom > b.calledFrom) {
          return 1;
        }
        if (a.calledFrom < b.calledFrom) {
          return -1;
        }
        return 0;
      });
    } else {
      this.myCallRecords.sort(function (a, b) {
        if (a.calledFrom < b.calledFrom) {
          return 1;
        }
        if (a.calledFrom > b.calledFrom) {
          return -1;
        }
        return 0;
      });
    }
    this.fromSortOrderDesc = !this.fromSortOrderDesc
  }

  // Sort call records by phone number
  sortmyCallRecordsByToNumber() {
    if (this.toSortOrderDesc) {
      this.myCallRecords.sort(function (a, b) {
        if (a.calledTo > b.calledTo) {
          return 1;
        }
        if (a.calledTo < b.calledTo) {
          return -1;
        }
        return 0;
      });
    } else {
      this.myCallRecords.sort(function (a, b) {
        if (a.calledTo < b.calledTo) {
          return 1;
        }
        if (a.calledTo > b.calledTo) {
          return -1;
        }
        return 0;
      });
    }
    this.toSortOrderDesc = !this.toSortOrderDesc
  }

  downloadCsv(search) {
    let data
    if (search === 'true') {
      data = this.myCallRecords
    } else {
      data = this.callRecords
    }
    const filename = this.getFileName('call-record-download_')
    const options = this.csvOptions
    new AngularCsv(data, filename, options);
  }

}
