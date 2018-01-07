import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Layout
import {FooterComponent} from "./layout/footer.component";
import {NavComponent} from "./layout/nav.component";


import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
