import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { User } from '../users/user';
  import { from } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  user: User
  features : string[] = [];
  billingManagement : Boolean = false;
  callRecords : Boolean = false;
  constructor(
    private storage: LocalStorageService
    ) { }

  ngOnInit() {
    this.user = this.storage.getItem('currentUser')
    this.features = this.user.selectedTn.features;
    for(let i in this.features) {
      if(this.features[i] == "Billing Management") {
        this.billingManagement = true;
      }
      if (this.features[i] == "CDRs") {
        this.callRecords = true;
      }
    }
  }

}
