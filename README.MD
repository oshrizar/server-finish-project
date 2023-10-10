# Project Name: electro-master-server (Electro Master)

#### Welcome to my project: 'Electro Master' - a project for ordering digital goods and computers. the project uses both client and server side application using ReactJS and NodeJS.

# Before using the project. make sure to read 'Server's connection' paragraph in order to run the project well.

## Server Configuration

- The server runs on port 8181 on localhost.
- The server utilizes MongoDB as the database.
- The server initiates an initial data for the DB, as long as there is no data **at all** on the Database

## Server's Characteristics

- The server is logging in the console for every request is sent through the server, it is written in a way you should be able to read and understand.
- the server is made for managing the Database with cards about electric products and serve a few commands that will be detailed and explained at the API DOCS.

## Server Connection

When connecting to the server, you will encounter the following messages:

- Connection to MongoDB => [LOCAL or ATLAS]
- Server running on http://localhost:8181/
- Connected to MongoDB
- **MAKE SURE YOU HAVE ALL THOSE MESSEGES BEFORE CONTNUING USING THE SERVER**

## Environment Setup

The server can be run in two environments: production and development.

- To start the server in production mode, use the command: [npm start]:(atlas MongoDB)
- To start the server in development mode, use the command: [npm run dev]:(localhost mongoDB)

## Initial Data Of The Server

The server initiates 3 cards (products) + 2 users.
User 1 (ADMIN):
email:israel@gmail.com
User 2 (REGULAR):
ploni@gmail.com
**FOR BOTH USERS THE PASSWORD IS** 'Aa123456!'

## Input Requirements

Certain API endpoints may require specific inputs from the client. Please refer to the documentation for each API for the required inputs.

## Authorization and Authentication

To access certain endpoints, [AUTHORIZATION known as TOKEN - *header key is "x-auth-token" - put the token out put recieved from the {http://localhost8181/api/users/login} url inside the given key name in the request header*] and [AUTHENTICATION such as ADMIN] may be required. Please refer to the documentation for each API to understand the authorization and authentication process.

## API Documentation

### **url:http://localhost:8181/**

### **Recommended default URL for proxy: /api**

## USERS

### GET ALL USERS

#### USAGE: get all users info on the DB

- HTTP Method: [GET]
- URL End Point Request: [/users/users]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [ADMIN]

### GET A USER

#### USAGE: get user info from the DB

- HTTP Method: [GET]
- URL End Point Request: [/users/user/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [ADMIN]
- Params:
  - [id]: [the id of the user the api should ask the info for]

### GET USER THEMSELVES

#### USAGE: get user info from the DB using token info for themselves

- HTTP Method: [GET]
- URL End Point Request: [/users/userInfo]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [none]

### REGISTER USER

#### USAGE: Register a user into the DB

- HTTP Method: [POST]
- URL End Point Request: [/users/register]
- Authentication Needed (token): [No]
- Authorizations Needed: [none]
- Requirements for body (object):

      {
      - name:{
        - first: string, min length 2, required
        - last: string, min length 2, required
          }
      - email: string, email regex      (example@email.com),UNIQUE - cant proceed if already taken in the     Database, required
      - password: string, min length 8, must      contain: 1 capital letter, 1 small      letter, 4 digit and one
        of the following chars {#?!@$%^&\*-}, required
      - gender: "male"/"female"/"other"
      - image:{
        - imageFile:{
            - data:**<INSERT IMAGE FILE (.png,.jpg,.jpeg,.gif)>**
            - contentType:"image/png"/"image/jpg"/"image/jpeg"/"image/gif"
            - }
        - alt: string, min length 2, max length 256, required
        - }
      }

### LOGIN USER

#### USAGE: Recieve a token from the server for a user

- HTTP Method: [POST]
- URL End Point Request: [/users/login]
- Authentication Needed (token): [No]
- Authorizations Needed: [none]
- Requirements for body (object):

      {
        - email: string, email regex (example@email.com), required
        - password: string, min length 8, must contain: 1 capital letter, 1 small letter, 4 digit and one of the following chars {\*#?!@$%^&-}, required
      }

### EDIT USER

#### USAGE:Edit the user's own details using the provided token

- HTTP Method: [PUT]
- URL End Point Request: [/users/edit/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [none]
- Params:
  - [id]: [the id of the user the api should ask the info for]
- Requirements for body (object):

      {
      - name:{
        - first: string, min length 2, required
        - last: string, min length 2, required
          }
      - email: string, email regex (example@email.com),UNIQUE - cant proceed if already taken in    the Database, required
      - image:{
        - imageFile:{
            - data:**<INSERT IMAGE FILE (.png,.jpg,.jpeg,.gif)>**
            - contentType:"image/png"/"image/jpg"/"image/jpeg"/"image/gif"
            - }
        - alt: string, min length 2, max length 256, required
        - }
      }

### INVERT ADMIN STATUS

#### USAGE: Invoke/revoke isAdmin boolean value

- HTTP Method: [PATCH]
- URL End Point Request: [users/user/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [ADMIN]
- Params:
  - [id]: [the id of the user the api should ask the info for]

### DELETE USER THEMSELVES

#### USAGE: Delete the user of the given token from the DB

- HTTP Method: [DELETE]
- URL End Point Request: [/users/deleteSelf]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [none]

### DELETE A USER

#### USAGE: Delete a user from the DB

- HTTP Method: [DELETE]
- URL End Point Request: [/users/delete/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [ADMIN]
- Params:
  - [id]: [the id of the user the api should ask the info for]

## CARDS

### GET ALL CARDS

#### USAGE: Recieve an array containing all the card in the DB

- HTTP Method: [GET]
- URL End Point Request: [/cards/allCards]
- Authentication Needed (token): [No]
- Authorizations Needed: [none]

### GET A SPECIFIC CARD

#### USAGE: Recieve Information of a specific card

- HTTP Method: [GET]
- URL End Point Request: [/cards/card/:id]
- Authentication Needed (token): [No]
- Authorizations Needed: [none]
- Params:
  - [id]: [the id of the card the api should ask the info for]

### CREATE A CARD

#### USAGE: Create a card file into the DB

- HTTP Method: [POST]
- URL End Point Request: [/cards/create]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [ADMIN]
- Requirements for body (object):

        {
        - title: string, min length 2, max length 256, required
        - image:{
          - imageFile:{
            - data:**<INSERT IMAGE FILE (.png,.jpg,.jpeg,.gif)>**
            - contentType:"image/png"/"image/jpg"/"image/jpeg"/"image/gif"
            - }
          - alt: string, min length 2, max length 256, required
          - }
        - stock: number, min 0, required
        - price: number, min 0, required
        - contains: number, min 0, required
      }

### EDIT A CARD

#### USAGE: Edit the card's details on the DB

- HTTP Method: [PUT]
- URL End Point Request: [/cards/edit/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [ADMIN]
- Params:
  - [id]: [the id of the card the api should ask the info for]
- Requirements for body (object):

        {
        - title: string, min length 2, max length 256, required
        - image:{
          - imageFile:{
            - data:**<INSERT IMAGE FILE (.png,.jpg,.jpeg,.gif)>**
            - contentType:"image/png"/"image/jpg"/"image/jpeg"/"image/gif"
            - }
          - alt: string, min length 2, max length 256, required
          - }
        - stock: number, min 0, required
        - price: number, min 0, required
        - contains: number, min 0, required
      }

#### RATE A CARD

##### USAGE: Adds to the card {rating:ratingUsers} the id of the user of the provided token and their score to the card {rating:ratingTotalScore}

- HTTP Method: [PATCH]
- URL End Point Request: [/cards/rate/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [none]
- Params:
  - [id]: [the id of the card the api should ask the info for]
- Requirements for the body (object):

      {
        score: <Boolean (true/false)>
      }

### CART

#### ADD/REMOVE A CARD TO CART

##### USAGE: Adds or removes the id of the provided token into an array of 'cart' property in the card-object

- HTTP Method: [PATCH]
- URL End Point Request: [/cards/cart/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [none]
- Params:
  - [id]: [the id of the card the api should ask the info for]

#### GET CART ITEMS OF USER

##### USAGE: Returns the cards that contain the user's id in their {cart} property an Array of the cards

- HTTP Method: [GET]
- URL End Point Request: [/cards/getCart]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [none]

### DELETE A CARD

#### USAGE: Delete a card from the DB

- HTTP Method: [DELETE]
- URL End Point Request: [/cards/delete/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [ADMIN]
- Params:
  - [id]: [the id of the card the api should ask the info for]
