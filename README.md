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
| createAppointment()              | create | post | /api/v1/boards                           |
| findFirstAppointmentByCoachId()  | read   | get  | /api/boards/:boardId                     |
| findFirstAppointmentByAttendee() | read   | get  | /api/boards/:boardId                     |
| findAllAppointmentByCoachId()    | read   | get  | /api/boards/:boardId/delete              |
| findAllAppointmentByAttendee()   | create | post | /api/boards/:boardId/lists               |
| deleteAppointmentById()          | delete | post | /api/boards/:boardId/lists/:listId/cards |

##### Coaches/Mentees

| action                           | CRUD   | verb | path                                     |
| -------------------------------- | ------ | ---- | ---------------------------------------- |
| createUser()                     | create | post | /api/lists/:listId                       |
| findUserByLgId()                 | read   | get  | /api/lists/:listId/delete                |
| updateUserByLgId()               | update | post | /api/cards/:cardId                       |
| deleteUserByLgId()               | delete | post | /api/cards/:cardId/delete                |
