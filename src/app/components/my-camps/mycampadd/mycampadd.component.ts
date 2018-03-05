import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-mycampadd',
  templateUrl: './mycampadd.component.html',
  styleUrls: ['./mycampadd.component.scss']
})
export class MycampaddComponent implements OnInit {
  campName:string;
  campType:string = "Campaign Type";
  goal:number;
  noDate:boolean;
  date:string;
  welMessage:string;
  item1:string;
  item2:string;
  item3:string;
  thankYou:string;
  fEmail:string;
  eMessage:string;
  socialShare:boolean;

  onAddCamp(form: NgForm) {
    console.log(form.value)
  }
  constructor() { }

  ngOnInit() {
  }

}
