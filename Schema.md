## Overview
This subpage provides a link to the project's schema definitions.  This should act as a visual representation of the data and information contained within the application.

## Table of Contents
| Schema                    | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| [Admin](#admin)           | Schema for the Admin user.                                 |
| [Department](#department) | Schema for departments within the system.                  |
| [File](#file)             | Schema for file uploads associated with users.             |
| [Interns](#interns)       | Schema for intern accounts and their details.              |
| [Reports](#reports)       | Schema for reports on intern performance.                  |
| [Supervisor](#supervisor) | Schema for the Supervisor user and their assigned interns. |
| [Tasks](#tasks)           | Schema for tasks assigned to interns.                      |


## Admin
This schema defines the structure for Admin accounts within the Intern Management System. Admins have elevated privileges and typically manage or oversee the system's configuration, user roles, and access control.
### Collection Name: `admins`
### Schema Fields
| Field Name    | Type   | Required | Unique | Default   | Description                               |
| ------------- | ------ | -------- | ------ | --------- | ----------------------------------------- |
| `firstName`   | String | Yes      | No     | —         | The admin's first name.                   |
| `lastName`    | String | Yes      | No     | —         | The admin's last name.                    |
| `email`       | String | Yes      | Yes    | —         | The admin's unique email address.         |
| `password`    | String | Yes      | No     | —         | The hashed password (min. 8 characters).  |
| `accountType` | String | Yes      | No     | `'admin'` | The type of account (fixed to `"admin"`). |
### Notes
- Ensure that the password is hashed before saving to the database.
- Use role-based middleware to enforce access control based on accountType.
---
## Department
This schema defines the structure for the Department collection within the Intern Management System. Each department represents a unit or division to which interns or supervisors may be assigned.
### Collection Name: departments
### Schema Fields

| Field Name | Type   | Required | Unique | Default | Description                        |
| ---------- | ------ | -------- | ------ | ------- | ---------------------------------- |
| `name`     | String | Yes      | Yes    | —       | The unique name of the department. |


### Notes
- Department names must be unique to prevent duplication.
- This schema can be referenced by other models (e.g., Interns, Supervisors) for organizational grouping.

## File
This schema defines the structure for uploaded files in the Intern Management System. Files can be uploaded by different user types (Interns, Admins, or Supervisors) and are stored along with relevant metadata.

### Collection Name `files`

### Schema Fields
| Field Name    | Type                 | Required | Description                                                                                                            |
| ------------- | -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| `uploader`    | `ObjectId` (refPath) | Yes      | References the ID of the uploading user, based on `accountType`.                                                       |
| `accountType` | `String` (enum)      | No       | Specifies the model to reference in `uploader`. Values: `"Intern"`, `"Admin"`, `"Supervisor"`. Defaults to `"Intern"`. |
| `doc.url`     | `String`             | Yes      | The URL where the file is stored or accessible.                                                                        |
| `doc.type`    | `String`             | Yes      | The MIME type or file category (e.g., `pdf`, `image/png`).                                                             |
| `doc.name`    | `String`             | Yes      | The original name of the uploaded file.                                                                                |

#### Schema Behavior
- The uploader field uses `refPath` to dynamically reference one of three possible models (Intern, Admin, or Supervisor), depending on the accountType
- The doc field is an embedded object that encapsulates file metadata (URL, type, name).

#### Notes
- Useful for managing uploads like reports, assignments, or documentation submitted by different users.
- Ensure file access is protected and role-validated based on accountType.
---
## Interns
The Intern schema represents student interns in the Intern Management System. It captures their profile information, department, assigned supervisor, working hours, and reports.
### Collection Name: `interns`

### Schema Fields
| Field Name        | Type                       | Required | Default      | Description                                                |
| ----------------- | -------------------------- | -------- | ------------ | ---------------------------------------------------------- |
| `firstName`       | String                     | Yes      | —            | Intern's first name.                                       |
| `lastName`        | String                     | Yes      | —            | Intern's last name.                                        |
| `age`             | Number                     | Yes      | —            | Intern's age.                                              |
| `phone`           | String                     | Yes      | —            | Unique 11-digit phone number.                              |
| `school`          | String                     | Yes      | —            | Name of the intern's school.                               |
| `internshipHours` | Number                     | Yes      | —            | Total required internship hours.                           |
| `email`           | String (Regex Validated)   | Yes      | —            | Unique and valid email address.                            |
| `password`        | String                     | Yes      | —            | Password (minimum 8 characters).                           |
| `department`      | ObjectId (ref: Department) | No       | `null`       | Reference to the department the intern belongs to.         |
| `supervisor`      | ObjectId (ref: Supervisor) | No       | `null`       | Reference to the assigned supervisor.                      |
| `status`          | String (Enum)              | No       | `"inactive"` | Intern's account status.                                   |
| `timeEntries`     | Array of Time Entries      | No       | `[]`         | Log of daily time in/out. Used to calculate `totalHours`.  |
| `accountType`     | String                     | Yes      | `"intern"`   | Used for role-based authorization.                         |
| `isApproved`      | String (Enum)              | No       | `"pending"`  | Approval status by supervisor/admin.                       |
| `logs`            | Array of Logs              | No       | `[]`         | Activity logs associated with tasks.                       |
| `reportLogs`      | Array of Reports           | No       | `[]`         | Feedback and evaluations from supervisors.                 |
| `totalHours`      | Number (Getter)            | No       | `0`          | Computed from `timeEntries`. Reflects total working hours. |


### Subdocuments
#### Time Entries
| Field     | Type | Description              |
| --------- | ---- | ------------------------ |
| `timeIn`  | Date | Start of the work period |
| `timeOut` | Date | End of the work period   |

#### Logs
| Field    | Type     | Description                          |
| -------- | -------- | ------------------------------------ |
| `taskId` | ObjectId | Task related to the log (ref: Tasks) |
| `note`   | String   | Remarks or notes from the intern     |
| `read`   | Enum     | `"read"` or `"unread"`               |
| `date`   | Date     | Timestamp of the log                 |

#### Report Logs
| Field         | Type     | Description                     |
| ------------- | -------- | ------------------------------- |
| `reportId`    | ObjectId | Link to the Report document     |
| `title`       | String   | Report title                    |
| `description` | String   | Summary of report content       |
| `feedback`    | String   | Supervisor feedback             |
| `suggestions` | String   | Suggestions from the supervisor |
| `rating`      | Number   | Rating score (1–10)             |
| `date`        | Date     | Date of submission              |
| `supervisor`  | ObjectId | Reference to the supervisor     |

### Notes
- A pre-save hook automatically recalculates the totalHours based on timeEntries.
- The totalHours field is also available as a virtual getter.
- Relationships to Department, Supervisor, Tasks, and Reports allow powerful aggregation and querying.
- Designed for real-time progress tracking and evaluation.
- All logs and reports are nested for easier access and improved data integrity.
---
## Reports
The Reports schema represents evaluation reports authored by supervisors for interns. It includes feedback, task references, and overall ratings for performance reviews.

### Collection Name: `reports`

### Schema Fields
| Field Name        | Type                            | Required | Default    | Description                                         |
| ----------------- | ------------------------------- | -------- | ---------- | --------------------------------------------------- |
| `supervisor`      | ObjectId (ref: Supervisor)      | Yes      | —          | Reference to the supervisor who created the report. |
| `intern`          | ObjectId (ref: Intern)          | Yes      | —          | Reference to the main intern the report is for.     |
| `tasks`           | Array of ObjectId (ref: Tasks)  | No       | `[]`       | Tasks related to this report.                       |
| `title`           | String                          | Yes      | —          | Title of the report.                                |
| `description`     | String                          | Yes      | —          | Summary or main body of the report.                 |
| `feedback`        | String                          | No       | —          | Supervisor's evaluation feedback.                   |
| `suggestions`     | String                          | No       | —          | Supervisor's suggested improvements.                |
| `rating`          | Number (min: 1, max: 10)        | Yes      | —          | Performance rating score.                           |
| `assignedInterns` | Array of ObjectId (ref: Intern) | No       | `[]`       | Other interns relevant to the report context.       |
| `createdAt`       | Date                            | No       | `Date.now` | Timestamp when the report was created.              |


### Notes
- Designed to document feedback on interns' performance and progress.
- Can be associated with one or more tasks and multiple interns, though one intern is designated as the primary recipient.
- Supports detailed supervisor evaluation using description, feedback, suggestions, and rating.
---
## Supervisor
The Supervisor schema defines the structure for supervisor accounts within the Intern Management System. Supervisors are responsible for overseeing interns, assigning tasks, and creating performance reports.

### Collection Name: `supervisors`

### Schema Fields
| Field Name        | Type                            | Required | Default        | Description                                            |
| ----------------- | ------------------------------- | -------- | -------------- | ------------------------------------------------------ |
| `firstName`       | String                          | Yes      | —              | First name of the supervisor.                          |
| `lastName`        | String                          | Yes      | —              | Last name of the supervisor.                           |
| `age`             | Number                          | Yes      | —              | Age of the supervisor.                                 |
| `email`           | String (with regex validation)  | Yes      | —              | Email address (must be unique and valid format).       |
| `password`        | String (minLength: 8)           | Yes      | —              | Password for authentication.                           |
| `assignedInterns` | Array of ObjectId (ref: Intern) | No       | `[]`           | Interns assigned to this supervisor.                   |
| `status`          | String (enum)                   | No       | `"active"`     | Account status: either `"active"` or `"inactive"`.     |
| `department`      | ObjectId (ref: Department)      | No       | —              | Department that the supervisor belongs to.             |
| `accountType`     | String                          | Yes      | `"supervisor"` | Role identifier for authentication and access control. |

### Notes
- `assignedInterns` is a key field that enables tracking and management of supervised interns.
- `Email` is validated with a regular expression for basic formatting.
- The `accountType` field is essential for role-based access control within the system.

## Tasks
The Tasks schema represents task records within the Intern Management System. Supervisors can create tasks and assign them to multiple interns, each with their own progress status.
### Collection Name: `tasks`

### Schema Fields
| Field Name        | Type                                                     | Required | Default     | Description                                                |
| ----------------- | -------------------------------------------------------- | -------- | ----------- | ---------------------------------------------------------- |
| `supervisor`      | ObjectId (ref: Supervisor)                               | No       | —           | The supervisor who created the task.                       |
| `title`           | String                                                   | Yes      | —           | Title of the task.                                         |
| `description`     | String                                                   | Yes      | —           | Detailed description of the task.                          |
| `deadline`        | Date                                                     | No       | —           | Optional deadline for the task.                            |
| `assignedInterns` | Array of objects                                         | No       | `[]`        | List of assigned interns and their task status.            |
| → `internId`      | ObjectId (ref: Intern)                                   | No       | —           | The intern assigned to this task.                          |
| → `status`        | String (enum: pending, in-progress, completed, backlogs) | Yes      | `"pending"` | Progress status for the specific intern’s task assignment. |

### Notes
- Each task is uniquely assigned to one or more interns through the assignedInterns array.
- `status` tracks the individual progress per intern on the same task.
- This schema supports flexible assignment while ensuring clear accountability and tracking.

