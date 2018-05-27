import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

// import { LoginService } from '../../../services/login.service'
import { UserService } from '../../../services/user.service'
import { UserUpdateObject } from '../../../objects/UserInterfaces'

import { firebase } from '../../../utilities/utilities'

@Component({
  selector: 'app-accountbasic',
  templateUrl: './accountbasic.component.html',
  styleUrls: ['./accountbasic.component.scss']
})
export class AccountbasicComponent implements OnInit {
	name: string
	email: string = this.user.user.email
	password: string
	password2: string
	displayName: string = this.user.user.displayName
	profile_pic_url: string
	profile_pic_path: string
	src: string = "http://via.placeholder.com/70x70"
	reauth: boolean = false
	form: object = null
	loading: boolean
	
	onSubmit(form){
		// console.log(form)
		
		const { displayName, email, password } = form

		let userUpdateObject: UserUpdateObject = {}
		if (displayName) userUpdateObject.displayName = displayName
		if (email) userUpdateObject.email = email
		if (password) userUpdateObject.password = password
		
		if (this.profile_pic_url && this.profile_pic_path) userUpdateObject.new = false
		else userUpdateObject.new = true
		
		userUpdateObject.profile_pic = { url: this.profile_pic_url, path: this.profile_pic_path }

		this.loading = true

		this.user.modifyUser(userUpdateObject)
			.subscribe(
				() => console.log("modifying user preferences"),
				e => console.log("error modifying user preferences: ", e),
				() => {
					this.loading = false
					console.log("finished modifying user preferences")
				}
			)

	}
	
	reauthenticate (form: NgForm): void {
		// console.log(form.value)
		
		
		if (form.value.email !== this.email || form.value.password) {
			// console.log("You must re-authenticate before changing your email or password")
			this.reauth = true
			this.form = form.value
			
			// firebase.auth().onAuthStateChanged(
			// 	(user: firebase.User) => {
			// 		if (user) {
			// 			this.reauth = false
			// 			this.onSubmit(form)
			// 		}
			// 	},
			// 	e => console.log("error reauthenticating", e),
			// 	() => console.log("reauthentication complete")
			// )
		}
		else this.onSubmit(form.value)
	}
	
	reauthReturned (status) {
		if (status) {
			this.reauth = false
			this.onSubmit(this.form)
			this.form = null
		}
		else console.log("reauth failed")
	}
	
	constructor(
		private user: UserService
	) { }
	
	ngOnInit() {
		// this is broken right now because it tries to get a user before the user exists on the UserService component
		this.src = this.user.user && this.user.user.profile_pic ? this.user.user.profile_pic.url : "http://via.placeholder.com/70x70"
		// this.displayName = this.user.user.displayName
		// this.email = this.user.user.email
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
