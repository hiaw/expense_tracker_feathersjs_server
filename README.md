# Expense Tracker Server by Daniel Chong for Toptal project interview

## About

This feathersjs app provide the REST backend for the mobile Expense Tracker app

## Prerequisite

[Feathers](http://feathersjs.com), `node`

```
$ npm install -g feathers-cli             # Install Feathers CLI
```

## Get Started
```
yarn
npm start
```

## Testing
```
npm run mocha
```

## Test Result
```
  Feathers application tests
    ✓ starts and shows the index page (50ms)
      ✓ shows a 404 HTML page
      ✓ shows a 404 JSON error without stack trace

  REST filter expense service
    ✓ should get list of expenses (98ms)
    ✓ should limit expense number
    ✓ should filter by expense description

  REST filter expense service
    ✓ should get list of expenses
    ✓ should filter by description
    ✓ should filter by amount
    ✓ should limit results
    ✓ should filter by date
    ✓ should filter by date

  expense service
    ✓ registered the expenses service
    ✓ runs create

  REST expense service
    ✓ should create the expense data
    ✓ should create another the expense data
    ✓ should get list of expenses
    ✓ should get the expense
    ✓ should update the expense
    ✓ should delete the expense
    ✓ should now only give single expense

  REST as Admin expense service
    ✓ registered the expenses service
    ✓ should create the expense data
    ✓ should create another the expense data
    ✓ should get the expense
    ✓ should update the expense
    ✓ should delete the expense

  REST as Admin expense list service
    ✓ should create an expense data
    ✓ user should get list of expenses
    ✓ admin should get list of expenses

  REST as Manager expense service
    ✓ should create another the expense data
    ✓ should not get the expense
    ✓ should not update the expense
    ✓ should not delete the expense

  REST as Manager expense list service
    ✓ should create an expense data
    ✓ user should get list of expenses
    ✓ manager should not get list of expenses

  user service
    ✓ registered the users service
    ✓ runs create (106ms)

  REST user service
    ✓ should not get list of users
    ✓ should get the user
    ✓ should update the user
    ✓ should delete the user

  REST as Admin user service
    ✓ registered the users service
    ✓ should create the user data (123ms)
    ✓ should get list of users
    ✓ should get the user
    ✓ should update the user
    ✓ should delete the user

  REST as Manager user service
    ✓ registered the users service
    ✓ should create the user data (105ms)
    ✓ should get list of users
    ✓ should get the user
    ✓ should update the user
    ✓ should delete the user


  55 passing (5s)
```
