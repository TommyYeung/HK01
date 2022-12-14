import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginPost } from '../@models/login.model';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  })
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public backEndUrl = 'http://localhost:3000/login';
  constructor(private http: HttpClient) { };

  jwtLogin(formGroup:any):Observable<any>{

    return this.http.post<{token: string}>(this.backEndUrl, {formGroup},httpOptions)
    .pipe(
      map(result => {
        localStorage.setItem('jwt', result.token);
        return result;
      })
  );
}

logout() {
localStorage.removeItem('jwt');
}

public get loggedIn(): any {
  return (localStorage.getItem('jwt') == "dvcioljwefiosdfjweiofslkdgfjoiejfweiofjiojfsiodvjoiwefohisf");
  }
}
