import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { Router, RouterModule, Routes } from '@angular/router'

// Layout
import {FooterComponent} from "./layout/footer.component"
import {NavComponent} from "./layout/nav.component"

//style guide
import { ButtonsComponent } from './sg/buttons/buttons.component'
import { FormsComponent } from './sg/forms/forms.component'


// main components
import { AccountbasicComponent } from './components/account-setting/accountbasic/accountbasic.component'
import { AccountnotificationComponent } from './components/account-setting/accountnotification/accountnotification.component'
import { AccountdonationsComponent } from './components/account-setting/accountdonations/accountdonations.component'
import { AppComponent } from './app.component'
import { AppcontentsComponent } from './table-of-contents/appcontents/appcontents.component'
import { ArticleComponent } from './components/community-resources/article/article.component'
import { AuthorWidgetComponent } from './components/author-widget/author-widget.component'
import { CampaignBriefComponent } from './components/pub-camps/campaign-brief/campaign-brief.component'
import { CampaignsComponent } from './components/pub-camps/campaigns/campaigns.component'
import { CategoryComponent } from './components/category/category.component'
import { FaqComponent } from './components/faq/faq/faq.component'
import { FeatureWidgetComponent } from './components/feature-widget/feature-widget.component'
import { IndivCampComponent } from './components/pub-camps/indiv-camp/indiv-camp.component'
import { LoginComponent } from './components/authorization/login/login.component'
import { MycampaddComponent } from './components/my-camps/mycampadd/mycampadd.component'
import { MycampaignsComponent } from './components/my-camps/mycampaigns/mycampaigns.component'
import { MycampeditComponent } from './components/my-camps/mycampedit/mycampedit.component'
import { MyindivcampComponent } from './components/my-camps/myindivcamp/myindivcamp.component'
import { MyProfileComponent } from './components/my-profile/my-profile.component'
import { PaymentDeetsComponent } from './components/account-setting/payment-deets/payment-deets.component'
import { PaymentWidgetComponent } from './components/payment-widget/payment-widget.component'
import { ResourcesComponent } from './components/community-resources/resources/resources.component'
import { SignupComponent } from './components/authorization/signup/signup.component'
import { WepayPaymentSuccessfulComponent } from './components/wepay-payment-successful/wepay-payment-successful.component'
import { WepayRegisterComponent } from './components/wepay-register/wepay-register.component'


// services
import { CampaignService } from './services/campaign.service'
import { CampaignOneService } from './services/campaign-one.service'
import { LoginService } from './services/login.service'
import { ResourcesService } from './services/resources.service'
import { UserService } from './services/user.service'
import { WepayService } from './services/wepay.service'
import { StorageBucketService } from './services/storage-bucket.service'

// pipes
import { AgoPipe } from './filters/ago.pipe'
import { FlexibleListPipe } from './filters/flexible-list.pipe'

// guards
import { AuthGuard } from './auth.guard'
import { ConfirmedGuard } from './confirmed.guard'
import { ResourceCardComponent } from './components/community-resources/resource-card/resource-card.component'
import { ResourceService } from './services/resource.service'
import { CampaignCreatorService } from './services/campaign-creator.service'
import { TestingComponent } from './components/testing/testing.component'
import { StorageUploaderDropzoneComponent } from './components/storage-uploader-dropzone/storage-uploader-dropzone.component'
import { MycampBriefComponent } from './components/my-camps/mycamp-brief/mycamp-brief.component'
import { LandingComponent } from './components/landing/landing.component';
import { ConfirmComponent } from './components/confirm/confirm.component'




const appRoutes: Routes = [
  {path:'sg/buttons', component:ButtonsComponent},
  {path:'sg/forms', component:FormsComponent},
  
  //{path:'', component:CampaignsComponent},
  {path:'campaigns', component:CampaignsComponent},
  {path:'', redirectTo: "/campaigns", pathMatch: "full"},
  {path:'campaigns/:id', component:IndivCampComponent},										// pretty sure this needs to be nested
  {path:'faq', component:FaqComponent},
  {path:'feature-widget', component:FeatureWidgetComponent},
  {path:'login', component:LoginComponent},
  {path:'payment_successful', component:WepayPaymentSuccessfulComponent},
  {path:'redirect', component:WepayRegisterComponent},
  {path:'resources', component:ResourcesComponent},
  {path:'resources/:id', component:ArticleComponent},
  {path:'signup', component:SignupComponent},
  {path:'tableofcontents', component:AppcontentsComponent},
  {path:'confirm', component:ConfirmComponent},
  
  
  
  // only logged-in users can access the routes below
  //{path:'testing', component:TestingComponent, canActivate:[AuthGuard]},
  
  {path:'landing', component:LandingComponent, canActivate:[AuthGuard]},
  {path:'account', component:MyProfileComponent, canActivate:[AuthGuard]},
  {path:'mycampaigns', component:MycampaignsComponent, canActivate:[ConfirmedGuard]},
  {path:'mycampaigns/add', component:MycampaddComponent, canActivate:[ConfirmedGuard]},		//pretty sure this needs to be nested
  {path:'mycampaigns/:id', component:MyindivcampComponent, canActivate:[ConfirmedGuard]},		//pretty sure this needs to be nested
  //{path:'mycampaigns/:id/edit', component:MycampeditComponent, canActivate:[AuthGuard]}	//pretty sure this needs to be nested
  {path:'mycampaigns/:id/edit', component:MycampaddComponent, canActivate:[ConfirmedGuard]}	//pretty sure this needs to be nested
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
    ResourceCardComponent,
    TestingComponent,
    StorageUploaderDropzoneComponent,
    MycampBriefComponent,
    FlexibleListPipe,
    LandingComponent,
    ConfirmComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
	CampaignService,
	CampaignOneService,
	LoginService,
	ResourcesService,
	UserService,
	WepayService,
	AuthGuard,
	ConfirmedGuard,
	ResourceService,
	CampaignCreatorService,
	StorageBucketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
	// constructor (
	// 	private router: Router
	// ) {
	// 	console.log('Routes: ', JSON.stringify(router.config, undefined, 2))
	// }
	

}
