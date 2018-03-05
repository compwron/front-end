import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email:string;
  password:string;

  onLogin(form: NgForm) {
    console.log(form.value)
  }
  constructor() { }

  ngOnInit() {
  }

}
