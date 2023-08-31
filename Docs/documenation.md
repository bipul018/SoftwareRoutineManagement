# API Documentation 
# Route- `admin.js`

## Setup Admin User

- Method: `GET`
- Endpoint: `/api/user/admin/`
- Description: Sets up the admin user if not already created.
- Authentication: Not required

### Request

- No request parameters needed.

### Response

Example Success Response:
```json
{
  "status": true,
  "data": {},
  "err": {},
  "msg": "New Admin user created."
}
```
# Route - `class.js`

## Fetch All Classes

- Method: `GET`
- Endpoint: `/api/class/`
- Description: Fetches all available class data from the database.
- Authentication: Not required

### Parameters

- `part` (optional): Filter classes by part.

### Response

Example Success Response:
```json
{
  "status": true,
  "data": [ /* Array of class objects */ ],
  "err": {},
  "msg": "Classes fetched successfully."
}
```
## Fetch Class by ID

- Method: `GET`
- Endpoint: `/api/class/:id`
- Description: Fetches details of a specific class by ID.
- Authentication: Not required

### Parameters

- `id` (required): ID of the class to fetch.

### Response

Example Success Response:
```json
{
  "status": true,
  "data": { /* Class object */ },
  "err": {},
  "msg": "Class fetched successfully."
}
```
## Fetch Weekly Classes for a Program

- Method: `GET`
- Endpoint: `/api/class/program/:programID/weekly`
- Description: Fetches all weekly classes for a given program.
- Authentication: Not required

### Parameters

- `programID` (required): ID of the program for which to fetch weekly classes.

### Response

Example Success Response:
```json
{
  "status": true,
  "data": [
    {
      /* Class object 1 */
    },
    {
      /* Class object 2 */
    },
    /* ... more class objects */
  ],
  "err": {},
  "msg": "Classes fetched successfully."
}

```
## Fetch Classes for a Teacher

- Method: `GET`
- Endpoint: `/api/class/teacher/:teacherID`
- Description: Fetches all classes associated with a given teacher.
- Authentication: Not required

### Parameters

- `teacherID` (required): ID of the teacher for whom to fetch classes.

### Response

Example Success Response:
```json
{
  "status": true,
  "data": [
    {
      /* Class object 1 */
    },
    {
      /* Class object 2 */
    },
    /* ... more class objects */
  ],
  "err": {},
  "msg": "Classes fetched successfully."
}
```
## Add New Class

- Method: `POST`
- Endpoint: `/api/class/add/:addID`
- Description: Adds a new class to the database.
- Authentication: Not required

### Request Body

- `routineFor` (required): ID of the program for which the class is scheduled.
- `subjectID` (required): ID of the subject for the class.
- `teacherName` (required): ID of the teacher for the class.
- `classType` (required): Type of the class (e.g., "Lecture", "Lab").
- `classGroup` (optional): Group or section of the class (if applicable).
- `startingPeriod` (required): Starting period number for the class.
- `noOfPeriod` (required): Number of consecutive periods for the class.
- `weekDay` (required): Day of the week for the class (e.g., "Monday", "Tuesday").

### Response

Example Success Response:
```json
{
  "status": true,
  "data": {
    /* Newly added class object */
  },
  "err": {},
  "msg": "Class added successfully."
}

```
## Edit Class by ID

- Method: `POST`
- Endpoint: `/api/class/edit/:classID`
- Description: Updates an existing class with the specified ID in the database.
- Authentication: Not required

### URL Parameters

- `classID` (required): ID of the class to be edited.

### Request Body

- `routineFor` (required): ID of the program for which the class is scheduled.
- `subjectID` (required): ID of the subject for the class.
- `teacherName` (required): ID of the teacher for the class.
- `classType` (required): Type of the class (e.g., "Lecture", "Lab").
- `classGroup` (optional): Group or section of the class (if applicable).
- `startingPeriod` (required): Starting period number for the class.
- `noOfPeriod` (required): Number of consecutive periods for the class.
- `weekDay` (required): Day of the week for the class (e.g., "Monday", "Tuesday").

### Response

Example Success Response:
```json
{
  "status": true,
  "data": {
    /* Updated class object */
  },
  "err": {},
  "msg": "Class updated successfully."
}

```
## Check Class Overlaps

- Method: `GET`
- Endpoint: `/api/class/valid/:programID/day/:day/period/:periodNo/nperiods/:nperiods`
- Description: Checks if a class overlaps with other classes in the same routine for a given program, day, and time period.
- Authentication: Not required

### Parameters

- `programID` (required): ID of the program for which to check class overlaps.
- `day` (required): Day of the week (e.g., "Monday", "Tuesday") for which to check class overlaps.
- `periodNo` (required): Starting period number for the class to be checked.
- `nperiods` (required): Number of consecutive periods for the class to be checked.

### Response

Example Success Response (Overlapping):
```json
{
  "status": true,
  "data": {
    "valid": false,
    "overlap": {
      /* Overlapping class object */
    }
  },
  "msg": "Classes fetched successfully."
}

```
## Check Teacher Availability

- Method: `GET`
- Endpoint: `/api/class/available/teacher/:teacherID/day/:day/period/:periodNo/nperiods/:nperiods`
- Description: Checks if a teacher is available for a given time period on a specific day.
- Authentication: Not required

### Parameters

- `teacherID` (required): ID of the teacher to check availability for.
- `day` (required): Day of the week (e.g., "Monday", "Tuesday") for which to check teacher availability.
- `periodNo` (required): Starting period number for the time period to check.
- `nperiods` (required): Number of consecutive periods for the time period to check.

### Response

Example Success Response (Available):
```json
{
  "status": true,
  "data": {
    "available": true,
    "overlapClass": {},
    "overlapAt": 0
  },
  "msg": "Classes fetched successfully."
}

```
## Delete Class by ID

- Method: `DELETE`
- Endpoint: `/api/class/delete/:id`
- Description: Deletes a class with the specified ID.
- Authentication: Not required

### Parameters

- `id` (required): ID of the class to be deleted.

### Response

Example Success Response:
```json
{
  "status": true,
  "msg": "Class deleted successfully."
}

```
# Route - `subject.js`

## Fetch All Subjects

- Method: `GET`
- Endpoint: `/api/user/admin/api/subject/`
- Description: Fetches all available subject data from the database.
- Authentication: Not required

### Response

Example Success Response:
```json
{
  "status": true,
  "data": [ /* Array of subject objects */ ],
  "err": {},
  "msg": "Subjects fetched successfully."
}
```
## Add New Subject

- Method: `POST`
- Endpoint: `/api/user/admin/api/subject/add`
- Description: Adds a new subject to the database.
- Authentication: Not required

### Request

Example Request Body:
```json
{
  "subjectName": "Mathematics",
  "subjectCode": "MATH101"
}

```
## Fetch Subject by Name

- Method: `GET`
- Endpoint: `/api/user/admin/api/subject/subjectName/:subjectName`
- Description: Fetches details of a subject by its name.
- Authentication: Not required

### Parameters

- `subjectName` (required): Name of the subject to fetch.

### Response

Example Success Response:
```json
{
  "status": true,
  "data": { /* Subject object */ },
  "msg": "Subject found successfully."
}

```
# Route - `teacher.js`

## Fetch All Teachers

- Method: `GET`
- Endpoint: `/api/user/admin/api/teacher/`
- Description: Fetches all available teacher data from the database.
- Authentication: Not required

### Response

Example Success Response:
```json
{
  "status": true,
  "data": [ /* Array of teacher objects */ ],
  "err": {},
  "msg": "Teachers fetched successfully."
}
```
## Fetch Teacher by Name

**Method:** `GET`

**Endpoint:** `/api/user/admin/api/teacher/name/:teacherName`

**Description:** Fetches details of a specific teacher by name.

**Authentication:** Not required

### Parameters

- `teacherName` (required): Name of the teacher.

### Response

Example Success Response:
```json
{
  "status": true,
  "data": "teacherID",
  "err": {},
  "msg": "Teachers fetched successfully."
}
```
## Add New Teacher

**Method:** `POST`

**Endpoint:** `/api/user/admin/api/teacher/add`

**Description:** Adds a new teacher to the database.

**Authentication:** Not required

### Request

Example Request Body:
```json
{
  "teacherName": "John Doe",
  "shortName": "JD",
  "designation": "Professor"
}
```
## Edit Teacher by ID

**Method:** `POST`

**Endpoint:** `/api/user/admin/api/teacher/edit/:id`

**Description:** Edits details of an existing teacher.

**Authentication:** Not required

### Parameters

- `id` (required): ID of the teacher to edit.

### Request

Example Request Body:
```json
{
  "teacherName": "John Doe",
  "shortName": "JD",
  "designation": "Assistant Professor"
}
```
## Delete Teacher by ID

**Method:** `POST`

**Endpoint:** `/api/user/admin/api/teacher/delete/:id`

**Description:** Deletes a teacher from the database.

**Authentication:** Not required

### Parameters

- `id` (required): ID of the teacher to delete.

### Response

Example Success Response:
```json
{
  "status": true,
  "msg": "Teacher removed successfully."
}
```
