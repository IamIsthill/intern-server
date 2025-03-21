# OJT Management System

## Overview

Todo

### Base URL
The following is the base url for the OJT Management System

```text
http://localhost:3000/
```

### Authorization

Authentication and authorization is required for requests to these APIs. Supported authentication methods are: JWT

```text
{Provide an example request with {Basic | Digest | OAuth | others} authentication.}
```

## Login Admins

## Endpoints

## Query Parameters

## Request Sample

## Response Sample

## Login Supervisor

## Endpoints

## Query Parameters

## Request Sample

## Response Sample

## Login Interns

## Endpoints

## Query Parameters

## Request Sample

## Response Sample

## Tasks

The Task Route is used to access the task models

### Endpoints

### Task Update Endpoint for Supervisor
An endpoint for a supervisor to update a task
```http
PUT /tasks/supervisor
```


### Retrieve tasks by intern id

Returns an array of tasks based on the intern id or an empty array if not found

#### Endpoint

```http
GET /tasks/intern
```

#### Query parameters

| Query parameter | Type   | Required? |
| --------------- | ------ | --------- |
| internId        | string | Required  |
|                 |        |           |

#### Request Sample

```http
GET /tasks/intern?internId=67cbecaa3f611eedb0b953f0
```

#### Request body

| Field           | Type                | Required? | Description                                                        |
| --------------- | ------------------- | --------- | ------------------------------------------------------------------ |
| title           | string              | Required  | Title of the tasks                                                 |
| description     | string              | Required  | Description of the task                                            |
| deadline        | string              | Required  | Task deadline, formatted as an ISO 8601 string                     |
| assignedInterns | strings[] | Optional  | A single intern ID or an array of intern IDs to assign to the task |


#### Response Sample
```json
{
    "tasks": [
        {
            "supervisor": {
                "firstName": "John",
                "lastName": "Doe",
                "email": "john.doe@example.com"
            },
            "title": "foo",
            "description": "bar",
            "deadline": "2024-03-10T00:00:00.000Z",
            "status" : "pending"
        }
    ]
}
```

#### Supervisor Response sample
If the requester has a supervisor access, the json below is the response
```json
{
  "tasks": [
    {
      "supervisor": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com"
      },
      "title": "foo",
      "description": "bar",
      "deadline": "2024-03-10T00:00:00.000Z",
      "assignedInterns": [
        {
          "internId": "67cbecaa3f611eedb0b953f0",
          "status": "pending"
        }
      ]
    }
  ]
}

```

## Create tasks

An endpoint for creating tasks. You can immediately assign interns to it or leave it for later.

### Endpoint

```http
POST /tasks
```

#### Header parameters

| Header parameter | Type   | Required? | Description      |
| ---------------- | ------ | --------- | ---------------- |
| Content-Type     | string | Required  | application/json |

#### Request body

| Field           | Type                | Required? | Description                                                        |
| --------------- | ------------------- | --------- | ------------------------------------------------------------------ |
| title           | string              | Required  | Title of the tasks                                                 |
| description     | string              | Required  | Description of the task                                            |
| deadline        | string              | Required  | Task deadline, formatted as an ISO 8601 string                     |
| assignedInterns | string or strings[] | Optional  | A single intern ID or an array of intern IDs to assign to the task |

### Request Sample

```http
POST /tasks
Content-Type: application/json
Authorization: Bearer <your_token>
```

### Request Payload

```json
{
  "title": "Complete Project Report",
  "description": "Interns need to finalize and submit the project report.",
  "deadline": "2025-03-15T23:59:59.999Z",
  "assignedInterns": ["67cbecaa3f611eedb0b953ef", "67cbf2ba5f611eedb0b9540a"]
}
```

### Response Sample
```json
{
  "supervisor": "67cbecaa3f611eedb0b953ef",
  "title": "Complete Project Report",
  "description": "Interns need to finalize and submit the project report.",
  "deadline": "2025-03-15T23:59:59.999Z",
  "_id": "67cd2e27a8ec1d186a4f60de",
  "assignedInterns": [
    {
      "internId": "67cbecaa3f611eedb0b953ef",
      "status": "pending"
    },
    {
      "internId": "67cbf2ba5f611eedb0b9540a",
      "status": "pending"
    }
  ],
  "__v": 0
}
```

## Admin Endpoints
To access the routes on this endpoint, user must have admin access

### Header Parameters
| Header parameter | Type   | Required? | Description      |
| ---------------- | ------ | --------- | ---------------- |
| Content-Type     | string | Required  | application/json |
| Authorization    | string | Required  | Bearer token     |

### Get all accounts
An endpoint for fetching all supervisor and intern accounts

#### Endpoint
```http
GET /admin/accounts
```

#### Response sample
```json
{
  [
    {
      "_id": "67ca8a80536daacf28d2940e",
      "firstName": "foo",
      "lastName": "bar",
      "email": "supssss@sup.com",
      "accountType": "supervisor"
    },
    {
      "_id": "67ca8a89536daacf28d29411",
      "firstName": "foo",
      "lastName": "bar",
      "email": "supsssss@sup.com",
      "accountType": "supervisor"
    }
  ]
}
```
### Get all intern request
An endpoint for fetching the accounts waiting for approval

#### Endpoint
```http
GET /admin/accounts/intern-request
```

#### Response sample
```json
{
  "accounts": [
    {
      "_id": "67cbecaa3f611eedb0b953f0",
      "firstName": "foo",
      "lastName": "bar",
      "email": "foo@foos.com",
      "status": "inactive",
      "accountType": "intern"
    }
  ]
}
```
### Update intern request status
An endpoint for updating the request status of an intern

#### Endpoint
```http
PUT /admin/accounts/intern-request
```

#### Request body

| Field           | Type                | Required? | Description |
| --------------- | ------------------- | --------- | ----------- |
| internId        | string              | Required  | The _id of the intern |
| isApproved      | boolean             | Required  | True=approved, False=reject |

#### Request Payload Sample
```json
{
  "internId": "67cbecaa3f611eedb0b953f0",
  "isApproved": true 
}

```

#### Response sample
```json
{
  "accounts": [
    {
      "_id": "67cbecaa3f611eedb0b953f0",
      "firstName": "foo",
      "lastName": "bar",
      "email": "foo@foos.com",
      "status": "active",
      "accountType": "intern"
    }
  ]
}
```

### Create intern account endpoint
An endpoint for the admin to create an intern account

#### Endpoint
```http
POST /accounts/intern
```

#### Request body
| Field           | Type                | Required? | Description |
| --------------- | ------------------- | --------- | ----------- |
| firstName        | string              | Required  |  |
| lastName      | string             | Required  |  |
| age      | number             | Required  |  |
| school      | string             | Required  |  |
| internshipHours      | number             | Required  |  |
| email      | string             | Required  |  |
| password      | number             | Required  |  |
| department      | string             | Required  | The object id of the department |
| supervisor      | string             | Required  | The object id of the supervisor |
| status      | string             | Required  | active or inactive |

#### Response Sample
```json
{
  "message" : "User created successfully",
  "user" : {
    "accountType" : "intern",
    "age" : 22,
    "department" : null,
    "email" : "marias@maria.com",
    "firstName" :  "Charles",
    "internshipHours" :  21,
    "isApproved"  :  "pending",
    "lastName"  :  "Bercasio",
    "phone" :  "09876543216",
    "school" : "12123" ,
    "status" : "inactive",
    "supervisor" : null,
    "timeEntries" : [],
    "totalHours" : 0,
    "__v" : 0,
    "_id" : "67d6a7ca0bf047d57a1b0073"
  }
}
```
## Task Endpoint
An endpoint for interfacing with the task model

### Header Parameters
| Header parameter | Type   | Required? | Description      |
| ---------------- | ------ | --------- | ---------------- |
| Content-Type     | string | Required  | application/json |
| Authorization    | string | Required  | Bearer token     |

### Update Task Endpoint
Allows an intern user to update their respective task status

#### Endpoint
```http
PUT /tasks/:taskId
```

#### Request Params
| Field           | Type                | Required? | Description |
| --------------- | ------------------- | --------- | ----------- |
| taskId      | boolean             | Required  | The _id of the task |


#### Request Body

| Field           | Type                | Required? | Description |
| --------------- | ------------------- | --------- | ----------- |
| internId        | string              | Required  | The _id of the intern |
| status      | string             | Required  | The new status of the task |

#### Response Sample
```json
{
  "task": {
    "_id": "67ce53f7a21d35e947ece076",
    "title": "Foo",
    "description": "Foo",
    "deadline": "2025-03-09T18:08:44.000Z",
    "__v": 0,
    "status": "completed"
  }
}
```
