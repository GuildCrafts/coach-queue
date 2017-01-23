# coach-que
Service to help with scheduling/feedback for Coaches/Mentees

#### Get started
This installs all dependencies in the project, and sets up the db
```
./go
```

#### Migrate the Database

```
./go migrate_db [development|test]
```

####Testing
Make sure to write your tests as you write your code. Passing tests for new code required for PR acceptance.
```
./go test
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
