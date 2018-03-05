import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-accountbasic',
  templateUrl: './accountbasic.component.html',
  styleUrls: ['./accountbasic.component.scss']
})
export class AccountbasicComponent implements OnInit {
  name:string;
  email:string;
  password:string;
  password2:string;

  onSubmit(form: NgForm){
    console.log(form.value)
  }

  constructor() { }

  ngOnInit() {
  }

}
