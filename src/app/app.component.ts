import { Component, Output } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { BrandingService } from './shared/services/branding.service';
import { Branding } from './shared/models/branding';
import { BrandingOptionsService } from './branding/branding-options.service';
import { EventEmitter } from 'events';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bigRiver'
  showMobileNavigation: boolean
  deviceInfo = null

  constructor(private deviceService: DeviceDetectorService, private router: Router
  ) {
    this.getDeviceInfo()
  }

  getDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo()
    const browserVersion = +this.deviceInfo.browser_version
    if (this.deviceInfo.browser === 'IE') {
      this.router.navigate(['/browser-unsupported'])
    } else if (this.deviceInfo.browser === 'Safari') {
      if (browserVersion < 11) {
        this.router.navigate(['/browser-unsupported'])
      }
    } else if (this.deviceInfo.browser === 'Edge') {
      if (browserVersion < 42) {
        this.router.navigate(['/browser-unsupported'])
      }
    }
  }
}
