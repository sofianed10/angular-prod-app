import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

   save(user: User, jwt: string): Observable<User|null> {
    const url = 
     `${environment.firebase.firestore.baseURL}/users?key=
      ${environment.firebase.apiKey}`;
   
    const data = this.getDataForFirestore(user);
    const httpOptions = {
     headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${jwt}`
     })
    };
    console.log("JWT ID :"+jwt);
    return this.http.post(url, data, httpOptions).pipe(
     switchMap((data: any) => {
      return of(this.getUserFromFirestore(data.fields));
     })
    );
   }
   get(userId: string, jwt: string): Observable<User|null> {
    const url =
     `${environment.firebase.firestore.baseURL}:runQuery?key=
      ${environment.firebase.apiKey}`;
    const data = this.getSructuredQuery(userId);
    const httpOptions = {
     headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${jwt}`
     })
    };
    
    return this.http.post(url, data, httpOptions).pipe(
     switchMap((data: any) => {
      return of(this.getUserFromFirestore(data[0].document.fields));
     })
    );
   }
   private getSructuredQuery(userId: string): Object {
    return {
     'structuredQuery': {
      'from': [{
       'collectionId': 'users'
      }],
      'where': {
       'fieldFilter': {
        'field': { 'fieldPath': 'id' },
        'op': 'EQUAL',
        'value': { 'stringValue': userId }
       }
      },
      'limit': 1
     }
    };
   }
   private getUserFromFirestore(fields): User {
    return new User({
     id: fields.id.stringValue,
     email: fields.email.stringValue,
     pomodoroDuration: fields.pomodoroDuration.integerValue,
     name: fields.name.stringValue,
     avatar: fields.avatar.stringValue
    });
   }
   private getDataForFirestore(user: User): Object {
    return {
     fields: {
      id: { stringValue: user.id },
      email: { stringValue: user.email },
      name: { stringValue: user.name },
      avatar: { stringValue: user.avatar },
      pomodoroDuration: { integerValue: user.pomodoroDuration }
     }
    };
   }
   update(user: User): Observable<User|null> {
    const url = `${environment.firebase.firestore.baseURL}/users/${user.id}?key=${environment.firebase.apiKey}`;
 const data = this.getDataForFirestore(user);

     
    const httpOptions = {
     headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
     })
    };
    
    return this.http.patch(url, data, httpOptions).pipe(
     switchMap((data: any) => {
      return of(this.getUserFromFirestore(data.fields));
     })
    );
   }
}
