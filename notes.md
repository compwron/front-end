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