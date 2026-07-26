# Government School Attendance and Dropout Early-Warning System

## Problem Statement

Many government schools still use paper registers to record attendance. Teachers often identify students at risk of dropping out only after several weeks of continuous absence.

This project digitizes attendance records and automatically identifies students with frequent absences so that teachers can take early action.

---

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- SQLite
- VS Code

---

## Project Features

- Add Attendance Record
- Update Attendance Record
- Delete Attendance Record
- View All Attendance Records
- Search by Student Name
- Filter by Attendance Status
- Automatic Early Warning for Frequent Absences
- Responsive Design
- Loading, Empty and Error States

---

## Database Fields

| Field | Description |
|--------|-------------|
| record_id | Unique Attendance Record ID |
| student_id | Student ID |
| student_name | Student Name |
| class_section | Class and Section |
| date | Attendance Date |
| present_absent | Present or Absent |
| reason | Reason for Absence |

---

## Early Warning Logic

The system counts the number of **Absent** records for each student.

If the student has **5 or more absences**, they are displayed in the **Dropout Early Warning** section.

---

## Folder Structure

```
Government-School-Attendance
│
├── public
│   ├── css
│   │   └── style.css
│   ├── js
│   │   └── script.js
│   └── index.html
│
├── database
│   └── attendance.db
│
├── server.js
├── package.json
├── README.md
└── .gitignore
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/Government-School-Attendance.git
```

### Install Dependencies

```bash
npm install
```

### Start the Server

```bash
npm start
```

Open your browser and visit:

```
http://localhost:3000
```

---

## API Endpoints

### Get All Records

```
GET /api/attendance
```

### Add Record

```
POST /api/attendance
```

### Update Record

```
PUT /api/attendance/:id
```

### Delete Record

```
DELETE /api/attendance/:id
```

### Get Early Warning Students

```
GET /api/warnings
```

---

## Test Cases

✔ Add a new attendance record

✔ Edit an existing record

✔ Delete a record

✔ Search by student name

✔ Filter Present/Absent records

✔ Display warning for students with 5 or more absences

✔ Reload page and verify data persistence

---

## Future Enhancements

- Teacher Login
- Student Dashboard
- Parent Notifications
- Monthly Attendance Reports
- Export Attendance as PDF
- SMS/Email Alerts

---

## Screenshots

Add the following screenshots after completing the project:

- Home Page
- Attendance Form
- Attendance Records Table
- Dropout Early Warning Section

---

## Author

**Name:** S. Sanjana

**Department:** B.E Cyber Security

**College:** Prince Dr. K. Vasudevan College of Engineering and Technology

---

## License

This project is developed for **SIH 2026 Internal Practical Assessment**.