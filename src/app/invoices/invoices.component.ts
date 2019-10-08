import { Component, OnInit } from '@angular/core';
import { UserService } from '../users/user.service';
import { User } from '../users/user';
import { InvoicesService} from './invoices.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
  providers: [InvoicesService]
})
export class InvoicesComponent implements OnInit {

  currentUser : User;
  isToggling : Boolean = false;
  isDownloading : Boolean = false;
  billMonths : string[];
  hasError : Boolean = false;
  errorMsg : string = '';

  constructor(private iService : InvoicesService, private userService : UserService) { }

  ngOnInit() {
    this.isToggling = true;
    this.userService.currentUser.subscribe((user) => {
      this.currentUser = user;
      this.iService.retrieveBillMonths(this.currentUser.token,this.currentUser.selectedTn.number, this.currentUser.accountId).subscribe((data) => {
        let jsonResponse = this.iService.parseXml(data);
        if (jsonResponse["Response"]["Status"]["Code"] == "200") {
          let obj = jsonResponse["Response"]["BillManagement"];
          this.billMonths = obj["BillMonth"];
          this.isToggling = false;
        }
        else {
          this.hasError = true;
          this.errorMsg = 'Cannot retrieve invoices!';
          this.isToggling = false;
        }
      })
    })
  }

  downloadInvoice(currentBillMonth){
    this.isDownloading = true;
    this.iService.retrieveInvoice(
      this.currentUser.token,
      this.currentUser.selectedTn.number,
      this.currentUser.accountId,
      currentBillMonth).subscribe((data) => {
        let myBlob = new Blob([data], {
          type: 'application/pdf'
        });
        FileSaver.saveAs(myBlob, currentBillMonth + '.pdf');
        this.isDownloading = false;
      }, (error) => {
        this.isDownloading = false;
        this.hasError = true;
        this.errorMsg = 'Cannot download invoices';
      })
  }

}
