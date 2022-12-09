import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignUpPost } from '../@models/signup.model';
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
export class SignUpService {
  public backEndUrl = 'http://localhost:3000/signup';
  constructor(private http: HttpClient) { };

  signUp(data: any):Observable<any>{


    return this.http.post( this.backEndUrl, data,httpOptions);
  }
}
