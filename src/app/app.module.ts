import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes } from '@angular/router';


// Layout
import {FooterComponent} from "./layout/footer.component";
import {NavComponent} from "./layout/nav.component";

//style guide
import { ButtonsComponent } from './sg/buttons/buttons.component';
import { FormsComponent } from './sg/forms/forms.component';


import { AppComponent } from './app.component';
import { CampaignsComponent } from './components/pub-camps/campaigns/campaigns.component';
import { IndivCampComponent } from './components/pub-camps/indiv-camp/indiv-camp.component';
import { MycampaignsComponent } from './components/my-camps/mycampaigns/mycampaigns.component';
import { MyindivcampComponent } from './components/my-camps/myindivcamp/myindivcamp.component';
import { MycampeditComponent } from './components/my-camps/mycampedit/mycampedit.component';
import { MycampaddComponent } from './components/my-camps/mycampadd/mycampadd.component';
import { AccountbasicComponent } from './components/account-setting/accountbasic/accountbasic.component';
import { AccountnotificationComponent } from './components/account-setting/accountnotification/accountnotification.component';
import { AccountdonationsComponent } from './components/account-setting/accountdonations/accountdonations.component';
import { PaymentDeetsComponent } from './components/account-setting/payment-deets/payment-deets.component';
import { SignupComponent } from './components/authorization/signup/signup.component';
import { LoginComponent } from './components/authorization/login/login.component';
import { ResourcesComponent } from './components/community-resources/resources/resources.component';
import { ArticleComponent } from './components/community-resources/article/article.component';
import { FaqComponent } from './components/faq/faq/faq.component';
import { AppcontentsComponent } from './table-of-contents/appcontents/appcontents.component';
import { FeatureWidgetComponent } from './components/feature-widget/feature-widget.component';
import { AuthorWidgetComponent } from './components/author-widget/author-widget.component';
import { PaymentWidgetComponent } from './components/payment-widget/payment-widget.component';
import { CategoryComponent } from './components/category/category.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';


const appRoutes: Routes = [
  {path:'sg/buttons', component:ButtonsComponent},
  {path:'sg/forms', component:FormsComponent},
  {path:'campaigns', component:CampaignsComponent},
  {path:'campaigns/:id', component:IndivCampComponent},// pretty sure this needs to be nested
  {path:'mycampaigns', component:MycampaignsComponent},
  {path:'mycampaigns/:id', component:MyindivcampComponent},//pretty sure this needs to be nested
  {path:'mycampaigns/:id/edit', component:MycampeditComponent},//pretty sure this needs to be nested
  {path:'mycampaigns/:id/add', component:MycampaddComponent},//pretty sure this needs to be nested
  {path:'signup', component:SignupComponent},
  {path:'login', component:LoginComponent},
  {path:'resources', component:ResourcesComponent},
  {path:'resources/:id', component:ArticleComponent},
  {path:'faq', component:FaqComponent},
  {path:'feature-widget', component:FeatureWidgetComponent},
  {path:'tableofcontents', component:AppcontentsComponent},
  {path:'account', component:MyProfileComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ButtonsComponent,
    FooterComponent,
    FormsComponent,
    CampaignsComponent,
    IndivCampComponent,
    MycampaignsComponent,
    MyindivcampComponent,
    MycampeditComponent,
    MycampaddComponent,
    AccountbasicComponent,
    AccountnotificationComponent,
    AccountdonationsComponent,
    SignupComponent,
    LoginComponent,
    ResourcesComponent,
    ArticleComponent,
    FaqComponent,
    AppcontentsComponent,
    FeatureWidgetComponent,
    AuthorWidgetComponent,
    PaymentWidgetComponent,
    CategoryComponent,
    MyProfileComponent,
    PaymentDeetsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
