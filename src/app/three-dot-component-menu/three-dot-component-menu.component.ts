import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-three-dot-component-menu',
  templateUrl: './three-dot-component-menu.component.html',
  styleUrls: ['./three-dot-component-menu.component.scss']
})
export class ThreeDotComponentMenuComponent implements OnInit {
  @Input() component
  @ViewChild("menuDrop") menuDrop
  constructor(
    private dashService: DashboardService
  ) { 

  }

  ngOnInit() {
  }

  removeComponent(component) {
    this.dashService.removeComponentFromDashboard(component)
  }

}
