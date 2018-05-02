import { Injectable } from '@angular/core'

import { Router } from '@angular/router'

import { fromPromise } from 'rxjs/observable/fromPromise'
import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'

import { Campaign } from '../objects/Campaign'

import { firebase, db } from '../utilities/utilities'

@Injectable()
export class AddcampaignService {

  constructor(
    private router: Router
   ) { }

   pridepocketCampaign: Campaign

   makeCampaign(campaign): void {
    db.collection("campaigns").doc().set(campaign)
      .then(() => console.log("it works"))
      .catch(e => console.log("error while creating a new campaign in the database", e))
  }
}