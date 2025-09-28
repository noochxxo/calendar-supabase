Ran into an issue with my tyoes being to strict, cost me time trying to debug.
I hadn't worked with .ics formats before I wasn't sure what was needed to jammed abunch of it into the form.

What works:
- API routes
  - /calendars      Get all the users calendars
  - /events         Get all the users events
  - /events/[id]    Get a specific event
  Can be used to get data to the mobile app

- Authentication
  - sign in
  - sign up
  A default calendar is created for the user

- seed the database
- change months on the calendar
- click to see events on specific das


TODO:
  - create eventsin browser, theres an error at the moment
  - Fix ugly ui
  - get list of users calendars
  - create new calendars
  - add social auths to sinc with external calendars
  - add search
  - edit and delete events
  - send event invites
  - fix load on signin, a refresh is needed to have updated UI

The database was working,
theres an issue with getting events by users id

account with events
  emain: test@test.com
  password: test1234

Submission isn't complete