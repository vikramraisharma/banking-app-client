# Full Stack Banking Application

Source code: https://github.com/myogeshchavan97/fullstack_banking_app/tree/section-1-using-class-components

Originally built by Yogesh Chavan, [Tutorial Part 1](https://medium.com/javascript-in-plain-english/create-a-fullstack-banking-application-using-react-e8c96d74cd39)

### For more of my work, visit my portfolio [here](https://www.vikramraisharma.dev/)!

## To view the application locally:
1. Clone repo and run `yarn install` in both `fullstack-banking-app` directory and `/server` directory
2. Copy and paste commands from `server/scripts.sql` into your local PostgreSQL CLI
3. Run `yarn start` in both `fullstack-banking-app/` and `fullstack-banking-app/server/` folders
4. Open [localhost](http://localhost:3000) to view the React App

![Account Summary Screenshot](/md-images/summary)

## As a user, what can you do in this app?
- Create an account and log in/out
- Edit the name of your account (only when signed in)
- Create bank accounts, withdraw and deposit funds
- Download a spreadsheet summary of your accounts.

## Key learning areas:
- Using Redux to send/update data to `state` across components
- Basics of JWT and using authorization tokens/middleware
- Using EJS, and other React libraries to download transactional data as a spreadsheet
- Passing params into Puppeteer JS and using the library to convert HTML into the downloadable PDF account statement

## How does the Download feature work?
DownloadJS is a powerful library capable of returning and downloading any file type given the correct parameters. In this applicaiton, the query parameters are sent by `get` request to the API with a start and end date passed in via URL params: `download/account_id?start_date=''&end_date=''`. The parameters are used alongside the puppeteer JS library to convert the generated HTML into a PDF document, which is returned to the get function for final download. 

## What is Redux, and how does this app use it?
React Redux gives your React app the ability to read data from a "Redux store." The Redux library also lets a user execute `dispatch` functions to update data in the store. Redux uses a function called `mapStateToProps`, and `mapStateToProps` is called in each component connected to the redux store in order to send information to, or remove information from the store. In this app, I use the `return` method built into redux to send key/value pairs into the `state` of the component itself. This is a unique (and efficient!) way of passing information into a React component compared to manually passing props into state. 

