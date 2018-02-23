import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login-reg',
  templateUrl: './login-reg.component.html',
  styleUrls: ['./login-reg.component.css']
})
export class LoginRegComponent implements OnInit {

  constructor(private _apiService: ApiService) { }

  errors: String[] = [];

  passwordError:String;

  user:any = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: ""
  }

  newUser:any = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: ""
  }

  ngOnInit() {
  }

  clearField(event){
    this.user.name = ""
    this.user.email = ""
    this.user.password = ""
    event.preventDefault()
  }

  clear(){
    this.user.name = ""
    this.user.email = ""
    this.user.password = ""
  }

  login() {
    this.errors = [];
    console.log('login');
    let observable = this._apiService.loginUser(this.user);
    observable.subscribe((responseData:any)=>{
      console.log(responseData);
      if (responseData.errors) {
        this.errorHandler(responseData.errors.errors);
      } else if (responseData.message == "Incorrect login info") {
        this.errors.push(responseData.message);
      }
      else {
        this.clear();
      }
    })
  }

  addNewUser() {
    this.errors = [];
    if (this.newUser.password != this.newUser.confirm_password) {
      this.passwordError = "Passwords do not match";
      return;
    }
    console.log('add new user', this.newUser);
    let observable = this._apiService.addUser(this.newUser);
    observable.subscribe((responseData:any)=>{
      console.log(responseData);
      if (responseData.errors) {
        this.errorHandler(responseData.errors.errors);
      } else if (responseData.message == "Incorrect login info") {
        this.errors.push(responseData.message);
      }
      else {
        this.clear();
      }
    })
  }

  errorHandler(errorData) {
    let keys = Object.keys(errorData);
    keys.forEach((key) => {
      let message = errorData[key].message;

      if (errorData[key].properties && errorData[key].properties.message) {
          message = errorData[key].properties.message.replace('`{PATH}`', key);
      }

      message = message.replace('Path ', '').replace(key,'').trim();
      this.errors.push(key + " " + message);
      console.log(this.errors);
    })
  }
}
