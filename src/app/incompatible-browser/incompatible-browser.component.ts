import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';

@Component({
  selector: 'app-incompatible-browser',
  templateUrl: './incompatible-browser.component.html',
  styleUrls: ['./incompatible-browser.component.scss']
})

export class IncompatibleBrowserComponent implements OnInit {
  deviceInfo
  browser: string
  browserVersion: string


  constructor(private deviceService: DeviceDetectorService, private router: Router
    ) {
      this.getDeviceInfo()
    }

    ngOnInit() {}
  
    getDeviceInfo() {
      this.deviceInfo = this.deviceService.getDeviceInfo()
      this.browser = this.deviceInfo.browser
      this.browserVersion = this.deviceInfo.browser_version
    }
}
