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

| action                           | CRUD   | verb | path                                     |
| -------------------------------- | ------ | ---- | ---------------------------------------- |
| createAppointment()              | create | post | /api/v1/appointments/                    |
| findFirstAppointmentByCoachId()  | read   | get  | /api/v1/appointments/                    |
| findFirstAppointmentByAttendee() | read   | get  | /api/v1/appointments/                    |
| findAllAppointmentByCoachId()    | read   | get  | /api/v1/appointments/                    |
| findAllAppointmentByAttendee()   | read   | get  | /api/v1/appointments/                    |
| deleteAppointmentById()          | delete | post | /api/v1/appointments/                    |

##### Coaches/Mentees

| action                           | CRUD   | verb | path                                     |
| -------------------------------- | ------ | ---- | ---------------------------------------- |
| createUser()                     | create | post | /api/v1/coaches/                         |
| findUserByLgId()                 | read   | get  | /api/v1/coaches/                         |
| getActiveCoaches()               | read   | get  | /api/v1/coaches/                         |
| updateUserByLgId()               | update | post | /api/v1/coaches/                         |
| activateCoach()                  | update | post | /api/v1/coaches/                         |
| deactivateCoach()                | update | post | /api/v1/coaches/                         |
| deleteUserByLgId()               | delete | post | /api/v1/coaches/                         |
