# coach-que
Scheduling/feedback service for Coaches/Mentees

#### Get started
Install dependencies and set up database:
```
./go
```

#### Migrate the Database
```
./go migrate_db development
./go migrate_db test
```

####Testing
```
./go test
```

#### Instal nvm
Some dependencies of this project require node v5.6.0. We recommend using nvm to switch between different versions of node:
```
$ brew install nvm
```
Install node 5.6.0 and switch to it:
```
$ nvm install 5.6.0
$ nvm use 5.6.0
```
To switch back to your system node version:
```
$ nvm use system
```

#### Install IDM
Make sure you are a collaborator on the IDM repo. Upon graduating to level 3, you are automatically sent an invite email.

Clone the [IDM repository](https://github.com/LearnersGuild/idm)

Run the multitudinous setup instructions in the README

### Update JWT Public Key
In coach-que directory, open config/development.json. Replace the public key on line 11 with the JWT_PUBLIC_KEY you used in IDM setup: `"JWT_PUBLIC_KEY"=[your public key]`

### Running the project
Three servers must be running for this to work. First, Navigate to the directory of your IDM installation.

Start IDM server:
```
$ npm start
```
Open another terminal window and run mehserve:
```
$ mehserve run
```
And finally, open a third terminal window in the coach-que root directory and run:
```
$ ./go start
```

### Architecture

- Node
- Express
- Webpack
- Babel es2016
- SQL via Knex
- React

### Persistence

We're using `knex` to generate our SQL

#### HTTP API

##### Appointments

| action                           | verb | path                       |
| -------------------------------- | ---- | -------------------------- |
| Get Coach Appt List              | get  | /api/v1/appointments/coach-schedule      |
| Get Mentee Appt List             | get  | /api/v1/appointments/mentee-schedule      |
| Schedule Next Available Appt | post | /calendar/find-next     |
| findAllAppointmentByCoachId()    | get  | /api/v1/appointments/      |
| findAllAppointmentByAttendee()   | get  | /api/v1/appointments/      |
| deleteAppointmentById()          | post | /api/v1/appointments/      |

##### Coaches/Mentees

| action                           | CRUD   | verb | path                       | echo call (if applicable) |
| -------------------------------- | ------ | ---- | -------------------------- | ------------------------- |
| createUser()                     | create | post | /api/v1/coaches/           | /coach init               |
| getActiveCoaches()               | read   | get  | /api/v1/coaches/           | /coach                    |
| updateUserByLgId()               | update | post | /api/v1/coaches/           |                           |
| activateCoach()                  | update | post | /api/v1/coaches/           | /coach activate           |
| deactivateCoach()                | update | post | /api/v1/coaches/           | /coach deactivate         |
| deleteUserByLgId()               | delete | post | /api/v1/coaches/           |                           |

##### Analytics

| action                           | verb | path                       |
| -------------------------------- | ---- | -------------------------- |
| Get Analytics List               | get  | /api/v1/analytics          |                    
