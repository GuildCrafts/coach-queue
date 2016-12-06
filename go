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
  NODE_ENV=${env} knex migrate:latest --knexfile config/DBconfig.js
}

function reset_db {
  env=${1:-test}
  drop_db ${env}
  create_db ${env}
  migrate_db ${env}
}

function test {
  echo "calling the test function"
  migrate_db
  NODE_ENV=test mocha --timeout 10000 --recursive
}

function full_tests {
  echo "calling the test function"
  reset_db
  NODE_ENV=test mocha --timeout 10000 --recursive
}

function init {
  # add all initial commands to run here
  echo "TODO"
}

function help {
  echo "Usage:"
  echo "   ./go init  Will setup all dependencies for the project"
  echo "   ./go test  Run all tests"
}

# TODO fix this 
# if ! [ -z "${1}" ] ; then
#   echo "entered if"
#   help
#   exit 1
# fi

case $1 in 
  test) test $@
  ;;
  init) init $@
  ;;
  reset_db|reset-db) shift; reset_db $@
  ;;
  migrate_db|migrate-db) shift; migrate_db $@
  ;;
  *) help
esac





