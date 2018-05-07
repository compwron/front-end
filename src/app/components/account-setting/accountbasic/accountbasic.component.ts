import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserService } from '../../../services/user.service'
import { UserUpdateObject } from '../../../objects/UserInterfaces'

@Component({
  selector: 'app-accountbasic',
  templateUrl: './accountbasic.component.html',
  styleUrls: ['./accountbasic.component.scss']
})
export class AccountbasicComponent implements OnInit {
	name: string
	email: string
	password: string
	password2: string
	displayName: string
	
	onSubmit(form: NgForm){
		console.log(form.value)
		const { displayName, email, password } = form.value

		let userUpdateObject: UserUpdateObject = {}
		if (displayName) userUpdateObject.displayName = displayName
		if (email) userUpdateObject.email = email
		if (password) userUpdateObject.password = password

		this.user.modifyUser(userUpdateObject)
			.subscribe(
				() => console.log("modifying user preferences"),
				e => console.log("error modifying user preferences: ", e),
				() => console.log("finished modifying user preferences")
			)

	}
	
	constructor(
		private user: UserService
	) { }
	
	ngOnInit() {
	}
	
	deactivate () {
		this.user.deactivate()
			.subscribe(
				() => console.log("deactivating user account: ", this.user.user.uid),
				e => console.log(`error while attempting to deactivate user ${this.user.user.uid}: `, e),
				() => console.log("successfully deactivated user")
			)
	}
}
