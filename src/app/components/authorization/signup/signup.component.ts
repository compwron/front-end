import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { LoginService } from '../../../services/login.service'


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  displayName:string;
  email:string;
  password:string;

  constructor(
  	private loginService: LoginService
  ) { }

  onSignUp(form:NgForm) {
    let { displayName, email, password } = form.value
    this.loginService.emailSignup(email, password, displayName)
  }

  ngOnInit() {
  }

}
