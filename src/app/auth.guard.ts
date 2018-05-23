import { Injectable } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable } from 'rxjs/Observable'

import { Router } from '@angular/router'
import { LoginService } from './services/login.service'


import { first } from 'rxjs/operators'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor (
		private login: LoginService,
		private router: Router
	) {}


	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		// canActivate takes an Observable<boolean> as one of its return values; if firebase has not initialized yet, return an observable
			// this setup works but there is some problem using the auth statusUpdater() functions that I cannot figure out
		return new Observable(observer => {
			if (this.login.loading) {
				console.log("auth is loading; setting interval")
				const unsubscribe = setInterval(() => {
					if (!this.login.loading) {
						clearInterval(unsubscribe)
						observer.next(this.login.loggedIn())
					}
				}, 1000)
			}
			else { observer.next(this.login.loggedIn()) }

		})

	}
	
	
}



			// this.login.statusUpdater().pipe(first())
			// 	.subscribe(
			// 		s => { observer.next(!!s) },
			// 		e => console.log("error in auth guard", e),
			// 		() => console.log("auth guard completed")
					
			// 	)

			