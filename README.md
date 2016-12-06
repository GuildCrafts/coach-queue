# coach-que
Service to help with scheduling/feedback for Coaches/Mentees

#### Get started
```
npm start
```

#### Install Postgres

```
brew install postgress
brew tap homebrew/services
brew services start postgresql
```

#### Create and Migrate the Database

```
createdb coach-que-development
createdb coach-que-test
knex migrate:latest
```
