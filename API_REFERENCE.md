# API Reference template

## Overview

Use the {product} APIs to {access | customize | program} the {features | functionality}.

### Base URL

```text
http://localhost:3000
```

### HTTP status codes

The {product} APIs use the following standard HTTP response codes:

| Status code | Message           | Description   |
|-------------|-------------------|---------------|
| `200 OK`    | Request succeeds. | {description} |
|             |                   |               |
|             |                   |               |


#### ExampleErrorType

| Field          | Type     | Description                                      |
|----------------|----------|--------------------------------------------------|
| {errorType}    | {enum}   | {Predefined error codes. Possible enum values are x, y, ..., and z.} |
| {errorMessage} | {string} | {Additional information about why the error occurs.} |

## Login Endpoints
endpoints for logging in the supervisors, admin and interns

### Data Model
| Attribute | Type   | Required? | Description                  |
|-----------|--------|-----------|------------------------------|
| message      | string | Required  | A message caused by the event  |
| token   | string | Required  | A jwt token to be used for protected endpoints               |


### Endpoints  

| Method | Endpoint Name                           | Description                                      |
|--------|-----------------------------------------|--------------------------------------------------|
| POST   | [Admin Login](#admin-login)            | Authenticates an admin and generates a jwt token. |
| POST   | [Supervisor Login](#supervisor-login)  | Authenticates a supervisor and grants access to their dashboard. |
| POST   | [Intern Login](#intern-login)          | Authenticates an intern and provides access to intern-specific resources. |


## Admin Login
```http
POST /a2kstaffs/login/admin
```
### Request schema

#### Request body

| Field  | Type   | Required? | Description                      |
|--------|--------|-----------|----------------------------------|
| email   | string | Required  | The email of the admin user  |
| password   | string | Required  | The password of the admin user  |

### Request example
```json
{
    "email": "admin@admin.com",
    "password": "12345678"
}
```
### Response schema

| Status code | Schema                                  | Description          |
|-------------|-----------------------------------------|----------------------|
| `2xx`       | [Data Model](#login-endpoints/data-model)        | The request was successful, and a token is returned. |


### Response example
```json
{
    "message": "Login Successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Yzg0MmViZDQ5MmE3MzQ2YzRhNDQwNyIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiYWNjb3VudFR5cGUiOiJhZG1pbiIsImlhdCI6MTc0MzM5MzAyMSwiZXhwIjoxNzQzMzk2NjIxfQ.Gwa9UOa_R54YwBLZP3z0fyuizUJV__JS-pl4DTh-A8w"
}
```

## Supervisor Login
```http
POST /a2kstaffs/login/supervisor
```
### Request schema

#### Request body

| Field  | Type   | Required? | Description                      |
|--------|--------|-----------|----------------------------------|
| email   | string | Required  | Email of the user  |
| password   | string | Required  | Password of the user  |

### Request example
```json
{
    "email": "sup@sup.com",
    "password": "12345678"
}
```
### Response schema

| Status code | Schema                                  | Description          |
|-------------|-----------------------------------------|----------------------|
| `2xx`       | [Data Model](#login-endpoints/data-model)        | {Describe the result where the request succeeds.} |


### Response example
```json
{
    "message": "Login Successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Yzg0MmViZDQ5MmE3MzQ2YzRhNDQwNyIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiYWNjb3VudFR5cGUiOiJhZG1pbiIsImlhdCI6MTc0MzM5MzAyMSwiZXhwIjoxNzQzMzk2NjIxfQ.Gwa9UOa_R54YwBLZP3z0fyuizUJV__JS-pl4DTh-A8w"
}
```
## Intern Login
```http
POST /auth/login/intern
```
### Request schema

#### Request body

| Field  | Type   | Required? | Description                      |
|--------|--------|-----------|----------------------------------|
| email   | string | Required  | Email of the user  |
| password   | string | Required  | Password of the user  |

### Request example
```json
{
    "email": "foo@foo.com",
    "password": "12345678"
}
```
### Response schema

| Status code | Schema                                  | Description          |
|-------------|-----------------------------------------|----------------------|
| `2xx`       | [Data Model](#login-endpoints/data-model)        | {Describe the result where the request succeeds.} |


### Response example
```json
{
    "message": "Login Successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Yzg0MmViZDQ5MmE3MzQ2YzRhNDQwNyIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiYWNjb3VudFR5cGUiOiJhZG1pbiIsImlhdCI6MTc0MzM5MzAyMSwiZXhwIjoxNzQzMzk2NjIxfQ.Gwa9UOa_R54YwBLZP3z0fyuizUJV__JS-pl4DTh-A8w"
}
```



## Admin User  

These are the endpoints accessible by an admin user.  

### Authorization  

The [Admin Authorization](#admin-login) is required for each API request.  

---

### Endpoints  

Use the following endpoints to interact with the Admin entity:  

| Method | Endpoint Name                                  | Description |
|--------|-----------------------------------------------|-------------|
| GET    | [Get all accounts](#get-all-accounts)        | Retrieves all user accounts. |
| POST   | [Create intern account](#create-intern-account) | Creates a new intern account. |
| GET    | [Requesting interns](#fetch-intern-request)  | Fetches pending intern requests. |
| PUT    | [Update an intern request status](#update-admin-profile) | Updates the status of an intern request. |
| GET    | [Get admin by ID](#get-admin-by-id)          | Retrieves admin details by ID. |


## Get all accounts

Fetch supervisor and intern accounts by query

### Endpoint

```text
GET /admin/accounts
```

### Description

This endpoint retrieves all supervisor and intern accounts. You can filter the results using the q query parameter, which applies filtering based on:
- firstName
- lastName
- email
- status
- accountType


### Request schema

#### Query parameters

| Query parameter | Type | Required? | Description                             |
|-----------------|------|-----------|-----------------------------------------|
| q      | string  | Optional  | Filter accounts by name, email, status, or type. |


### Request example

```http
GET /admin/accounts?q=intern
```
### Response example

```json
{
    "accounts": [
        {
            "_id": "67e4cfb72ce2f25a20a1211c",
            "firstName": "Erna",
            "lastName": "Mosciski",
            "email": "foo@foo.com",
            "status": "active",
            "accountType": "intern"
        },
        {
            "_id": "67e4cfb72ce2f25a20a12120",
            "firstName": "Francis",
            "lastName": "Grimes",
            "email": "Jennyfer_Goyette34@hotmail.com",
            "status": "active",
            "accountType": "intern"
        },
        {
            "_id": "67e52ca548b989a81dcc706f",
            "firstName": "Charles",
            "lastName": "Bercasio",
            "email": "training@a2kacademy.com",
            "status": "active",
            "accountType": "intern"
        },
        {
            "_id": "67e52d921542c906a6223b04",
            "firstName": "Charles",
            "lastName": "Bercasio",
            "email": "supqweqwe@sup.com",
            "status": "active",
            "accountType": "intern"
        },
        {
            "_id": "67e52e851542c906a6223baf",
            "firstName": "Charles",
            "lastName": "Bercasio",
            "email": "supqweqe@sup.com",
            "status": "active",
            "accountType": "intern"
        }
    ]
}
```

## Create Intern Account
Create a new intern account

### Endpoint
```http
POST /admin/accounts/intern
```
### Description
This endpoint allows an admin user to create an intern account within the system. The newly created intern account will be associated with details such as personal information, school, internship hours, and optional fields like department, supervisor, and time entries.

### Request schema

#### Request body

Field           | Type     | Required? | Description  
---------------|---------|-----------|-------------  
firstName    | string | Yes       | Intern’s first name.  
lastName     | string | Yes       | Intern’s last name.  
age          | number | Yes       | Intern’s age.  
phone        | string | Yes       | 11-digit phone number.  
school       | string | Yes       | Name of the intern’s school.  
internshipHours | number | Yes    | Required internship hours.  
email        | string | Yes       | Intern’s email address.  
password     | string | Yes       | Account password.  
department   | string | No        | Hexadecimal 24-character department ID.  
supervisor   | string | No        | Hexadecimal 24-character supervisor ID.  
status       | string | No        | Internship status (active or inactive).  
timeEntries  | array  | No        | List of time-in and time-out records.  
totalHours   | number | No        | Total hours completed.

### Request Example
```http
POST /admin/accounts/intern
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "age": 22,
  "phone": "09123456789",
  "school": "Tech University",
  "internshipHours": 200,
  "email": "johndoe@example.com",
  "password": "securePassword123",
  "department": "60d5f9e813b5c70017e6e5b1",
  "supervisor": "60d5f9e813b5c70017e6e5b2",
  "status": "active",
  "timeEntries": [
    {
      "timeIn": "2025-03-31T08:00:00Z",
      "timeOut": "2025-03-31T17:00:00Z"
    }
  ],
  "totalHours": 9
}
```

### Response Example
```json
{
    "message": "User created successfully",
    "user": {
        "firstName": "John",
        "lastName": "Doe",
        "age": 22,
        "phone": "09123456789",
        "school": "Tech University",
        "internshipHours": 200,
        "email": "johndoe@example.com",
        "department": "60d5f9e813b5c70017e6e5b1",
        "supervisor": "60d5f9e813b5c70017e6e5b2",
        "status": "active",
        "timeEntries": [
            {
                "timeIn": "2025-03-31T08:00:00.000Z",
                "timeOut": "2025-03-31T17:00:00.000Z",
                "_id": "67ea2a8f86c8971ca1fe27bb"
            }
        ],
        "accountType": "intern",
        "isApproved": "approved",
        "totalHours": 9,
        "_id": "67ea2a8f86c8971ca1fe27ba",
    }
}
```

## Fetch Intern Request
Retrieve all intern accounts that are **pending approval**. 
### Endpoint
```http
GET /admin/accounts/intern-request
```

### Description
This endpoint allows an admin user to fetch a list of intern accounts that are still awaiting approval or rejection.
- Useful for managing pending intern requests efficiently.

- Helps track interns who have applied but have not yet been approved into the system.

- Typically, these accounts require an admin decision to activate or reject them.

This ensures that only verified interns gain access to the system.

### Request example

```http
GET /admin/accounts/intern-request
Content-type: application/json
```
### Response example

```json
{
    "accounts": [
        {
        "firstName": "foo",
        "lastName": "bar",
        "email": "foobar@gmail.com",
        "accountType": "intern",
        "_id": "60d5f9e813b5c70017e6e5b1",
        "status" : "approved"
        }
    ]
}
```

## Update an Intern Request Status
Approve or reject an intern's account request. 
### Endpoint
```http
PUT /accounts/intern-request
```
### Description
This endpoint allows an admin user to update the status of an intern's request. The status can be set to:

- Approved – Grants the intern access to the system.

- Rejected – Denies the intern’s request and prevents account activation.

This ensures that only verified interns are approved while filtering out unqualified or invalid requests.

### Request Schema
#### Request body
| Field  | Type   | Required? | Description                      |
|--------|--------|-----------|----------------------------------|
internId   | string | Yes        | Hexadecimal 24-character intern ID. 
isApproved | boolean | Yes | [false, true] Request status of the intern
### Request example

```http
PUT /accounts/intern-request
Content-type: application/json

{
    "internId": "67e4cfb72ce2f25a20a1211c",
    "isApproved": false
}
```

### Response example
```json
{
    "account": {
        "_id": "67e4cfb72ce2f25a20a1211c",
        "firstName": "Erna",
        "lastName": "Mosciski",
        "email": "foo@foo.com",
        "status": "inactive",
        "accountType": "intern"
    }
}
```

## Update Admin Profile
An endpoint for updating the admin user's profile information.

### Endpoint 
```http
PUT /admin/edit-profile/:id
```

### Description
This endpoint allows an admin user to update their profile details, such as their name, email, or password. It ensures that the admin can manage and maintain their account information securely. The `id` parameter in the URL specifies the unique identifier of the admin whose profile is being updated.


### Request Schema

#### Path parameters
| Path parameter | Type   | Required? | Description                  |
|----------------|--------|-----------|------------------------------|
id   | string | Yes        | Hexadecimal 24-character admin id. 

#### Request body

Field       | Type     | Required? | Description  
-----------|---------|-----------|-------------  
id         | string  | Yes       | Unique identifier of the admin.  
firstName  | string  | No        | Admin’s first name.  
lastName   | string  | No        | Admin’s last name.  
email      | string  | No        | Admin’s email address (must be a valid email).  
password   | string  | No        | Admin’s password (minimum 8 characters).  

### Request example

```http
PUT /admin/edit-profile/67e4cfb72ce2f25a20a1211c
Content-type: application/json

{
    "id": "67c842ebd492a7346c4a4407",
    "firstName": "Charles",
    "lastName": "Bercasio",
    "email": "admin@admin.com",
    "password": "12345678"
}
```

### Response Example
```json
{
    "success": true,
    "message": "Admin profile updated successfully",
    "data": {
        "_id": "67c842ebd492a7346c4a4407",
        "email": "admin@admin.com",
        "accountType": "admin",
        "firstName": "Charles",
        "lastName": "Bercasio"
    }
}
```

## Get Admin by ID
Retrieve the details of an admin account using its unique identifier.

### Endpoint 
```http
GET /admin/get-admin/:id
```

### Description
This endpoint allows you to fetch the details of a specific admin account by providing its unique ID. It is useful for retrieving information such as the admin's name, email, and account type. The `id` parameter in the URL represents the 24-character hexadecimal identifier of the admin.

### Request schema

#### Path parameters
| Path parameter | Type   | Required? | Description                  |
|----------------|--------|-----------|------------------------------|
id   | string | Yes        | Hexadecimal 24-character admin id. 

### Request Example
```http
GET /admin/get-admin/67c842ebd492a7346c4a4407
```

### Response Example
```json
{
    "success": true,
    "data": {
        "_id": "67c842ebd492a7346c4a4407",
        "email": "admin@admin.com",
        "accountType": "admin",
        "firstName": "Charles",
        "lastName": "Bercasio"
    }
}
```

## Department

The `Department` model represents a department entity in the system. It is used to store and manage information about different departments.

### Schema Definition
The `Department` schema is defined as follows:

| Field | Type   | Required | Unique | Description                     |
|-------|--------|----------|--------|---------------------------------|
| _id   | String | Yes      | Yes    | The unique identifier of the department. |
| name  | String | Yes      | Yes    | The name of the department.     |

### Example
```json
{
    "_id": "642c1f9e8f1b2c0012345678",
    "name": "Human Resources"
}
```

### Endpoints

Use the following endpoints to interact with the {resource name} entities.

| Method | Endpoint name                            | Description             |
|--------|------------------------------------------|-------------------------|
| POST   | {[Endpoint name A](#link_to_endpoint_a)} | Creates a {resource}.  |
| GET    | {[Endpoint name B](#link_to_endpoint_b)} | Retrieves a {resource}. |
|        |                                          |                         |

## Get All Departments
Retrieve a list of all departments in the system.

### Endpoint
```http
GET /departments/all
```

### Description
This endpoint allows you to fetch an array of all departments currently available in the system. Each department includes its unique identifier (`_id`) and name.

### Request Example
```http
GET /departments/all
Content-Type: application/json
```

### Response Example
```json
{
    "departments": [
        {
            "_id": "67ca8a7f536daacf28d2940c",
            "name": "IT"
        },
        {
            "_id": "67d69526719d37d13d97d784",
            "name": "Design"
        }
    ]
}
```
















