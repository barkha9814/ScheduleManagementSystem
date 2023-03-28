# Schedule Management System

## Description

We are building a schedule management system where user can schedule meetings in a room with multiple other people on a specific time. There can be multiple users trying to book a meeting on a specific day in a specific time slot. A new meeting can be created using the APIS. CRUD operations for users and rooms have also been defined in the APIs.

## Installation

### 1) Clone the repository:
```
git clone https://github.com/growthpal/fe-assignment
```

### 2) Dependencies installation
On the project root folder, run:
```
npm install
```

### 3) Start MongoDB server
Run mongDB as a service, and make sure to know the port # (27017 by default). This works for Linux:
```
sudo service mongod start
mongo
```
You can google instructions for Windows and Mac

### 4) Add a config.env file:
- Create a file named **.env** inside the root folder
```
vi .env
```
- Add these env variables to the file. You may change the port or the DB name to avoid conflicts:
```
MONGOHOST=localhost
MONGOPORT=27017
DATABASENAME=scheduleDB
PORT=3000
NODE_ENV=development
```

### 5) Run the services on localhost:
From the root folder, start the project by running
```   
npm start
```

This will start the services on PORT 3000. You can change the value in the **.env** file.

## Endpoints
Read the swagger documentation on http://localhost:3000/api-docs

## Tech Stack

- [MongoDB](https://www.mongodb.com)
- [Express.js](https://expressjs.com)
- [node.js](https://nodejs.org/en/) 

Now, you need to implement the frontend for this using an appropriate framework, preferably [ReactJS](https://reactjs.org/). 