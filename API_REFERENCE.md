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


## Tasks 

The Task Route is used to access the task models


### Endpoints
## Retrieve tasks by intern id

Returns an array of tasks based on the intern id or an empty array if not found

### Endpoint

```http
GET /tasks/intern
```

#### Query parameters

| Query parameter | Type | Required? |
|-----------------|------|-----------|
| internId        | string  | Required  | 
|                 |      |           |          

### Request Sample
```http
GET /tasks/intern?internId=67cbecaa3f611eedb0b953f0
```

### Response Sample
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


| Header parameter | Type   | Required? | Description |
|------------------|--------|-----------|-------------|
| Content-Type  | string | Required  | application/json |

#### Request body


| Field  | Type   | Required? | Description                      |
|--------|--------|-----------|----------------------------------|
| title   | string | Required  | Title of the tasks  |
| description | string | Required  | Description of the task               |
| deadline | string | Required  | Task deadline, formatted as an ISO 8601 string |
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



