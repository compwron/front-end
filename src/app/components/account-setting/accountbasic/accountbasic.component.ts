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
	profile_pic_url: string
	profile_pic_path: string
	src: string = "http://via.placeholder.com/70x70"
	
	onSubmit(form: NgForm){
		console.log(form.value)
		const { displayName, email, password } = form.value

		let userUpdateObject: UserUpdateObject = {}
		if (displayName) userUpdateObject.displayName = displayName
		if (email) userUpdateObject.email = email
		if (password) userUpdateObject.password = password
		
		if (this.profile_pic_url && this.profile_pic_path) userUpdateObject.new = false
		else userUpdateObject.new = true
		
		userUpdateObject.profile_pic = { url: this.profile_pic_url, path: this.profile_pic_path }

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
		// this is broken right now because it tries to get a user before the user exists on the UserService component
		this.src = this.user.user && this.user.user.profile_pic ? this.user.user.profile_pic.url : "http://via.placeholder.com/70x70"
	}
	
	saveProfilePic ({ url, fullPath }): void {
		this.profile_pic_url = url
		this.profile_pic_path = fullPath

		this.src = url
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
