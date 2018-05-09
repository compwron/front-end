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

	// this is part of the login problem; the user will hit this before firebase has initialized; need to get it to wait for initialization or something
	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		if (!this.login.loggedIn()) {
			this.router.navigateByUrl('/login')
			return false
		}
			
		return true
	}
	
	
}
