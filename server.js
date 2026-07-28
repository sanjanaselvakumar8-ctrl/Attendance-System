const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Connect to SQLite Database
const db = new sqlite3.Database("./database/attendance.db", (err) => {
    if (err) {
        console.error("Database Connection Error:", err.message);
    } else {
        console.log("Connected to SQLite Database");
    }
});

// Create Attendance Table
db.run(`
CREATE TABLE IF NOT EXISTS attendance (
    record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    class_section TEXT NOT NULL,
    date TEXT NOT NULL,
    present_absent TEXT NOT NULL,
    reason TEXT,
    remarks TEXT,
    UNIQUE(student_id, date)
)
`);

// ===================== GET ALL RECORDS =====================
app.get("/api/attendance", (req, res) => {

    db.all(
        "SELECT * FROM attendance ORDER BY date DESC",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json(rows);

        }
    );

});

// ===================== ADD RECORD =====================
app.post("/api/attendance", (req, res) => {

    const {
        student_id,
        student_name,
        class_section,
        date,
        present_absent,
        reason,
        remarks
    } = req.body;

    if (
        !student_id ||
        !student_name ||
        !class_section ||
        !date ||
        !present_absent
    ) {
        return res.status(400).json({
            success: false,
            message: "All required fields must be filled."
        });
    }

    const sql = `
    INSERT INTO attendance
    (
        student_id,
        student_name,
        class_section,
        date,
        present_absent,
        reason,
        remarks
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            student_id,
            student_name,
            class_section,
            date,
            present_absent,
            reason || "",
            remarks || ""
        ],
        function (err) {

            if (err) {

                if (
                    err.message &&
                    err.message.includes("UNIQUE")
                ) {
                    return res.status(409).json({
                        success: false,
                        message:
                            "Attendance already recorded for this student on this date."
                    });
                }

                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Attendance Added Successfully",
                record_id: this.lastID
            });

        }
    );

});

// ===================== UPDATE RECORD =====================
app.put("/api/attendance/:id", (req, res) => {

    const id = req.params.id;

    const {
        student_id,
        student_name,
        class_section,
        date,
        present_absent,
        reason,
        remarks
    } = req.body;

    const sql = `
    UPDATE attendance
    SET
        student_id=?,
        student_name=?,
        class_section=?,
        date=?,
        present_absent=?,
        reason=?,
        remarks=?
    WHERE record_id=?
    `;

    db.run(
        sql,
        [
            student_id,
            student_name,
            class_section,
            date,
            present_absent,
            reason,
            remarks,
            id
        ],
        function (err) {

            if (err) {

                if (
                    err.message &&
                    err.message.includes("UNIQUE")
                ) {
                    return res.status(409).json({
                        success: false,
                        message:
                            "Another record already exists for this student on this date."
                    });
                }

                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Record Updated Successfully"
            });

        }
    );

});

// ===================== DELETE RECORD =====================
app.delete("/api/attendance/:id", (req, res) => {

    db.run(
        "DELETE FROM attendance WHERE record_id=?",
        [req.params.id],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Record Deleted Successfully"
            });

        }
    );

});

// ===================== DROPOUT EARLY WARNING =====================
app.get("/api/warnings", (req, res) => {

    const sql = `
    SELECT
        student_id,
        student_name,
        COUNT(*) AS absent_days
    FROM attendance
    WHERE present_absent='Absent'
    GROUP BY student_id
    HAVING COUNT(*) >= 5
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json(rows);

    });

});

// ===================== HOME PAGE =====================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===================== START SERVER =====================
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});