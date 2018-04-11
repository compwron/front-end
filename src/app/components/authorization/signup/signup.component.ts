import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { LoginService } from '../../../services/login.service'


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  name:string;
  email:string;
  password:string;

  onSignUp(form:NgForm) {
    // console.log(form.value)
    let { name, email, password } = form.value
    
  }
  constructor() { }

  ngOnInit() {
  }

}
