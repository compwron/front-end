import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-payment-deets',
  templateUrl: './payment-deets.component.html',
  styleUrls: ['./payment-deets.component.scss']
})
export class PaymentDeetsComponent implements OnInit {
  fund:string;
  transfer:string;

  onSubmit(form: NgForm) {
    console.log(form.value)
  }

  constructor() { }

  ngOnInit() {
  }

}
