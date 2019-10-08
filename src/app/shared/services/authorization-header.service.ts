
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service'
import { Router } from '@angular/router'
import { Injectable } from '@angular/core'
import { HttpClient, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http'


@Injectable()
export class AuthorizationHeaderService implements HttpInterceptor {

  constructor(
    private router: Router,
    private storage: LocalStorageService
  ) { }



  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const blackListedRoutes = [
    'login',
    'signup',
    'admin/user-registration',
    'dashboard'
    ]
    
    const token = this.storage.getItem('bigRiverAccessToken')

      let found = false;

      for (let i = 0; i < blackListedRoutes.length; i ++) {
          if (blackListedRoutes[i] === req['url']) {
              found = true;
              break;
          }
      }
      if (token && found === false) {
        const authReq = req.clone({ setHeaders: {'token': token }});
        return next.handle(authReq)
  
      } else {
        return next.handle(req)
      }

  }
}
