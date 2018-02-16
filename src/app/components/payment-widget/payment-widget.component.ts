import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-payment-widget',
  templateUrl: './payment-widget.component.html',
  styleUrls: ['./payment-widget.component.scss']
})
export class PaymentWidgetComponent implements OnInit {
  amount: string;
  name:string;
  message:string;
  private:boolean;

  onDonate(form: NgForm) {
    console.log(form.value)
  }

  constructor() { }

  ngOnInit() {
  }

}
