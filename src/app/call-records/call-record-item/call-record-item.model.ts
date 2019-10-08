export class CallRecordItem {
    constructor(
      public callDateTime: string, 
      public callAmount: string, 
      public callDuration: string, 
      public callType: string, 
      public calledFrom: string,
      public calledTo: string){
    }
  }
  