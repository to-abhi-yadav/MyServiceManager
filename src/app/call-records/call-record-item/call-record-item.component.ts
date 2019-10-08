import { Component, Input, OnInit } from '@angular/core';
import { CallRecordItem } from './call-record-item.model';
import { PhonePipe } from '../../shared/pipes/phone.pipe';

@Component({
  selector: '[app-call-record-item]',
  templateUrl: './call-record-item.component.html',
  styleUrls: ['./call-record-item.component.scss']
})
export class CallRecordItemComponent implements OnInit {
  @Input() callRecordItem: CallRecordItem;
  @Input() expandedView: boolean = false;
  @Input() searchTerm:string = ''
  constructor() { }

  ngOnInit() {
  }

  getDate(value: any): Date {
    // https://github.com/angular/angular/issues/12334
    return value ? new Date(value.replace(/\s/g, 'T')) : undefined;
  }


}
