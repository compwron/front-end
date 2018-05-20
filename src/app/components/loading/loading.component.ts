import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable'

import { Router } from '@angular/router'
import { LoginService } from '../../services/login.service'


@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
	
	constructor(
		private router: Router,
		private login: LoginService
	) { }
	
	ngOnInit() {
		console.log("in loading component; should not be here")
		
		if (this.login.loading) {
			this.login.wait()
				.subscribe(
					b => this.login.pendingUser.subscribe(
						u => this.router.navigateByUrl(this.login.previous),
						e => console.log("error in the loading page", e)
					),
					e => e => console.log("error in the loading page, wait function: ", e)
				)
		}
		else this.router.navigateByUrl('/login')
	}

}
