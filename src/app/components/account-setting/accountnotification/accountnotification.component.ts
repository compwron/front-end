import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../services/user.service'

@Component({
  selector: 'app-accountnotification',
  templateUrl: './accountnotification.component.html',
  styleUrls: ['./accountnotification.component.scss']
})
export class AccountnotificationComponent implements OnInit {
	articles: boolean = false
	comments: boolean = false
	contributions: boolean = false

	constructor(
		private user: UserService
	) { }

	ngOnInit() {
		if (this.user.user.notification_details) {
			this.articles = this.user.user.notification_details.email_suggested_articles
			this.comments = this.user.user.notification_details.email_on_comment_posted
			this.contributions = this.user.user.notification_details.email_on_contribution_receipt
		}
	}
	
	articlesChange (b) {
		this.articles = b
		console.log("articles", this.articles)
		this.update("articles", b)
	}
	
	commentsChange (b) {
		this.comments = b
		console.log("comments", this.comments)
		this.update("comments", b)
	}

	contributionsChange (b) {
		this.contributions = b
		console.log("contributions", this.contributions)
		this.update("contributions", b)
	}

	update (name, value) {
		this.user.modifyUser({ notification_details: { [name]: value } })
			.subscribe(
				() => console.log("updating notification preference: ", name, value),
				e => console.log(`failed to update notification preferences: ${name} ${value}`, e),
				() => console.log("finished updating notification preference: ", name, value)
			)
	}
}
