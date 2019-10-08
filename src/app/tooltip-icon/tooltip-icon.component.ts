import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip-icon',
  templateUrl: './tooltip-icon.component.html',
  styleUrls: ['./tooltip-icon.component.scss']
})
export class TooltipIconComponent implements OnInit {
  @Input() tooltipText: string

  constructor() { }

  ngOnInit() {
  }

}
