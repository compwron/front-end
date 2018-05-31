enable anonymous payments...
	* trying without access token
	* who sets the 'payments' field in the database for a user?
		- need to check whether a payer is returned


<!--inotify watches-->
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p


<!--beta launch requirements-->
https://docs.google.com/document/d/14GSrIhek8VjVhXejC4mHVUTZq6YB9tMkr45gP8hDlp0/edit

<!--information about how to get data out of firebase-->
https://docs.google.com/document/d/1ezeCnXyEC1MTb3ykAafLGpe0Sd1M3WFUEHb1DEy2g5M/edit#

<!--shows how to compile typescript on the fly so that cloud functions emulator loads it-->
https://firebase.googleblog.com/2018/01/streamline-typescript-development-cloud-functions.html

<!--when debugging functions, use the typescript converter to compile TS to JS-->
https://firebase.googleblog.com/2018/01/streamline-typescript-development-cloud-functions.html

Downloads/projects/pridepocket/functions/node_modules/.bin/tsc --watch





<!--custom email handler-->
https://firebase.google.com/docs/auth/custom-email-handler


**buglist**
- something in the navbar dropdown menus prevents a full page refresh/component mount and so links to dynamic pages are not working right
	* removed form tags
	* links work outside the former form tags
	* addcampaign link works even though it's inside a former form tag, while links to dyanmic content do not
	* dropdown navigation works when it's positioned outside of this div:
			<div class="form-inline my-2 my-lg-0 mr-sm-2" *ngIf="!!email">
	* there is no call ever initiated to the database in the mycampaigns component
	*





**features**
- db backups: encrypt and compress and store in bucket
	* https://www.npmjs.com/package/firestore-backup-restore
- bug bounty
	* https://hackerone.com/security
- email notifications to users of key things
	* https://github.com/firebase/functions-samples/blob/master/email-confirmation/functions/index.js
	* send notifications to websites/devices with Firebase Cloud Messenging too
		- https://firebase.google.com/docs/functions/firestore-events
- image storage; make the service to put stuff in storage and integrate it with the different components that need to store images


**incomplete**
- profile picture uploader
- 'add anotehr person' for 'Who are you saving for' form on 'accountbasic' component
- "total funds raised" and "funds transferred to bank" on payment details
	* looking for a total amount over the lifetime of the account; not a FORM
	* do this per campaign for now
- change 'setup WePay' to something like 'unlink wepay account' if the user has a wepay account already
- add campaign details to notifications, or at least campaign IDs; still haven't decided how to handle this
- how do you get app categories?
	* do they live on resources?
	* when you get resources for teh resources page, do you only get a limited number?
	* do you try to have lots of categories represented?
	* do you pull down a paginated list of articles within a category when a user selects it?
	* just show articles that fall within the top-10 most common categories on the resources page, but show all the categories
- the featured group is just a set of articles that are in the 'featured' collection, which gets added to and deleted from with a special page?
- login: firebase has to get login info on every page refresh; because the auth script redirects you before you successfully login, you cannot navigate by pasting a link
	* make auth wait until it receives an auth response


**auth flow**
user clicks on the 'register' link, which opens a popup iframe to the auth link;
the auth link grabs the code, exchanges it with the server,
and then saves the credentials/access_token in the DB

when the user clicks on the auth link, it also sets up a watcher on their account in the DB
when the watcher catches the DB insert, the client gets the access_token and uses it to make the account/create call, which sets them up to use the service



Todo
Hooking up all the dead links
Schemas for database stuff
Laura put some of this in slack...
Profile pictures:
Need to hook up storage so that you can upload thumbnails

**changing user info on firebase auth**
https://firebase.google.com/docs/auth/web/manage-users
* This is for changing the user’s displayName/email/password on firebase auth; which we will have to do if the user changes their displayName in the app


** individual campaign timestamps **

fixed the campaigns service to use firestore timestamps correctly; need to do the same for indivdual campaigns

**loginService bugs**

THIS IS MOSTLY RESOLVED
	still want loginService.pridepocketUser working on the wepay.service; check the constructor for a note on this
	

When I log in with a user, it saves that user’s login, so that the next time the user comes to the site,
	firebase retrieves their info; that info is not stored in this.pridepocketUser on the loginService,
	so the nav.html errors when it tries to display loginService.pridepocketUser.email

when you press the login button on the nav bar, it automatically redirects you to the login page, even if you are logged into firebase.
	the nav bar does not automatically switch to showing you as logged in if you are logged in though; you have to press the login button
	need to either fix the 'not showing logged in' problem or have the link to /login be conditional;
		so that the nav bar changes to 'logged in' if you are logged in, and does not send you to the /login page
		
I think that the bug where the wepay.service can't find a pridepocketUser on redirect and the above 'nav bar bug' are the same bug;
	hit the database to get the pridepocket user whenever the page loads
	
** the message you put on your donation can have no spaces **
this is not the expected behavior; you aren't going to post a 40 character word....