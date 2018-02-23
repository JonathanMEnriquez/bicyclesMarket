import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {

  constructor(private _http: HttpClient) { }

  addUser(newUser) {
    console.log('add user');
    return this._http.post('/api/users', newUser);
  }

  loginUser(user) {
    console.log('login user');
    return this._http.post('/api/login', user);
  }
}
