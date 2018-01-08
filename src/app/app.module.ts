import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router'

// Layout
import {FooterComponent} from "./layout/footer.component";
import {NavComponent} from "./layout/nav.component";
import { ButtonsComponent } from './sg/buttons/buttons.component';


import { AppComponent } from './app.component';

const appRoutes: Routes = [
  {path:'sg/buttons', component:ButtonsComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ButtonsComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
