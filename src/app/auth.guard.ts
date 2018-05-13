import { Injectable } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable } from 'rxjs/Observable'

import { Router } from '@angular/router'
import { LoginService } from './services/login.service'


@Injectable()
export class AuthGuard implements CanActivate {
	constructor (
		private login: LoginService,
		private router: Router
	) {}


	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		if (this.login.loading) {
			// canActivate takes an Observable<boolean> as one of its return values; if firebase has not initialized yet, return an observable
			return new Observable(observer => {
				this.login.wait()
					.subscribe(
						b => {
							if (b) { observer.next(true) }
							else {
								this.router.navigateByUrl('/login')
								observer.next(false)
							}
						},
						e => {
							this.router.navigateByUrl('/login')
							observer.error(e)
						},
						() => observer.complete()
					)
			})
		}
		
		// firebase is initialized, user is not logged in, redirect to the /login route
		else if (!this.login.loggedIn()) {
			console.log("login happened before this load; user is not logged in: ", this.login.loggedIn())
			this.router.navigateByUrl('/login')
			return false
		}
		
		// firebase is initialized, user is logged in, grant them access
		else {
			console.log("login happened before this load; user is logged in: ", this.login.loggedIn())
			return true
		}

	}
	
	
}
