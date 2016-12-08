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
npm run migrate:latest
```

####Testing
Make sure to write your tests as you write your code. Passing tests for new code required for PR acceptance.
```
npm test
```
