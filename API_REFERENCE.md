# OJT Management API Documentation

## Overview

The `OJT Management` APIs provide powerful tools to streamline and enhance your internship management processes. These APIs enable seamless integration with the system, allowing you to efficiently build, extend, and optimize workflows tailored to your needs.

### Base URL

```text
http://localhost:3000
```

### HTTP Status Codes

The following table outlines common HTTP status codes used in the **OJT Management API**:

| Status Code                 | Message                  | Description                                                                                   |
| --------------------------- | ------------------------ | --------------------------------------------------------------------------------------------- |
| `200 OK`                    | Request succeeded.       | The request was successfully processed.                                                       |
| `201 Created`               | Resource created.        | A new resource has been successfully created.                                                 |
| `400 Bad Request`           | Invalid request.         | The server could not understand the request due to invalid syntax.                            |
| `401 Unauthorized`          | Authentication required. | The request requires valid user authentication.                                               |
| `403 Forbidden`             | Access denied.           | The server understood the request but refuses to authorize it.                                |
| `404 Not Found`             | Resource not found.      | The requested resource could not be found on the server.                                      |
| `500 Internal Server Error` | Server error.            | The server encountered an unexpected condition that prevented it from fulfilling the request. |

### Rate Limiting and Throttling

To ensure fair usage and maintain system performance, the **OJT Management API** enforces the following rate limits:

- **Limit**: 100 requests per 15-minute window.
- **Exceeding the Limit**: Requests exceeding this limit will receive a `429 Too Many Requests` response.

For optimal performance, consider implementing retry logic with exponential backoff in your client application.

---

## Table of Contents

| Resource                                    | Description                                       |
| ------------------------------------------- | ------------------------------------------------- |
| [Login Endpoints](#login-endpoints)         | APIs for user authentication and login.           |
| [Admin Endpoints](#admin-user)              | APIs for managing admin accounts and resources.   |
| [Department Endpoints](#department)         | APIs for managing department-related operations.  |
| [Interns Auth Endpoints](#interns-auth)     | APIs for intern registration and validation.      |
| [Intern Endpoints](#intern)                 | APIs for managing intern accounts and activities. |
| [Password Reset Endpoints](#password-reset) | APIs for password recovery and reset.             |
| [Supervisor Endpoints](#supervisor)         | APIs for managing supervisor accounts and tasks.  |
| [Task Endpoints](#task)                     | APIs for creating, updating, and managing tasks.  |
| [Task Updates (WebSockets)](#task-updates)  | Real-time updates for task status changes.        |
| [File Endpoints](#files)                    | APIs for uploading and managing files.            |
| [Health Status Endpoint](#healthcheck)      | API for accessing the health status of the system |

## Login Endpoints

endpoints for logging in the supervisors, admin and interns

### Data Model

| Attribute | Type   | Required? | Description                                    |
| --------- | ------ | --------- | ---------------------------------------------- |
| message   | string | Required  | A message caused by the event                  |
| token     | string | Required  | A jwt token to be used for protected endpoints |

### Endpoints

| Method | Endpoint Name                         | Description                                                               |
| ------ | ------------------------------------- | ------------------------------------------------------------------------- |
| POST   | [Admin Login](#admin-login)           | Authenticates an admin and generates a jwt token.                         |
| POST   | [Supervisor Login](#supervisor-login) | Authenticates a supervisor and grants access to their dashboard.          |
| POST   | [Intern Login](#intern-login)         | Authenticates an intern and provides access to intern-specific resources. |

## Admin Login

```http
POST /a2kstaffs/login/admin
```

### Request schema

#### Request body

| Field    | Type   | Required? | Description                    |
| -------- | ------ | --------- | ------------------------------ |
| email    | string | Required  | The email of the admin user    |
| password | string | Required  | The password of the admin user |

### Request example

```json
{
  "email": "admin@admin.com",
  "password": "12345678"
}
```

### Response schema

| Status code | Schema                                    | Description                                          |
| ----------- | ----------------------------------------- | ---------------------------------------------------- |
| `2xx`       | [Data Model](#login-endpoints/data-model) | The request was successful, and a token is returned. |

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

| Field    | Type   | Required? | Description          |
| -------- | ------ | --------- | -------------------- |
| email    | string | Required  | Email of the user    |
| password | string | Required  | Password of the user |

### Request example

```json
{
  "email": "sup@sup.com",
  "password": "12345678"
}
```

### Response schema

| Status code | Schema                                    | Description                                       |
| ----------- | ----------------------------------------- | ------------------------------------------------- |
| `2xx`       | [Data Model](#login-endpoints/data-model) | {Describe the result where the request succeeds.} |

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

| Field    | Type   | Required? | Description          |
| -------- | ------ | --------- | -------------------- |
| email    | string | Required  | Email of the user    |
| password | string | Required  | Password of the user |

### Request example

```json
{
  "email": "foo@foo.com",
  "password": "12345678"
}
```

### Response schema

| Status code | Schema                                    | Description                                       |
| ----------- | ----------------------------------------- | ------------------------------------------------- |
| `2xx`       | [Data Model](#login-endpoints/data-model) | {Describe the result where the request succeeds.} |

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

| Method | Endpoint Name                                            | Description                              |
| ------ | -------------------------------------------------------- | ---------------------------------------- |
| GET    | [Find admin](#find-admin)                                | Retrieves admin details                  |
| GET    | [Get all accounts](#get-all-accounts)                    | Retrieves all user accounts.             |
| POST   | [Create intern account](#create-intern-account)          | Creates a new intern account.            |
| GET    | [Requesting interns](#fetch-intern-request)              | Fetches pending intern requests.         |
| PUT    | [Update an intern request status](#update-admin-profile) | Updates the status of an intern request. |
| GET    | [Get admin by ID](#get-admin-by-id)                      | Retrieves admin details by ID.           |

## Find Admin

### Endpoint

```text
GET /admin/find
```

### Description

This endpoint retrieves a specific admin account by email. It returns the admin's information excluding the password. If no matching account is found, it responds with an appropriate error message.

### Request Schema

### Query Parameters

| Query parameter | Type   | Required? | Description                                 |
| --------------- | ------ | --------- | ------------------------------------------- |
| email           | string | Required  | The email of the admin account to retrieve. |

### Request Example

```http
GET /admin/find
Content-Type: application/json

{
  "email": "admin@example.com"
}
```

### Response Example

### If the admin exists:

```json
{
  "_id": "67ce401b52ed9460ae35f74a",
  "firstName": "Alice",
  "lastName": "Smith",
  "email": "alice@example.com",
  "accountType": "admin"
}
```

### If the admin does not exists:

```json
{
  "message": "No account found"
}
```

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

| Query parameter | Type   | Required? | Description                                      |
| --------------- | ------ | --------- | ------------------------------------------------ |
| q               | string | Optional  | Filter accounts by name, email, status, or type. |

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

| Field           | Type   | Required? | Description                             |
| --------------- | ------ | --------- | --------------------------------------- |
| firstName       | string | Yes       | Intern’s first name.                    |
| lastName        | string | Yes       | Intern’s last name.                     |
| age             | number | Yes       | Intern’s age.                           |
| phone           | string | Yes       | 11-digit phone number.                  |
| school          | string | Yes       | Name of the intern’s school.            |
| internshipHours | number | Yes       | Required internship hours.              |
| email           | string | Yes       | Intern’s email address.                 |
| password        | string | Yes       | Account password.                       |
| department      | string | No        | Hexadecimal 24-character department ID. |
| supervisor      | string | No        | Hexadecimal 24-character supervisor ID. |
| status          | string | No        | Internship status (active or inactive). |
| timeEntries     | array  | No        | List of time-in and time-out records.   |
| totalHours      | number | No        | Total hours completed.                  |

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
      "status": "approved"
    }
  ]
}
```

## Update an Intern Request Status

Approve or reject an intern's account request.

### Endpoint

```http
PUT /admin/accounts/intern-request
```

### Description

This endpoint allows an admin user to update the status of an intern's request. The status can be set to:

- Approved – Grants the intern access to the system.

- Rejected – Denies the intern’s request and prevents account activation.

This ensures that only verified interns are approved while filtering out unqualified or invalid requests.

### Request Schema

#### Request body

| Field      | Type    | Required? | Description                                |
| ---------- | ------- | --------- | ------------------------------------------ |
| internId   | string  | Yes       | Hexadecimal 24-character intern ID.        |
| isApproved | boolean | Yes       | [false, true] Request status of the intern |

### Request example

```http
PUT /admin/accounts/intern-request
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

| Path parameter | Type   | Required? | Description                        |
| -------------- | ------ | --------- | ---------------------------------- |
| id             | string | Yes       | Hexadecimal 24-character admin id. |

#### Request body

| Field     | Type   | Required? | Description                                    |
| --------- | ------ | --------- | ---------------------------------------------- |
| id        | string | Yes       | Unique identifier of the admin.                |
| firstName | string | No        | Admin’s first name.                            |
| lastName  | string | No        | Admin’s last name.                             |
| email     | string | No        | Admin’s email address (must be a valid email). |
| password  | string | No        | Admin’s password (minimum 8 characters).       |

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

| Path parameter | Type   | Required? | Description                        |
| -------------- | ------ | --------- | ---------------------------------- |
| id             | string | Yes       | Hexadecimal 24-character admin id. |

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

| Field | Type   | Required | Unique | Description                              |
| ----- | ------ | -------- | ------ | ---------------------------------------- |
| \_id  | String | Yes      | Yes    | The unique identifier of the department. |
| name  | String | Yes      | Yes    | The name of the department.              |

### Example

```json
{
  "_id": "642c1f9e8f1b2c0012345678",
  "name": "Human Resources"
}
```

### Endpoints

Use the following endpoints to interact with the {resource name} entities.

| Method | Endpoint name                                 | Description                                         |
| ------ | --------------------------------------------- | --------------------------------------------------- |
| GET    | {[Get All Departments](#get-all-departments)} | Retrieves a list of all departments in the system.. |

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

| Method | Endpoint name                                         | Description                                                     |
| ------ | ----------------------------------------------------- | --------------------------------------------------------------- |
| POST   | [Register Intern](#register-intern)                   | An endpoint for creating intern accounts.                       |
| GET    | [Check Email Availability](#check-email-availability) | Verify if an email address is already registered in the system. |
| GET    | [Check Phone Availability](#check-phone-availability) | Verify if a phone number is already registered in the system.   |

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

| Field           | Type   | Required? | Description                                   |
| --------------- | ------ | --------- | --------------------------------------------- |
| firstName       | string | Yes       | Intern’s first name.                          |
| lastName        | string | Yes       | Intern’s last name.                           |
| age             | number | Yes       | Intern’s age.                                 |
| phone           | string | Yes       | 11-digit phone number.                        |
| school          | string | Yes       | Name of the intern’s school.                  |
| internshipHours | number | Yes       | Required internship hours.                    |
| email           | string | Yes       | Intern’s email address (must be unique).      |
| password        | string | Yes       | Account password (minimum 8 characters).      |
| department      | string | No        | Hexadecimal 24-character department ID.       |
| supervisor      | string | No        | Hexadecimal 24-character supervisor ID.       |
| status          | string | No        | Internship status (e.g., active or inactive). |
| timeEntries     | array  | No        | List of time-in and time-out records.         |
| totalHours      | number | No        | Total hours completed by the intern.          |

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

| Query Parameter | Type   | Required? | Description                      |
| --------------- | ------ | --------- | -------------------------------- |
| email           | string | Yes       | The email address to be checked. |

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

| Query Parameter | Type   | Required? | Description                                                       |
| --------------- | ------ | --------- | ----------------------------------------------------------------- |
| phone           | string | Yes       | The phone number to be checked (must be a valid 11-digit number). |

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

| Field           | Type   | Required? | Description                                                              |
| --------------- | ------ | --------- | ------------------------------------------------------------------------ |
| \_id            | String | Yes       | The unique identifier of the intern.                                     |
| firstName       | String | Yes       | The first name of the intern.                                            |
| lastName        | String | Yes       | The last name of the intern.                                             |
| age             | Number | Yes       | The age of the intern.                                                   |
| phone           | String | Yes       | The intern's phone number (11 digits, unique).                           |
| school          | String | Yes       | The name of the intern's school.                                         |
| internshipHours | Number | Yes       | The total required internship hours.                                     |
| email           | String | Yes       | The intern's email address (must be unique).                             |
| password        | String | Yes       | The intern's account password (minimum 8 characters).                    |
| department      | String | No        | The ID of the department the intern belongs to.                          |
| supervisor      | String | No        | The ID of the supervisor assigned to the intern.                         |
| status          | String | No        | The internship status (`active` or `inactive`).                          |
| timeEntries     | Array  | No        | A list of time-in and time-out records.                                  |
| accountType     | String | Yes       | The type of account (always `intern`).                                   |
| isApproved      | String | No        | Approval status of the intern (`pending`, `approved`, `rejected`).       |
| logs            | Array  | No        | A list of logs associated with the intern.                               |
| reportLogs      | Array  | No        | A list of report logs submitted by the intern.                           |
| totalHours      | Number | No        | The total hours completed by the intern (calculated from `timeEntries`). |

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

| Method | Endpoint name                                                 | Description                                                              |
| ------ | ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| GET    | [Get All Interns](#get-all-interns)                           | Retrieve a list of all interns in the system.                            |
| GET    | [Find Interns via Supervisor](#find-interns-via-supervisor)   | Filter interns by their assigned supervisor.                             |
| PUT    | [Update Intern Account Status](#update-intern-account-status) | Update the intern account status by ID.                                  |
| GET    | [Get Inactive Interns](#get-inactive-interns)                 | Fetch a list of all inactive interns in the system.                      |
| PUT    | [Update Intern Profile (Self)](#update-intern-profile-self)   | Allows an intern to update their own profile details.                    |
| GET    | [Fetch Intern by ID](#fetch-intern-by-id)                     | Retrieve the details of a specific intern using their unique identifier. |

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

| Parameter  | Type   | Required? | Description                      |
| ---------- | ------ | --------- | -------------------------------- |
| supervisor | string | Yes       | The unique ID of the supervisor. |

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

| Path Parameter | Type   | Required? | Description                          |
| -------------- | ------ | --------- | ------------------------------------ |
| id             | string | Yes       | The unique identifier of the intern. |

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
PUT /interns/update-intern/:id
```

### Description

This endpoint allows an intern to update their own profile information, such as personal details, school information, or contact details. It ensures that interns can keep their profiles up to date.

### Request Schema

#### Path parameters

{This section is optional.}

| Path parameter | Type   | Required? | Description                     |
| -------------- | ------ | --------- | ------------------------------- |
| id             | string | Required  | Unique identifier of the intern |
|                |        |           |                                 |

#### Request Body

| Field     | Type   | Required? | Description                                           |
| --------- | ------ | --------- | ----------------------------------------------------- |
| id        | string | No        | The unique identifier of the intern (optional).       |
| firstName | string | No        | The first name of the intern.                         |
| lastName  | string | No        | The last name of the intern.                          |
| phone     | string | No        | The intern's phone number.                            |
| email     | string | No        | The intern's email address (must be valid).           |
| password  | string | No        | The intern's account password (minimum 8 characters). |

### Request Example

```http
PUT /interns/update-intern/67ebf698b0d4d8143ee09976
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

| Parameter | Type   | Required? | Description                          |
| --------- | ------ | --------- | ------------------------------------ |
| id        | string | Yes       | The unique identifier of the intern. |

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

| Parameter | Type   | Required? | Description                             |
| --------- | ------ | --------- | --------------------------------------- |
| logId     | string | Yes       | The unique identifier of the log entry. |

#### Request Body

| Field | Type   | Required? | Description                                                                |
| ----- | ------ | --------- | -------------------------------------------------------------------------- |
| read  | string | Yes       | Indicates the status of the log. Acceptable values are `read` or `unread`. |

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

| Method | Endpoint Name                                       | Description                                            |
| ------ | --------------------------------------------------- | ------------------------------------------------------ |
| POST   | [Get Password Reset Link](#get-password-reset-link) | Request a password reset link for your account.        |
| PUT    | [Reset Password](#reset-password)                   | Reset the password using the token received via email. |

## Get Password Reset Link

Request a password reset link for an intern account.

### Endpoint

```http
POST /password/reset
```

### Description

This endpoint allows an intern to request a password reset link. The link will be sent to the email address associated with the intern's account. It is useful for recovering access to an account when the password is forgotten.

### Request Schema

#### Request Body

| Field | Type   | Required? | Description                    |
| ----- | ------ | --------- | ------------------------------ |
| email | string | Yes       | The email address of the user. |

### Request Example

```http
POST /password/reset
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
  "message": "No account found"
}
```

## Reset Password

Reset password using the token received via email

### Endpoint

```http
PUT /password/new
```

### Description

This endpoint allows an intern to reset their password using a token received via email. It is typically used after requesting a password reset link.

### Request Schema

#### Request Body

| Field    | Type   | Required? | Description                                                       |
| -------- | ------ | --------- | ----------------------------------------------------------------- |
| token    | string | Yes       | The password reset token sent to the intern's email.              |
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

## Supervisor

The `Supervisor` model represents a supervisor entity in the system. It is used to store and manage information about supervisors, including their personal details and the interns they oversee.

### Schema Definition

The `Supervisor` schema is defined as follows:

| Field           | Type   | Required? | Description                                                    |
| --------------- | ------ | --------- | -------------------------------------------------------------- |
| \_id            | String | Yes       | The unique identifier of the supervisor.                       |
| firstName       | String | Yes       | The first name of the supervisor.                              |
| lastName        | String | Yes       | The last name of the supervisor.                               |
| age             | Number | Yes       | The age of the supervisor.                                     |
| email           | String | Yes       | The supervisor's email address (must be unique).               |
| password        | String | Yes       | The supervisor's account password (minimum 8 characters).      |
| department      | String | No        | The ID of the department the supervisor belongs to.            |
| assignedInterns | Array  | No        | A list of intern IDs assigned to the supervisor.               |
| status          | String | No        | The current status of the supervisor (e.g., active, inactive). |
| accountType     | String | No        | The type of account (always `supervisor`).                     |

### Example

```json
{
  "_id": "67ca892acd4899978d1b6666",
  "firstName": "Jane",
  "lastName": "Doe",
  "age": 35,
  "email": "janedoe@example.com",
  "password": "hashedPassword123",
  "department": "60d5f9e813b5c70017e6e5b1",
  "assignedInterns": ["67ebf698b0d4d8143ee09976", "67ea2a8f86c8971ca1fe27ba"],
  "status": "active",
  "accountType": "supervisor"
}
```

### Endpoints

Use the following endpoints to interact with the Supervisor entities.

| Method | Endpoint Name                                                 | Description                                                                  |
| ------ | ------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| GET    | [Get All Supervisors](#get-all-supervisors)                   | Retrieve a list of all supervisors in the system.                            |
| GET    | [Fetch Supervisor by ID](#fetch-supervisor-by-id)             | Retrieve the details of a specific supervisor using their unique identifier. |
| PUT    | [Update Supervisor Profile](#update-supervisor-profile)       | Update the profile details of a supervisor.                                  |
| POST   | [Register Supervisor](#register-supervisor)                   | Create a new supervisor account in the system.                               |
| PUT    | [Update Supervisor Status](#update-supervisor-status)         | Update the status of a supervisor account.                                   |
| POST   | [Create Report](#create-report)                               | Create a detailed report for an intern.                                      |
| GET    | [Get Reports for an Intern](#get-reports-for-an-intern)       | Retrieve all reports created for a specific intern.                          |
| PUT    | [Update Reports for an Intern](#update-reports-for-an-intern) | Update the report details for a specific intern.                             |
| DELETE | [Delete Reports for an Intern](#delete-reports-for-an-intern) | Delete the report of a specific intern.                                      |

## Get All Supervisors

Retrieve a list of all supervisors in the system.

### Endpoint

```http
GET /supervisors/all
```

### Description

This endpoint allows administrators to fetch an array of all supervisors currently available in the system. Each supervisor includes their personal details and the interns they oversee.

### Request Example

```http
GET /supervisors/all
Content-Type: application/json
Authorization: Bearer <your-token>
```

### Response Example

```json
{
  "supervisors": [
    {
      "_id": "67ca892acd4899978d1b6666",
      "firstName": "maria",
      "lastName": "mercedes",
      "age": 30,
      "email": "sup@sup.com",
      "assignedInterns": [
        "67e4cfb72ce2f25a20a1211c",
        "67e4cfb72ce2f25a20a12120"
      ],
      "department": {
        "_id": "67ca8a7f536daacf28d2940c",
        "name": "IT",
        "__v": 0
      },
      "accountType": "supervisor",
      "status": "active"
    }
  ]
}
```

## Fetch Supervisor by ID

Retrieve the details of a specific supervisor using their unique identifier.

### Endpoint

```http
GET /supervisors/get-supervisor/:id
```

### Description

This endpoint allows you to fetch detailed information about a specific supervisor by providing their unique ID. It is useful for administrators to view a supervisor's profile and the interns they oversee.

### Request Schema

#### Path Parameters

| Parameter | Type   | Required? | Description                              |
| --------- | ------ | --------- | ---------------------------------------- |
| id        | string | Yes       | The unique identifier of the supervisor. |

### Request Example

```http
GET /supervisors/get-supervisor/67ca892acd4899978d1b6666
Content-Type: application/json
Authorization: Bearer <your-token>
```

### Response Example

```json
{
  "success": true,
  "data": {
    "_id": "67ca892acd4899978d1b6666",
    "firstName": "maria",
    "lastName": "mercedes",
    "age": 30,
    "email": "sup@sup.com",
    "password": "$2a$10$uSIVbf8cjV.vw.dO62/Di.1acSP4SnxbxSzcBTH5dprzb/bkjwyRq",
    "assignedInterns": [
      {
        "_id": "67e4cfb72ce2f25a20a1211c",
        "firstName": "Erna",
        "lastName": "Mosciski"
      },
      {
        "_id": "67e4cfb72ce2f25a20a12120",
        "firstName": "Francis",
        "lastName": "Grimes"
      }
    ],
    "department": {
      "_id": "67ca8a7f536daacf28d2940c",
      "name": "IT"
    },
    "accountType": "supervisor",
    "__v": 0,
    "status": "active",
    "departmentName": "IT",
    "assignedInternsFullNames": [
      {
        "_id": "67e4cfb72ce2f25a20a1211c",
        "fullName": "Erna Mosciski"
      },
      {
        "_id": "67e4cfb72ce2f25a20a12120",
        "fullName": "Francis Grimes"
      }
    ]
  }
}
```

## Register Supervisor

An endpoint for registering a supervisor.

### Endpoint

```http
POST /supervisors/register
```

### Description

This endpoint allows the creation of a new supervisor account in the system. The supervisor account will include personal details and optional fields such as department and assigned interns. The account will be stored in the database and can be used for managing interns and overseeing their progress.

### Request Schema

#### Request Body

| Field             | Type     | Required? | Description                                                 |
| ----------------- | -------- | --------- | ----------------------------------------------------------- |
| `firstName`       | `string` | Yes       | The first name of the supervisor.                           |
| `lastName`        | `string` | Yes       | The last name of the supervisor.                            |
| `age`             | `number` | Yes       | The age of the supervisor.                                  |
| `email`           | `string` | Yes       | The supervisor's email address (must be unique).            |
| `password`        | `string` | Yes       | The account password (minimum 8 characters).                |
| `department`      | `string` | No        | The unique ID of the department (24-character hexadecimal). |
| `assignedInterns` | `array`  | No        | A list of intern IDs assigned to the supervisor.            |
| `status`          | `string` | No        | The account status (e.g., `active` or `inactive`).          |
| `accountType`     | `string` | Yes       | The type of account (always `supervisor`).                  |

### Request Example

```http
POST /supervisors/register
Content-Type: application/json

{
    "firstName": "Jane",
    "lastName": "Doe",
    "age": 35,
    "email": "janedoe@example.com",
    "password": "securePassword123",
    "department": "60d5f9e813b5c70017e6e5b1",
    "assignedInterns": [
        "67ebf698b0d4d8143ee09976",
        "67ea2a8f86c8971ca1fe27ba"
    ],
    "status": "active",
    "accountType": "supervisor"
}
```

### Response Example

#### If the registration is successful:

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "age": 35,
  "email": "janedoes@example.com",
  "assignedInterns": ["67ebf698b0d4d8143ee09976", "67ea2a8f86c8971ca1fe27ba"],
  "status": "active",
  "department": "67ecebe3b69866e59673ed4e",
  "accountType": "supervisor",
  "_id": "67ecec14b69866e59673ed6f"
}
```

#### If the email is already taken:

```json
{
  "message": "Email already exists"
}
```

## Update Supervisor Profile

Update the profile details of a supervisor.

### Endpoint

```http
PUT /supervisors/update-supervisor/:id
```

### Description

This endpoint allows a supervisor to update their profile information, such as their name, email, or phone number. It ensures that supervisors can maintain accurate and up-to-date profiles.

### Request Schema

#### Path Parameters

| Parameter | Type   | Required? | Description                              |
| --------- | ------ | --------- | ---------------------------------------- |
| id        | string | Yes       | The unique identifier of the supervisor. |

#### Request Body

| Field             | Type     | Required? | Description                                                 |
| ----------------- | -------- | --------- | ----------------------------------------------------------- |
| `firstName`       | `string` | No        | The first name of the supervisor.                           |
| `lastName`        | `string` | No        | The last name of the supervisor.                            |
| `age`             | `number` | No        | The age of the supervisor.                                  |
| `email`           | `string` | No        | The supervisor's email address (must be unique).            |
| `password`        | `string` | No        | The account password (minimum 8 characters).                |
| `department`      | `string` | No        | The unique ID of the department (24-character hexadecimal). |
| `assignedInterns` | `array`  | No        | A list of intern IDs assigned to the supervisor.            |
| `status`          | `string` | No        | The account status (e.g., `active` or `inactive`).          |
| `accountType`     | `string` | No        | The type of account (always `supervisor`).                  |

### Request Example

```http
PUT /supervisors/update-supervisor/67ca892acd4899978d1b6666
Content-Type: application/json
Authorization: Bearer <your-token>

{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "janesmith@example.com",
    "phone": "09123456780"
}
```

### Response Example

```json
{
  "success": true,
  "message": "Supervisor profile updated successfully",
  "data": {
    "_id": "67ca892acd4899978d1b6666",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "janesmith@example.com",
    "phone": "09123456780",
    "department": "60d5f9e813b5c70017e6e5b1",
    "interns": ["67ebf698b0d4d8143ee09976", "67ea2a8f86c8971ca1fe27ba"]
  }
}
```

## Update Supervisor Status

Update the status of a supervisor account.

### Endpoint

```http
PUT /supervisors/update-status/:id
```

### Description

This endpoint allows administrators to update the status of a supervisor's account. The status can be set to either `active` or `inactive`. This is useful for managing the availability and participation of supervisors in the system.

### Request Schema

#### Path Parameters

| Parameter | Type   | Required? | Description                              |
| --------- | ------ | --------- | ---------------------------------------- |
| id        | string | Yes       | The unique identifier of the supervisor. |

#### Request Body

| Field  | Type   | Required? | Description                                                                 |
| ------ | ------ | --------- | --------------------------------------------------------------------------- |
| status | string | Yes       | The new status of the supervisor. Valid options are `active` or `inactive`. |

### Request Example

```http
PUT /supervisors/update-status/67ca892acd4899978d1b6666
Content-Type: application/json

{
    "status": "inactive"
}
```

### Response Example

#### If the update is successful:

```json
{
  "success": true,
  "message": "Supervisor status successfully updated to 'inactive'",
  "supervisor": {
    "_id": "67ecec14b69866e59673ed6f",
    "firstName": "Jane",
    "lastName": "Doe",
    "age": 35,
    "email": "janedoes@example.com",
    "password": "$2b$10$KauLmqRPxPRwTE8Ry.enBeVSOjX.mME4KJATllZZpe2Ti.CcETXBy",
    "assignedInterns": ["67ebf698b0d4d8143ee09976", "67ea2a8f86c8971ca1fe27ba"],
    "status": "inactive",
    "department": "67ecebe3b69866e59673ed4e",
    "accountType": "supervisor",
    "__v": 0
  }
}
```

#### If the supervisor is not found:

```json
{
  "success": false,
  "message": "Supervisor not found"
}
```

## Create Report

An endpoint for supervisors to create a report for an intern.

### Endpoint

```http
POST /supervisors/create-report/:id
```

### Description

This endpoint allows a supervisor to create a detailed report for a specific intern. The report includes feedback, suggestions, and a performance rating. It is useful for tracking the intern's progress and providing actionable insights for improvement.

### Request Schema

#### Path Parameters

| Parameter | Type   | Required? | Description                          |
| --------- | ------ | --------- | ------------------------------------ |
| id        | string | Yes       | The unique identifier of the intern. |

#### Request Body

| Field       | Type   | Required? | Description                                         |
| ----------- | ------ | --------- | --------------------------------------------------- |
| title       | string | Yes       | The title of the report.                            |
| description | string | Yes       | A detailed description of the intern's performance. |
| feedback    | string | Yes       | Feedback provided by the supervisor.                |
| suggestions | string | No        | Suggestions for improvement, if any.                |
| rating      | number | Yes       | A performance rating on a scale of 1 to 10.         |
| createdAt   | Date   | No        | The date and time when the report was created.      |

### Request Example

```http
POST /supervisors/create-report/67ebf698b0d4d8143ee09976
Content-Type: application/json

{
    "title": "Weekly Performance Review",
    "description": "The intern has shown excellent progress in completing assigned tasks.",
    "feedback": "Great job on meeting deadlines and maintaining quality.",
    "suggestions": "Focus on improving time management for larger projects.",
    "rating": 9
}
```

### Response Example

#### If the report is created successfully:

```json
{
  "message": "Report created successfully",
  "report": {
    "supervisor": "67ca892acd4899978d1b6666",
    "intern": "67ebf698b0d4d8143ee09976",
    "tasks": [],
    "title": "Weekly Performance Review",
    "description": "The intern has shown excellent progress in completing assigned tasks.",
    "feedback": "Great job on meeting deadlines and maintaining quality.",
    "suggestions": "Focus on improving time management for larger projects.",
    "rating": 9,
    "assignedInterns": [],
    "createdAt": "2025-04-02T08:21:37.292Z",
    "_id": "67ecf391b69866e59673ed96",
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

## Get Reports for an Intern

### Endpoint

```http
GET /supervisors/get-reports/:id
```

### Description

This endpoint allows a supervisor to retrieve all reports created for a specific intern. It provides a detailed list of reports, including feedback, suggestions, and performance ratings, enabling supervisors to track the intern's progress over time.

### Request Schema

#### Path Parameters

| Parameter | Type   | Required? | Description                          |
| --------- | ------ | --------- | ------------------------------------ |
| id        | string | Yes       | The unique identifier of the intern. |

### Request Example

```http
GET /supervisors/get-reports/67ebf698b0d4d8143ee09976
Content-Type: application/json
Authorization: Bearer <your-token>
```

### Response Example

#### If reports are found:

```json
{
  "message": "Reports fetched successfully",
  "reports": [
    {
      "_id": "67ecf3cbb69866e59673ed9e",
      "supervisor": {
        "_id": "67ca892acd4899978d1b6666",
        "email": "sup@sup.com"
      },
      "intern": "67ebf698b0d4d8143ee09976",
      "tasks": [],
      "title": "Weekly Performance Review",
      "description": "The intern has shown excellent progress in completing assigned tasks.",
      "feedback": "Great job on meeting deadlines and maintaining quality.",
      "suggestions": "Focus on improving time management for larger projects.",
      "rating": 9,
      "assignedInterns": [],
      "createdAt": "2025-04-02T08:22:35.285Z",
      "__v": 0
    }
  ]
}
```

#### If no reports are found:

```json
{
  "success": false,
  "message": "No reports found for the specified intern"
}
```

## Update Reports for an Intern

### Endpoint

```http
PUT /supervisors/update-reports/:id
```

### Description

This endpoint allows a supervisor to update the report details of a specific intern. It enables modifications to existing report data, such as feedback, suggestions, and performance ratings, allowing supervisors to refine their evaluations and keep the intern's progress records up to date.

### Request Schema

#### Path Parameters

| Parameter | Type   | Required? | Description                          |
| --------- | ------ | --------- | ------------------------------------ |
| id        | string | Yes       | The unique identifier of the intern. |

### Response Example

```http
PUT /supervisors/update-reports/67ebf698b0d4d8143ee09976
Content-Type: application/json
Authorization: Bearer <your-token>
```

#### If reports are updated:

```json
{
  "message": "Report updated successfully",
  "report": {
    "_id": "67f3294826a95fcddaaacc69",
    "supervisor": "67ce8ce4013aa193e984a8a3",
    "intern": "67d76bdf1c4b5af7a5d0ce5b",
    "tasks": [],
    "title": "Updated Title",
    "description": "This is updated description of a report",
    "feedback": "This report is good",
    "suggestions": "No further suggestions",
    "rating": 4,
    "assignedInterns": [],
    "createdAt": "2025-04-07T00:00:00.000Z",
    "__v": 0
  }
}
```

#### If the intern do not have reports to update:

```json
{
  "message": "Error updating report",
  "error": "Report not found"
}
```

## Delete Reports for an Intern

### Endpoint

```http
DELETE /supervisors/delete-report/:id
```

### Description

This endpoint allows a supervisor to delete a report associated with a specific intern. It removes the selected report from the system, helping supervisors manage and clean up report records as needed.

### Request Schema

#### Path Parameters

| Parameter | Type   | Required? | Description                          |
| --------- | ------ | --------- | ------------------------------------ |
| id        | string | Yes       | The unique identifier of the intern. |

### Response Example

```http
DELETE /supervisors/delete-report/67ebf698b0d4d8143ee09976
Content-Type: application/json
Authorization: Bearer <your-token>
```

#### If reports are deleted:

```json
{
  "success": true,
  "message": "Report deleted successfully"
}
```

#### If there is not report found:

```json
{
  "success": false,
  "message": "Error deleting report"
}
```

## Task

The `Task` model represents a task entity in the system. It is used to manage and assign tasks to interns, track their progress, and ensure timely completion.

### Schema Definition

The `Task` schema is defined as follows:

| Field             | Type     | Required? | Description                                                             |
| ----------------- | -------- | --------- | ----------------------------------------------------------------------- |
| `supervisor`      | ObjectId | No        | References the supervisor who created the task.                         |
| `title`           | String   | Yes       | The title of the task.                                                  |
| `description`     | String   | Yes       | A detailed description of the task.                                     |
| `deadline`        | Date     | No        | The deadline for completing the task.                                   |
| `assignedInterns` | Array    | No        | A list of interns assigned to the task, along with their task statuses. |

#### Assigned Interns Subdocument

Each entry in the `assignedInterns` array contains the following fields:

| Field      | Type     | Required? | Description                                                 |
| ---------- | -------- | --------- | ----------------------------------------------------------- |
| `internId` | ObjectId | Yes       | References the intern assigned to the task.                 |
| `status`   | String   | Yes       | The status of the task for the intern. Possible values are: |
|            |          |           | - `pending`: Task is not yet started.                       |
|            |          |           | - `in-progress`: Task is currently being worked on.         |
|            |          |           | - `completed`: Task has been completed.                     |
|            |          |           | - `backlogs`: Task is delayed or moved to backlogs.         |

### Endpoints

Use the following endpoints to interact with the `Task` entities:

| Method | Endpoint Name                                             | Description                                           |
| ------ | --------------------------------------------------------- | ----------------------------------------------------- |
| POST   | [Create Task](#create-task)                               | Creates a new task and assigns it to interns.         |
| GET    | [Get Tasks by Intern ID](#get-tasks-by-intern-id)         | Retrieves all tasks assigned to a specific intern.    |
| PUT    | [Update Task](#update-task)                               | Updates the details of an existing task.              |
| GET    | [Get Tasks by Supervisor ID](#get-tasks-by-supervisor-id) | Retrieves all tasks created by a specific supervisor. |
| PUT    | [Update Task Status (Intern)](#update-task-status-intern) | Updates the status of a task for a specific intern.   |
| DELETE | [Delete Task](#delete-task)                               | Deletes a task from the system.                       |

## Create Task

### Endpoint

```http
POST /tasks
```

### Description

This endpoint allows supervisors to create a new task and assign it to one or more interns. Tasks include details such as a title, description, deadline, and the list of assigned interns. It is useful for managing and tracking the progress of interns' work.

### Request Schema

#### Request Body

| Field             | Type     | Required? | Description                                |
| ----------------- | -------- | --------- | ------------------------------------------ |
| `title`           | `string` | Yes       | The title of the task.                     |
| `description`     | `string` | Yes       | A detailed description of the task.        |
| `deadline`        | `Date`   | No        | The deadline for completing the task.      |
| `assignedInterns` | `array`  | Yes       | A list of intern IDs assigned to the task. |

### Request Example

```http
POST /tasks
Content-Type: application/json

{
    "title": "Complete Weekly Report",
    "description": "Interns must submit their weekly progress report by the end of the week.",
    "deadline": "2025-04-07T23:59:59.000Z",
    "assignedInterns": [
        "67ebf698b0d4d8143ee09976",
        "67ea2a8f86c8971ca1fe27ba"
    ]
}
```

### Response Example

#### If the task is created successfully:

```json
{
  "supervisor": "67ca892acd4899978d1b6666",
  "title": "Complete Weekly Report",
  "description": "Interns must submit their weekly progress report by the end of the week.",
  "deadline": "2025-04-07T23:59:59.000Z",
  "assignedInterns": [
    {
      "internId": "67ebf698b0d4d8143ee09976",
      "status": "pending",
      "_id": "67ecf9d0600490691b4ffe8b"
    },
    {
      "internId": "67ea2a8f86c8971ca1fe27ba",
      "status": "pending",
      "_id": "67ecf9d0600490691b4ffe8c"
    }
  ],
  "_id": "67ecf9d0600490691b4ffe8a",
  "__v": 0
}
```

#### If an error occurs:

```json
{
  "message": "Failed to create task. Please check the input data."
}
```

## Get Tasks by Intern ID

### Endpoint

```http
GET /tasks/intern
```

### Description

This endpoint allows you to retrieve all tasks assigned to a specific intern. It is useful for interns to view their task list and track their progress.

### Request Schema

#### Query Parameters

| Query Parameter | Type   | Required? | Description                                                          |
| --------------- | ------ | --------- | -------------------------------------------------------------------- |
| internId        | string | Yes       | The unique identifier of the intern whose tasks are being retrieved. |

### Request Example

```http
GET /tasks/intern?internId=67ebf698b0d4d8143ee09976
Content-Type: application/json
Authorization: Bearer <your-token>
```

### Response Example

#### If tasks are found:

```json
{
  "tasks": [
    {
      "_id": "67ecf9d0600490691b4ffe8a",
      "supervisor": "67ca892acd4899978d1b6666",
      "title": "Complete Weekly Report",
      "description": "Interns must submit their weekly progress report by the end of the week.",
      "deadline": "2025-04-07T23:59:59.000Z",
      "assignedInterns": [
        {
          "internId": "67ebf698b0d4d8143ee09976",
          "status": "pending",
          "_id": "67ecf9d0600490691b4ffe8b"
        },
        {
          "internId": "67ea2a8f86c8971ca1fe27ba",
          "status": "pending",
          "_id": "67ecf9d0600490691b4ffe8c"
        }
      ]
    }
  ]
}
```

#### If no tasks are found:

```json
{
  "success": false,
  "message": "No tasks found for the specified intern."
}
```

## Update Task

### Endpoint

```http
PUT /tasks/supervisor
```

### Description

This endpoint allows a supervisor to update the details of an existing task. Supervisors can modify the task's title, description, deadline, or the list of assigned interns. It is useful for making adjustments to tasks as needed.

### Authorization

The [Supervisor Login](#supervisor-login) is required for each API request.

### Request Schema

#### Request Body

| Field             | Type     | Required? | Description                                          |
| ----------------- | -------- | --------- | ---------------------------------------------------- |
| `_id`             | `string` | Yes       | The unique identifier of the task to be updated.     |
| `title`           | `string` | Yes       | The updated title of the task.                       |
| `description`     | `string` | Yes       | The updated description of the task.                 |
| `deadline`        | `Date`   | Yes       | The updated deadline for completing the task.        |
| `assignedInterns` | `array`  | Yes       | The updated list of intern IDs assigned to the task. |

### Request Example

```http
PUT /tasks/supervisor
Content-Type: application/json
Authorization: Bearer <your-token>

{
    "_id": "67ecf9d0600490691b4ffe8a",
    "title": "Updated Weekly Report",
    "description": "Interns must submit their updated weekly progress report by the new deadline.",
    "deadline": "2025-04-10T23:59:59.000Z",
    "assignedInterns": [
        "67ebf698b0d4d8143ee09976",
        "67ea2a8f86c8971ca1fe27ba"
    ]
}
```

### Response Example

#### If the update is successful:

```json
{
  "task": {
    "_id": "67ecf9d0600490691b4ffe8a",
    "supervisor": "67ca892acd4899978d1b6666",
    "title": "Updated Weekly Report",
    "description": "Interns must submit their updated weekly progress report by the new deadline.",
    "deadline": "2025-04-10T23:59:59.000Z",
    "assignedInterns": [
      {
        "internId": {
          "_id": "67ebf698b0d4d8143ee09976",
          "firstName": "John",
          "lastName": "Smith",
          "email": "bercasiocharles14@gmail.com"
        },
        "status": "pending",
        "_id": "67ecf9d0600490691b4ffe8b"
      },
      {
        "internId": {
          "_id": "67ea2a8f86c8971ca1fe27ba",
          "firstName": "John",
          "lastName": "Doe",
          "email": "johndoe@example.com"
        },
        "status": "pending",
        "_id": "67ecf9d0600490691b4ffe8c"
      }
    ]
  }
}
```

#### If the task is not found:

```json
{
  "success": false,
  "message": "Task not found"
}
```

## Get Tasks by Supervisor ID

### Endpoint

```http
GET /tasks/supervisor/:id
```

### Description

This endpoint allows a supervisor to retrieve all tasks they have created. It provides a detailed list of tasks, including their titles, descriptions, deadlines, and the interns assigned to each task. This is useful for supervisors to monitor and manage the progress of tasks they are overseeing.

### Request Schema

#### Path Parameters

| Parameter | Type   | Required? | Description                              |
| --------- | ------ | --------- | ---------------------------------------- |
| id        | string | Yes       | The unique identifier of the supervisor. |

### Request Example

```http
GET /tasks/supervisor/67ca892acd4899978d1b6666
Content-Type: application/json
Authorization: Bearer <your-token>
```

### Response Example

```json
{
  "tasks": [
    {
      "_id": "67e397950d0a7b597c07b51b",
      "supervisor": "67ca892acd4899978d1b6666",
      "title": "asd",
      "description": "asd",
      "deadline": "2025-03-28T00:00:00.000Z",
      "__v": 0,
      "assignedInterns": [
        {
          "internId": {
            "_id": "67e4cfb72ce2f25a20a1211c",
            "firstName": "Erna",
            "lastName": "Mosciski",
            "email": "foo@foo.com"
          },
          "status": "pending",
          "_id": "67ea2ddc86c8971ca1fe61fd"
        },
        {
          "internId": {
            "_id": "67e4cfb72ce2f25a20a12120",
            "firstName": "Francis",
            "lastName": "Grimes",
            "email": "Jennyfer_Goyette34@hotmail.com"
          },
          "status": "pending",
          "_id": "67ea2ddc86c8971ca1fe61fe"
        }
      ]
    }
  ]
}
```

## Update Task Status (Intern)

### Endpoint

```http
PUT /tasks/:taskId
```

### Description

This endpoint allows interns to update the status of a specific task assigned to them. It helps track task progress and keeps supervisors informed about the current state of the task.

### Request Schema

#### Path Parameters

| Parameter | Type   | Required? | Description                        |
| --------- | ------ | --------- | ---------------------------------- |
| taskId    | string | Yes       | The unique identifier of the task. |

#### Request Body

| Field    | Type   | Required? | Description                                                                                              |
| -------- | ------ | --------- | -------------------------------------------------------------------------------------------------------- |
| internId | string | Yes       | The unique identifier of the intern assigned to the task.                                                |
| status   | string | Yes       | The updated status of the task. Valid options are: `pending`, `in-progress`, `completed`, or `backlogs`. |

### Request Example

```http
PUT /tasks/67e397950d0a7b597c07b51b
Content-Type: application/json
Authorization: Bearer <your-token>

{
    "internId": "67e4cfb72ce2f25a20a1211c",
    "status": "completed"
}
```

### Response Example

#### If the update is successful:

```json
{
  "task": {
    "_id": "67e397950d0a7b597c07b51b",
    "title": "asd",
    "description": "asd",
    "deadline": "2025-03-28T00:00:00.000Z",
    "status": "completed",
    "__v": 0
  }
}
```

#### If the task or intern is not found:

```json
{
  "message": "Task or intern not found"
}
```

## Delete Task

### Endpoint

```http
DELETE /tasks/:taskId
```

### Description

This endpoint allows supervisors to delete a specific task from the system. Deleting a task removes it from the database and unassigns it from all associated interns. It is useful for managing outdated or unnecessary tasks.

### Request Schema

#### Path Parameters

| Parameter | Type   | Required? | Description                                      |
| --------- | ------ | --------- | ------------------------------------------------ |
| taskId    | string | Yes       | The unique identifier of the task to be deleted. |

### Request Example

```http
DELETE /tasks/67e397950d0a7b597c07b51b
Content-Type: application/json
Authorization: Bearer <your-token>
```

### Response Example

#### If the task is deleted successfully (204 No Content):

The server responds with a `204 No Content` status code, indicating that the task was successfully deleted and there is no additional content to send in the response body.

#### If the task is not found:

```json
{
  "message": "No task found. Unable to delete."
}
```

## Task Updates

A WebSocket endpoint for real-time task updates.

### Endpoint

```ws
ws://localhost:3000/tasks/updates
```

### Query Parameters

| Query Parameter | Type   | Required? | Description                                                               |
| --------------- | ------ | --------- | ------------------------------------------------------------------------- |
| accountType     | string | Optional  | Specifies the type of account. Valid values are `supervisor` or `intern`. |
| email           | string | Required  | The email address associated with the account.                            |
| internId        | string | Optional  | The unique identifier of the intern.                                      |

### Description

This WebSocket endpoint enables real-time task status updates for supervisors and interns. It eliminates the need for manual refreshes or polling by providing instant notifications whenever a task's status changes.

### Usage

1. Establish a WebSocket connection to the endpoint.
2. Listen for task update events, which are sent as JSON payloads.
3. Supervisors receive updates whenever an intern modifies a task.
4. Interns receive notifications when their tasks are updated by a supervisor.

### Example Payloads

#### Task Update Event (Intern)

Sent by the intern. A rest api endpoint handles the update in the backend.

```json
{
  "update": true
}
```

#### Task Update Event (Supervisor)

Receive by the supervisor

```json
[
  {
    "_id": "67e511e30c1587abaf93a6f6",
    "supervisor": "67ca892acd4899978d1b6666",
    "title": "asdasd",
    "description": "asdasd",
    "deadline": "2025-03-15T00:00:00.000Z",
    "assignedInterns": [
      {
        "internId": "67e4cfb72ce2f25a20a12120",
        "status": "pending",
        "_id": "67e511e30c1587abaf93a6f7"
      },
      {
        "internId": "67e4cfb72ce2f25a20a1211c",
        "status": "backlogs",
        "_id": "67e6308c347a28689f1db5f7"
      }
    ]
  }
]
```

### Notes

- Ensure the WebSocket connection is authenticated if required.
- Handle reconnections gracefully in case of network interruptions.
- Task updates include the task ID, intern ID, updated status, and a timestamp.
- This endpoint is read-only and does not accept client messages.

### Notes

- Ensure the WebSocket connection is authenticated if required.
- Handle reconnections gracefully in case of network interruptions.
- Task updates include the task ID, intern ID, updated status, and a timestamp.
- This endpoint is read-only and does not accept client messages.

---

## Files

A collection of endpoints for managing file uploads and metadata in the system.

### Schema Definition

The `File` schema represents documents uploaded by users, storing essential metadata such as file name, type, size, and the uploader's details.

| Field         | Type   | Required? | Description                                                                         |
| ------------- | ------ | --------- | ----------------------------------------------------------------------------------- |
| `_id`         | String | Yes       | The unique identifier of the file.                                                  |
| `accountType` | String | Yes       | The type of account associated with the uploader (`Intern`, `Admin`, `Supervisor`). |
| `uploader`    | String | Yes       | The unique identifier of the user who uploaded the file.                            |
| `doc`         | Object | Yes       | Metadata about the uploaded document.                                               |

#### `doc` Subdocument

The `doc` field contains detailed information about the uploaded file.

| Field    | Type   | Required? | Description                                                        |
| -------- | ------ | --------- | ------------------------------------------------------------------ |
| `buffer` | String | Yes       | The binary data of the uploaded file.                              |
| `type`   | String | Yes       | The MIME type of the file (e.g., `image/jpeg`, `application/pdf`). |
| `name`   | String | Yes       | The original name of the uploaded file.                            |

### Endpoints

| Method | Endpoint Name                                     | Description                                               |
| ------ | ------------------------------------------------- | --------------------------------------------------------- |
| POST   | [Intern Upload Document](#intern-upload-document) | Allows an intern to upload a document to the system.      |
| GET    | [Fetch Files](#fetch-files)                       | Retrieve uploaded files based on the user's account type. |

## Intern Upload Document

An endpoint for the intern user to upload a document.

### Endpoint

```http
POST /files/upload/:internId
```

### Description

This endpoint allows an intern to upload a document to the system. Accepted file formats include `image/jpeg`, `image/png`, and `application/pdf`. The maximum file size allowed is 10 MB. This feature is useful for submitting reports, assignments, or other required documents securely and efficiently.

### Request Schema

#### Path Parameters

| Parameter | Type   | Required? | Description                                                 |
| --------- | ------ | --------- | ----------------------------------------------------------- |
| internId  | string | Yes       | The unique identifier of the intern uploading the document. |

#### Request Body

The request body should include the file to be uploaded as a `multipart/form-data` payload.

| Field | Type | Required? | Description                                                                                   |
| ----- | ---- | --------- | --------------------------------------------------------------------------------------------- |
| file  | file | Yes       | The document to be uploaded. Supported formats: `image/jpeg`, `image/png`, `application/pdf`. |

### Request Example

```http
POST /files/intern/67ebf698b0d4d8143ee09976
Content-Type: multipart/form-data

{
    "file": <file>
}
```

### Response Example

#### If the upload is successful:

```json
{
  "message": "File uploaded successfully"
}
```

#### If the file format is unsupported:

```json
{
  "message": "Unsupported file format. Please upload a JPEG, PNG, or PDF file."
}
```

#### If the intern is not found:

```json
{
  "message": "Intern not found"
}
```

## Fetch Files

Retrieve uploaded files based on the user's account type.

### Authorization

A valid login is required. Refer to [Login Endpoints](#login-endpoints) for authentication options.

### Description

- **Interns**: Fetches only the files uploaded by the logged-in intern.
- **Supervisors or Admins**: Fetches all files uploaded in the system. Supervisors and admins can optionally filter files by uploader.

### Request Schema

#### Query Parameters

| Query Parameter | Type   | Required? | Description                                                                                                |
| --------------- | ------ | --------- | ---------------------------------------------------------------------------------------------------------- |
| `uploader`      | string | Optional  | The unique identifier of the uploader. This parameter is applicable only for admin or supervisor accounts. |
| `accountType`   | string | Optional  | A filter for admin and supervisor accounts. Valid values are [`Intern`, `Supervisor`, `Admin`].            |

### Request Example

#### For Interns

```http
GET /files
Content-Type: application/json
Authorization: Bearer <your-token>
```

#### For Supervisors or Admins (with optional uploader filter)

```http
GET /files?uploader=67ebf698b0d4d8143ee09976
Content-Type: application/json
Authorization: Bearer <your-token>
```

### Response Example

#### For Interns

```json
{
  "files": [
    {
      "_id": "67f1a2b3c4d5e6f7g8h9i0j1",
      "accountType": "Intern",
      "uploader": "67ebf698b0d4d8143ee09976",
      "doc": {
        "name": "weekly_report.pdf",
        "type": "application/pdf",
        "buffer": "<binary-data>"
      }
    }
  ]
}
```

#### For Supervisors or Admins

```json
{
  "files": [
    {
      "_id": "67f1a2b3c4d5e6f7g8h9i0j1",
      "accountType": "Intern",
      "uploader": "67ebf698b0d4d8143ee09976",
      "doc": {
        "name": "weekly_report.pdf",
        "type": "application/pdf",
        "buffer": "<binary-data>"
      }
    },
    {
      "_id": "67f1a2b3c4d5e6f7g8h9i0j2",
      "accountType": "Supervisor",
      "uploader": "67ca892acd4899978d1b6666",
      "doc": {
        "name": "project_overview.png",
        "type": "image/png",
        "buffer": "<binary-data>"
      }
    }
  ]
}
```

## HealthCheck

### Endpoint

```http
GET /healthcheck/status
```

### Description

This endpoint checks the current status of the server and provides metrics such as uptime, memory usage, and response time, indicating that the server is running and healthy.

### Request Schema

#### Request Body

### Request Example

### Response Example

```json
{
  "uptime": 25.825701,
  "hrtime": [31097, 334189000],
  "responseTime": 0.0029,
  "memoryUsage": {
    "rss": 66027520,
    "heapTotal": 30908416,
    "heapUsed": 29993816,
    "external": 22072590,
    "arrayBuffers": 18329735
  },
  "message": "OK",
  "timestamp": "2025-05-05T08:38:05.289Z"
}
```
