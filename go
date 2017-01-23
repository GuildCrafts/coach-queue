#!/bin/bash

function create_db {
  env=${1:-test}
  echo "Going to create db in ${env}"
  createdb coach-que-${env}
}

function drop_db {
  env=${1:-test}
  echo "Going to drop db in ${env}"
  dropdb coach-que-${env}
}

function migrate_db {
  env=${1:-test}
  echo "Going to migrate db in ${env}"
  NODE_ENV=${env} ./node_modules/knex/bin/cli.js migrate:latest --knexfile config/DBconfig.js
}

function reset_db {
  env=${1:-test}
  drop_db ${env}
  create_db ${env}
  migrate_db ${env}
}

function create_migration {
  echo ${2}
  ./node_modules/knex/bin/cli.js migrate:make ${2} --knexfile config/DBconfig.js
}

function test {
  echo "calling the test function"
  migrate_db
  NODE_ENV=test npm run seed:testdb && ./node_modules/mocha/bin/mocha --recursive ./test/models/ --compilers js:babel-core/register --timeout 10000
}

function full_tests {
  echo "calling the test function"
  reset_db
  NODE_ENV=test ./node_modules/mocha/bin/mocha --timeout 10000 --recursive
}

function init {
  create_db development > /dev/null 2>&1
  migrate_db development
  create_db test > /dev/null 2>&1
  migrate_db test
  brew install postgres
  brew tap homebrew/services
  brew services start postgresql
  npm install
  echo "Done setting up your project!"
}

function start {
  npm run start:dev
}

function help {
  echo "Usage:"
  echo "   ./go init  ...........................  Will setup all dependencies\
for the project"
  echo "   ./go start ...........................  Starts dev server on port 3000"
  echo "   ./go test  ...........................  Run all tests"
  echo "   ./go migrate_db [development|test] ...  Runs migrations in the \
specified environment"
  echo "   ./go reset_db [development|test]  ....  Resets the db in the \
specified environment"
  echo "   ./go create_migration [new_file_name]   Creates a new knex migration file"
}

if [ -z "${1}" ] ; then
  init
  echo "Additional commands you can run -"
  help
  exit 0
fi

case $1 in
  test) test $@
  ;;
  init) init $@
  ;;
  start) start $@
  ;;
  reset_db|reset-db) shift; reset_db $@
  ;;
  migrate_db|migrate-db|migrate) shift; migrate_db $@
  ;;
  create_migration) create_migration $@
  ;;
  *) help
esac
