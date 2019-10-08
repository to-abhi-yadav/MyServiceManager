import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmptyObjectService {

  constructor() { }

  isEmptyObject(obj) {
    for(var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }

}
