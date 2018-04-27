import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FormsModule } from '@angular/forms'

// Layout
import {FooterComponent} from "./layout/footer.component"
import {NavComponent} from "./layout/nav.component"

//style guide
import { ButtonsComponent } from './sg/buttons/buttons.component'
import { FormsComponent } from './sg/forms/forms.component'

import { AppComponent } from './app.component'

import { CampaignsComponent } from './components/pub-camps/campaigns/campaigns.component'


import { IndivCampComponent } from './components/pub-camps/indiv-camp/indiv-camp.component'
import { MycampaignsComponent } from './components/my-camps/mycampaigns/mycampaigns.component'
import { MyindivcampComponent } from './components/my-camps/myindivcamp/myindivcamp.component'
import { MycampeditComponent } from './components/my-camps/mycampedit/mycampedit.component'
import { MycampaddComponent } from './components/my-camps/mycampadd/mycampadd.component'
import { AccountbasicComponent } from './components/account-setting/accountbasic/accountbasic.component'
import { AccountnotificationComponent } from './components/account-setting/accountnotification/accountnotification.component'
import { AccountdonationsComponent } from './components/account-setting/accountdonations/accountdonations.component'
import { PaymentDeetsComponent } from './components/account-setting/payment-deets/payment-deets.component'
import { SignupComponent } from './components/authorization/signup/signup.component'
import { LoginComponent } from './components/authorization/login/login.component'
import { ResourcesComponent } from './components/community-resources/resources/resources.component'
import { ArticleComponent } from './components/community-resources/article/article.component'
import { FaqComponent } from './components/faq/faq/faq.component'
import { AppcontentsComponent } from './table-of-contents/appcontents/appcontents.component'
import { FeatureWidgetComponent } from './components/feature-widget/feature-widget.component'
import { AuthorWidgetComponent } from './components/author-widget/author-widget.component'
import { PaymentWidgetComponent } from './components/payment-widget/payment-widget.component'
import { CategoryComponent } from './components/category/category.component'
import { MyProfileComponent } from './components/my-profile/my-profile.component'
import { CampaignBriefComponent } from './components/pub-camps/campaign-brief/campaign-brief.component'


import { WepayRegisterComponent } from './components/wepay-register/wepay-register.component'

import { CampaignService } from './services/campaign.service'
import { CampaignOneService } from './services/campaign-one.service'
import { LoginService } from './services/login.service';
import { WepayService } from './services/wepay.service';
import { AgoPipe } from './filters/ago.pipe';

import { AuthGuard } from './auth.guard';
import { WepayPaymentSuccessfulComponent } from './components/wepay-payment-successful/wepay-payment-successful.component';


const appRoutes: Routes = [
  {path:'sg/buttons', component:ButtonsComponent},
  {path:'sg/forms', component:FormsComponent},
  {path:'campaigns', component:CampaignsComponent},
  {path:'campaigns/:id', component:IndivCampComponent},										// pretty sure this needs to be nested
  {path:'signup', component:SignupComponent},
  {path:'login', component:LoginComponent},
  {path:'redirect', component:WepayRegisterComponent},
  {path:'resources', component:ResourcesComponent},
  {path:'resources/:id', component:ArticleComponent},
  {path:'faq', component:FaqComponent},
  {path:'feature-widget', component:FeatureWidgetComponent},
  {path:'tableofcontents', component:AppcontentsComponent},
  {path:'payment_successful', component:WepayPaymentSuccessfulComponent},
  // only logged-in users can access the routes below
  {path:'mycampaigns', component:MycampaignsComponent, canActivate:[AuthGuard]},
  {path:'mycampaigns/:id', component:MyindivcampComponent, canActivate:[AuthGuard]},		//pretty sure this needs to be nested
  {path:'mycampaigns/:id/edit', component:MycampeditComponent, canActivate:[AuthGuard]},	//pretty sure this needs to be nested
  {path:'mycampaigns/:id/add', component:MycampaddComponent, canActivate:[AuthGuard]},		//pretty sure this needs to be nested
  {path:'account', component:MyProfileComponent, canActivate:[AuthGuard]}
]

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ButtonsComponent,
    FooterComponent,
    FormsComponent,
    CampaignsComponent,
    CampaignBriefComponent,
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
    PaymentDeetsComponent,
    CampaignBriefComponent,
    WepayRegisterComponent,
    AgoPipe,
    WepayPaymentSuccessfulComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
	CampaignService,
	CampaignOneService,
	LoginService,
	WepayService,
	AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
