<!--beta launch requirements-->
https://docs.google.com/document/d/14GSrIhek8VjVhXejC4mHVUTZq6YB9tMkr45gP8hDlp0/edit

<!--information about how to get data out of firebase-->
https://docs.google.com/document/d/1ezeCnXyEC1MTb3ykAafLGpe0Sd1M3WFUEHb1DEy2g5M/edit#

<!--shows how to compile typescript on the fly so that cloud functions emulator loads it-->
https://firebase.googleblog.com/2018/01/streamline-typescript-development-cloud-functions.html

<!--when debugging functions, use the typescript converter to compile TS to JS-->
https://firebase.googleblog.com/2018/01/streamline-typescript-development-cloud-functions.html

Downloads/projects/pridepocket/functions/node_modules/.bin/tsc --watch


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


**loginService bugs**
When I log in with a user, it saves that user’s login, so that the next time the user comes to the site,
	firebase retrieves their info; that info is not stored in this.pridepocketUser on the loginService,
	so the nav.html errors when it tries to display loginService.pridepocketUser.email

when you press the login button on the nav bar, it automatically redirects you to the login page, even if you are logged into firebase.
	the nav bar does not automatically switch to showing you as logged in if you are logged in though; you have to press the login button
	need to either fix the 'not showing logged in' problem or have the link to /login be conditional;
		so that the nav bar changes to 'logged in' if you are logged in, and does not send you to the /login page
		
I think that the bug where the wepay.service can't find a pridepocketUser on redirect and the above 'nav bar bug' are the same bug;
	hit the database to get the pridepocket user whenever the page loads