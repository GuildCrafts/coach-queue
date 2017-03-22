# coachQ

### Installation

**Install dependencies**

`npm i`

### Setup environment

#### Check that your shell's `NODE_ENV` variable is set to `development`

`echo $NODE_ENV`

If this command prints `development`, you're all set to move to the next section.

If you need to edit your `NODE_ENV`:

`atom ~/.zshrc` for zshell or `atom ~/.bashrc` for bash and add the entry:

`export NODE_ENV=development`

#### Create your .env.development and .env.test files

**Run the following commands on your terminal:**

```
touch configuration/.env.development
touch configuration/.env.test
echo DATABASE_URL=postgres://`whoami`@localhost:5432/coach-queue-development >> configuration/.env.development``
echo DATABASE_URL=postgres://`whoami`@localhost:5432/coach-queue-test >> configuration/.env.test

```

___

### Setup Database

**Install PostgreSQL**

`brew update`

`brew doctor`

`brew install postgresql`

`createdb coach-queue-test`

`createdb coach-queue-development`

### Migrations

**Run latest migrations**

`npm run migrate:latest`

**Make a new migration**

`npm run migrate:make`

**Rollback to previous migration**

`npm run migrate:rollback`

### Run Tests

`npm test`
