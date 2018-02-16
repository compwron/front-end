import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mycampedit',
  templateUrl: './mycampedit.component.html',
  styleUrls: ['./mycampedit.component.scss']
})
export class MycampeditComponent implements OnInit {
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

  onEditCamp(form: NgForm) {
    console.log(form.value)
  }

  constructor() { }

  ngOnInit() {
  }

}
