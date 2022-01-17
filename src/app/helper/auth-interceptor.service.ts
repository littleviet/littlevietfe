import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { exhaustMap, map, take } from "rxjs/operators";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // const token = localStorage.getItem('token');
    // if (!token) {
    //   return next.handle(req);
    // }
    const modifiedReq = req.clone({
      headers: req.headers.append('Authorization', 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImI4NmY1MmJjLTM3MGMtNDg2Zi04NjVhLTk0ZTRjNDJhNTExOCIsInJvbGUiOiJBRE1JTiIsIm5iZiI6MTY0MjE2NzQ2NSwiZXhwIjoxNjQyNzcyMjY1LCJpYXQiOjE2NDIxNjc0NjV9.oCTdsvY8PPU9UM57SWWby4IVXfCHcPcg10aPDNGedq4')
    });
    return next.handle(modifiedReq);
  }
}
