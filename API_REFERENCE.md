# API Reference template

## Overview

Use the {product} APIs to {access | customize | program} the {features | functionality}.

### Base URL

```text
http://localhost:3000
```

### HTTP Status Codes


| Status Code | Message           | Description                                   |
|-------------|-------------------|-----------------------------------------------|
| `200 OK`    | Request succeeds. | The request was successfully processed.       |
| `201 Created` | Resource created. | A new resource has been successfully created. |
| `400 Bad Request` | Invalid request. | The server could not understand the request due to invalid syntax. |
| `401 Unauthorized` | Authentication required. | The request requires user authentication. |
| `403 Forbidden` | Access denied. | The server understood the request but refuses to authorize it. |
| `404 Not Found` | Resource not found. | The requested resource could not be found. |
| `500 Internal Server Error` | Server error. | The server encountered an unexpected condition that prevented it from fulfilling the request. |



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
        "_id": "67ea2a8f86c8971ca1fe27ba"
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
| GET   | {[Get All Departments](#get-all-departments)} | Retrieves a list of all departments in the system..  |

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

## Interns Auth
Endpoints useful for registering an intern

### Authorization
Authentication is not required to access these APIs.

### Endpoints

Use the following endpoints to interact with the {resource name} entities.

| Method | Endpoint name                            | Description             |
|--------|------------------------------------------|-------------------------|
| POST   | [Register Intern](#register-intern) | An endpoint for creating intern accounts.  |
| GET    | [Check Email Availability](#check-email-availability) | Verify if an email address is already registered in the system. |
| GET    | [Check Phone Availability](#check-phone-availability) | Verify if a phone number is already registered in the system. |

## Register Intern
An endpoint for creating intern accounts.

### Endpoint
```http
POST /auth/register
```

### Description
This endpoint allows the creation of a new intern account in the system. The intern account will include personal details, school information, and other optional fields such as department and supervisor. The account will be stored in the database and can be used for authentication and tracking internship progress.

### Request Schema

#### Request Body
| Field           | Type     | Required? | Description                                      |
|------------------|----------|-----------|--------------------------------------------------|
| firstName        | string   | Yes       | Intern’s first name.                             |
| lastName         | string   | Yes       | Intern’s last name.                              |
| age              | number   | Yes       | Intern’s age.                                    |
| phone            | string   | Yes       | 11-digit phone number.                           |
| school           | string   | Yes       | Name of the intern’s school.                     |
| internshipHours  | number   | Yes       | Required internship hours.                       |
| email            | string   | Yes       | Intern’s email address (must be unique).         |
| password         | string   | Yes       | Account password (minimum 8 characters).         |
| department       | string   | No        | Hexadecimal 24-character department ID.          |
| supervisor       | string   | No        | Hexadecimal 24-character supervisor ID.          |
| status           | string   | No        | Internship status (e.g., active or inactive).    |
| timeEntries      | array    | No        | List of time-in and time-out records.            |
| totalHours       | number   | No        | Total hours completed by the intern.             |

### Request Example
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "age": 22,
  "phone": "09123456782",
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
        "phone": "09123456782",
        "school": "Tech University",
        "internshipHours": 200,
        "email": "johndoes@example.com",
        "department": null,
        "supervisor": null,
        "status": "inactive",
        "timeEntries": [
            {
                "timeIn": "2025-03-31T08:00:00.000Z",
                "timeOut": "2025-03-31T17:00:00.000Z",
                "_id": "67ebf698b0d4d8143ee09977"
            }
        ],
        "accountType": "intern",
        "isApproved": "pending",
        "totalHours": 9,
        "_id": "67ebf698b0d4d8143ee09976",
        "logs": [],
        "reportLogs": [],
        "__v": 0
    }
}
```


## Check Email Availability
Verify if an email address is already registered in the system.

### Endpoint
```http
GET /auth/check-email
```

### Description
This endpoint checks whether a given email address is already associated with an existing intern account. It is useful for validating email uniqueness during the registration process.

### Request Schema

#### Query Parameters
| Query Parameter | Type   | Required? | Description                          |
|------------------|--------|-----------|--------------------------------------|
| email            | string | Yes       | The email address to be checked.     |

### Request Example
```http
GET /auth/check-email?email=johndoe@example.com
Content-Type: application/json
```

### Response Example
#### If the email is available:
```json
{
    "message": "Email is available"
}
```

#### If the email is already taken:
```json
{
    "message": "Email already exists"
}
```

## Check Phone Availability
Verify if a phone number is already registered in the system.

### Endpoint
```http
GET /auth/check-phone
```

### Description
This endpoint checks whether a given phone number is already associated with an existing intern account. It is useful for validating phone number uniqueness during the registration process.

### Request Schema

#### Query Parameters
| Query Parameter | Type   | Required? | Description                          |
|------------------|--------|-----------|--------------------------------------|
| phone            | string | Yes       | The phone number to be checked (must be a valid 11-digit number). |

### Request Example
```http
GET /auth/check-phone?phone=09123456789
Content-Type: application/json
```

### Response Example
#### If the phone number is available:
```json
{
    "message": "Phone number is available"
}
```

#### If the phone number is already taken:
```json
{
    "message": "Phone number already exists"
}
```


## Intern
The `Intern` model represents an intern entity in the system. It is used to store and manage information about interns, including their personal details, internship progress, and associated records.

### Schema Definition
The `Intern` schema is defined as follows:

| Field            | Type     | Required? | Description                                      |
|-------------------|----------|-----------|--------------------------------------------------|
| _id              | String   | Yes       | The unique identifier of the intern.            |
| firstName        | String   | Yes       | The first name of the intern.                   |
| lastName         | String   | Yes       | The last name of the intern.                    |
| age              | Number   | Yes       | The age of the intern.                          |
| phone            | String   | Yes       | The intern's phone number (11 digits, unique).  |
| school           | String   | Yes       | The name of the intern's school.                |
| internshipHours  | Number   | Yes       | The total required internship hours.            |
| email            | String   | Yes       | The intern's email address (must be unique).    |
| password         | String   | Yes       | The intern's account password (minimum 8 characters). |
| department       | String   | No        | The ID of the department the intern belongs to. |
| supervisor       | String   | No        | The ID of the supervisor assigned to the intern.|
| status           | String   | No        | The internship status (`active` or `inactive`). |
| timeEntries      | Array    | No        | A list of time-in and time-out records.         |
| accountType      | String   | Yes       | The type of account (always `intern`).          |
| isApproved       | String   | No        | Approval status of the intern (`pending`, `approved`, `rejected`). |
| logs             | Array    | No        | A list of logs associated with the intern.      |
| reportLogs       | Array    | No        | A list of report logs submitted by the intern.  |
| totalHours       | Number   | No        | The total hours completed by the intern (calculated from `timeEntries`). |

#### Time Entries
Each entry in the `timeEntries` array contains:
- `timeIn` (Date): The time the intern clocked in.
- `timeOut` (Date): The time the intern clocked out.

#### Logs
Each entry in the `logs` array contains:
- `taskId` (String): The ID of the associated task.
- `note` (String): A note related to the task.
- `read` (String): The read status (`unread` or `read`).
- `date` (Date): The date the log was created.

#### Report Logs
Each entry in the `reportLogs` array contains:
- `reportId` (String): The ID of the associated report.
- `title` (String): The title of the report.
- `description` (String): The description of the report.
- `feedback` (String): Feedback provided for the report.
- `suggestions` (String): Suggestions for improvement.
- `rating` (Number): A rating between 1 and 10.
- `date` (Date): The date the report was submitted.
- `supervisor` (String): The ID of the supervisor who reviewed the report.

### Example
```json
{
    "_id": "67ebf698b0d4d8143ee09976",
    "firstName": "John",
    "lastName": "Doe",
    "age": 22,
    "phone": "09123456789",
    "school": "Tech University",
    "internshipHours": 200,
    "email": "johndoe@example.com",
    "password": "hashedPassword123",
    "department": "60d5f9e813b5c70017e6e5b1",
    "supervisor": "60d5f9e813b5c70017e6e5b2",
    "status": "active",
    "timeEntries": [
        {
            "timeIn": "2025-03-31T08:00:00.000Z",
            "timeOut": "2025-03-31T17:00:00.000Z"
        }
    ],
    "accountType": "intern",
    "isApproved": "approved",
    "logs": [
        {
            "taskId": "60d5f9e813b5c70017e6e5b3",
            "note": "Completed task 1",
            "read": "read",
            "date": "2025-03-30T10:00:00.000Z"
        }
    ],
    "reportLogs": [
        {
            "reportId": "60d5f9e813b5c70017e6e5b4",
            "title": "Weekly Report",
            "description": "Summary of weekly tasks",
            "feedback": "Great work!",
            "suggestions": "Focus on time management.",
            "rating": 9,
            "date": "2025-03-31T12:00:00.000Z",
            "supervisor": "60d5f9e813b5c70017e6e5b2"
        }
    ],
    "totalHours": 9
}
```
### Authorization

The [Intern Authorization](#intern-login) is required to access this, unless specified otherwise.

### Endpoints

### Endpoints

Use the following endpoints to interact with the Intern entities.

| Method | Endpoint name                            | Description             |
|--------|------------------------------------------|-------------------------|
| GET    | [Get All Interns](#get-all-interns)      | Retrieve a list of all interns in the system. |
| GET    | [Find Interns via Supervisor](#find-interns-via-supervisor) | Filter interns by their assigned supervisor. |
| PUT    | [Update Intern Account Status](#update-intern-account-status) | Update the intern account status by ID. |
| GET    | [Get Inactive Interns](#get-inactive-interns) | Fetch a list of all inactive interns in the system. |
| PUT    | [Update Intern Profile (Self)](#update-intern-profile-self) | Allows an intern to update their own profile details. |
| GET    | [Fetch Intern by ID](#fetch-intern-by-id) | Retrieve the details of a specific intern using their unique identifier. |

## Get All Interns
Retrieve a list of all interns in the system.

### Endpoint
```http
GET /interns/all
```

### Description
This endpoint allows you to fetch an array of all intern accounts currently available in the system. Each intern includes their personal details, internship progress, and associated records. This endpoint is useful for administrators to manage and monitor all interns.

### Request Example
```http
GET /interns/all
Content-Type: application/json
Authorization: Bearer <your-token>
```

### Response Example
```json
{
    "interns": [
        {
            "_id": "67e4cfb72ce2f25a20a12120",
            "firstName": "Francis",
            "lastName": "Grimes",
            "age": 18,
            "phone": "59811976098",
            "school": "Lord Jim",
            "internshipHours": 486,
            "email": "Jennyfer_Goyette34@hotmail.com",
            "department": null,
            "supervisor": "67ca892acd4899978d1b6666",
            "status": "active",
            "logs": [
                {
                    "taskId": "67e4cfb72ce2f25a20a12123",
                    "note": "Voluptate umerus tabesco caelestis acies clementia ambulo trans contra villa.",
                    "read": "read",
                    "_id": "67e4cfb72ce2f25a20a12122",
                    "date": "2025-03-27T04:10:33.460Z"
                }
            ],
            "totalHours": 0
        }
    ]
}
```

## Find Interns via Supervisor
Filter interns by their assigned supervisor.

### Endpoint
```http
GET /interns/find
```

### Description
This endpoint allows you to retrieve a list of interns assigned to a specific supervisor. It is useful for supervisors to monitor and manage the interns under their supervision.

### Request Schema

#### Query Parameters
| Parameter      | Type   | Required? | Description                              |
|----------------|--------|-----------|------------------------------------------|
| supervisor   | string | Yes       | The unique ID of the supervisor.         |

### Request Example
```http
GET /interns/find?supervisor=67ca892acd4899978d1b6666
Content-Type: application/json
Authorization: Bearer <your-token>
```

### Response Example
```json
{
    "interns": [
        {
            "_id": "67ea2a8f86c8971ca1fe27ba",
            "firstName": "John",
            "lastName": "Doe",
            "age": 22,
            "phone": "09123456789",
            "school": "Tech University",
            "internshipHours": 200,
            "email": "johndoe@example.com",
            "department": null,
            "supervisor": "60d5f9e813b5c70017e6e5b2",
            "status": "active",
            "totalHours": 9,
            "logs": []
        }
    ]
}
```

## Update Intern Account Status
Update the intern account status by ID.

### Endpoint
```http
PUT /interns/update-status/:id
```

### Description
This endpoint allows an administrator to update the status of an intern's account. The status can be set to either `active` or `inactive`. This is useful for managing the availability and participation of interns in the system.

### Request Schema

#### Path Parameters
| Path Parameter | Type   | Required? | Description                              |
|----------------|--------|-----------|------------------------------------------|
| id             | string | Yes       | The unique identifier of the intern.     |


### Request Example
```http
PUT /interns/update-status/67e4cfb72ce2f25a20a12120
Content-Type: application/json
```

### Response Example
#### If the update is successful:
```json
{
    "success": true,
    "message": "Intern status successfully updated to 'active'",
    "intern": {
        "_id": "67ebf698b0d4d8143ee09976",
        "firstName": "John",
        "lastName": "Doe",
        "age": 22,
        "phone": "09123456782",
        "school": "Tech University",
        "internshipHours": 200,
        "email": "johndoes@example.com",
        "password": "$2b$10$uPI6HELQHLLszjjCgbk/VeHmYtZ.RYSmn0ahgjxEKPxBdGCNOYkfu",
        "department": null,
        "supervisor": null,
        "status": "active",
        "timeEntries": [
            {
                "timeIn": "2025-03-31T08:00:00.000Z",
                "timeOut": "2025-03-31T17:00:00.000Z",
                "_id": "67ebf698b0d4d8143ee09977"
            }
        ],
        "accountType": "intern",
        "isApproved": "pending",
        "totalHours": 9,
        "logs": [],
        "reportLogs": [],
        "__v": 0
    }
}
```

#### If the intern is not found:
```json
{
    "success": false,
    "message": "Intern not found"
}
```

## Get Inactive Interns
Fetch a list of all inactive interns in the system.

### Endpoint
```http
GET /interns/inactive-interns
```

### Description
This endpoint allows administrators to retrieve a list of all interns whose accounts are marked as `inactive`. It is useful for monitoring interns who are not currently participating in the internship program or have been temporarily deactivated.

### Request Example
```http
GET /interns/inactive-interns
Content-Type: application/json
Authorization: Bearer <your-token>
```

### Response Example
```json
{
    "success": true,
    "count": 1,
    "interns": [
        {
            "_id": "67ebf698b0d4d8143ee09976",
            "firstName": "John",
            "lastName": "Doe",
            "age": 22,
            "phone": "09123456782",
            "school": "Tech University",
            "email": "johndoes@example.com",
            "department": null,
            "status": "inactive"
        }
    ]
}
```

## Update Intern Profile (Self)
Allows an intern to update their own profile details.

### Endpoint
```http
PUT /interns/update-profile/:id
```

### Description
This endpoint allows an intern to update their own profile information, such as personal details, school information, or contact details. It ensures that interns can keep their profiles up to date.

### Request Schema
#### Path parameters

{This section is optional.}

| Path parameter | Type   | Required? | Description                  |
|----------------|--------|-----------|------------------------------|
| id           | string | Required  | Unique identifier of the intern  |
|                |        |           |                              |

#### Request Body
| Field      | Type     | Required? | Description                                      |
|------------|----------|-----------|--------------------------------------------------|
| id         | string   | No        | The unique identifier of the intern (optional). |
| firstName  | string   | No        | The first name of the intern.                   |
| lastName   | string   | No        | The last name of the intern.                    |
| phone      | string   | No        | The intern's phone number.                      |
| email      | string   | No        | The intern's email address (must be valid).     |
| password   | string   | No        | The intern's account password (minimum 8 characters). |


### Request Example
```http
PUT /interns/update-profile/67ebf698b0d4d8143ee09976
Content-Type: application/json
Authorization: Bearer <your-token>

{
    "firstName": "John",
    "lastName": "Smith",
    "phone": "09123456781",
    "email": "johnsmith@example.com"
}
```

### Response Example
```json
{
    "success": true,
    "message": "Intern profile updated successfully",
    "data": {
        "_id": "67ebf698b0d4d8143ee09976",
        "firstName": "John",
        "lastName": "Smith",
        "age": 22,
        "phone": "09123456781",
        "school": "Tech University",
        "internshipHours": 200,
        "email": "johnsmith@example.com",
        "department": null,
        "supervisor": null,
        "status": "inactive",
        "timeEntries": [
            {
                "timeIn": "2025-03-31T08:00:00.000Z",
                "timeOut": "2025-03-31T17:00:00.000Z",
                "_id": "67ebf698b0d4d8143ee09977"
            }
        ],
        "accountType": "intern",
        "isApproved": "pending",
        "totalHours": 9,
        "logs": [],
        "reportLogs": [],
        "__v": 0
    }
}
```

## Fetch Intern by ID
Retrieve the details of a specific intern using their unique identifier.

### Endpoint
```http
GET /interns/get-intern/:id
```

### Description
This endpoint allows you to fetch detailed information about a specific intern by providing their unique ID. It is useful for administrators or supervisors to view an intern's profile, progress, and associated records.

### Request Schema

#### Path Parameters
| Parameter | Type   | Required? | Description                              |
|-----------|--------|-----------|------------------------------------------|
| id        | string | Yes       | The unique identifier of the intern.     |

### Request Example
```http
GET /interns/get-intern/67ebf698b0d4d8143ee09976
Content-Type: application/json
Authorization: Bearer <your-token>
```

### Response Example
#### If the intern is found:
```json
{
    "success": true,
    "data": {
        "_id": "67ebf698b0d4d8143ee09976",
        "firstName": "John",
        "lastName": "Smith",
        "age": 22,
        "phone": "09123456781",
        "school": "Tech University",
        "internshipHours": 200,
        "email": "johnsmith@example.com",
        "department": null,
        "supervisor": null,
        "status": "inactive",
        "timeEntries": [
            {
                "timeIn": "2025-03-31T08:00:00.000Z",
                "timeOut": "2025-03-31T17:00:00.000Z",
                "_id": "67ebf698b0d4d8143ee09977"
            }
        ],
        "accountType": "intern",
        "isApproved": "pending",
        "totalHours": 9,
        "logs": [],
        "reportLogs": [],
        "__v": 0
    }
}
```

#### If the intern is not found:
```json
{
    "success": false,
    "message": "Intern not found"
}
```

## Update Log Status
Update the status of a specific log entry.

### Endpoint
```http
PUT /interns/logs/:logId
```

### Description
This endpoint updates the `read` status of a specific log entry in their logs. Logs are generated whenever an intern updates or changes the status of a task. This functionality ensures that logs can be marked as read or unread as needed.

### Request Schema
#### Path Parameters
| Parameter | Type   | Required? | Description                              |
|-----------|--------|-----------|------------------------------------------|
| logId     | string | Yes       | The unique identifier of the log entry.  |

#### Request Body
| Field  | Type   | Required? | Description                      |
|--------|--------|-----------|----------------------------------|
| read   | string | Yes       | Indicates the status of the log. Acceptable values are `read` or `unread`. |

### Request Example
```http
PUT /interns/logs/67e4cfb72ce2f25a20a1211e
Content-Type: application/json
Authorization: Bearer <your-token>

{
    "read": "unread"
}
```

### Response Example
#### If the update is successful:
```json
{
    "taskId": "67e4cfb72ce2f25a20a1211f",
    "note": "Ager quas volup magnam unus condico tenax ventito creo accusamus.",
    "read": "unread",
    "_id": "67e4cfb72ce2f25a20a1211e",
    "date": "2025-03-27T04:10:33.459Z"
}
```

#### If the log is not found:
```json
{
    "message": "Unable to find specific log"
}
```

## Password Reset
Collection of endpoints used for resetting the password via email

### Endpoints


| Method | Endpoint Name                            | Description                          |
|--------|------------------------------------------|--------------------------------------|
| POST   | [Get Password Reset Link](#get-password-reset-link) | Request a password reset link for an intern account. |
| PUT    | [Reset Password](#reset-password)        | Reset the password using the token received via email. |


## Get Password Reset Link
Request a password reset link for an intern account.

### Endpoint
```http
POST /password/intern/reset
```

### Description
This endpoint allows an intern to request a password reset link. The link will be sent to the email address associated with the intern's account. It is useful for recovering access to an account when the password is forgotten.

### Request Schema

#### Request Body
| Field  | Type   | Required? | Description                      |
|--------|--------|-----------|----------------------------------|
| email  | string | Yes       | The email address of the intern. |

### Request Example
```http
POST /password/intern/reset
Content-Type: application/json

{
    "email": "johndoe@example.com"
}
```

### Response Example
#### If the request is successful:
```json
{
    "message": "Password reset link sent successfully"
}
```

#### If the email is not found:
```json
{
    "message":"No account found"
}
```

## Reset Password
Reset password using the token received via email

### Endpoint
```http
PUT /password/intern/new
```

### Description
This endpoint allows an intern to reset their password using a token received via email. It is typically used after requesting a password reset link.

### Request Schema

#### Request Body
| Field       | Type   | Required? | Description                                      |
|-------------|--------|-----------|--------------------------------------------------|
| token       | string | Yes       | The password reset token sent to the intern's email. |
| password | string | Yes       | The new password for the intern's account (minimum 8 characters). |

### Request Example
```http
PUT /password/intern/new
Content-Type: application/json

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "password": "newSecurePassword123"
}
```

### Response Example
#### If the password reset is successful:
```json
{

     "message": "Successfully updated password" 
}
```

#### If the token is invalid or expired:
```json
{
    "message": "Invalid or expired token"
}
```

















