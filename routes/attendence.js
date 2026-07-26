const express = require("express");
const router = express.Router();

module.exports = (db) => {

    // Get all attendance records
    router.get("/", (req, res) => {

        db.all(
            "SELECT * FROM attendance ORDER BY date DESC",
            [],
            (err, rows) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json(rows);

            }
        );

    });

    // Add attendance
    router.post("/", (req, res) => {

        const {
            student_id,
            student_name,
            class_section,
            date,
            present_absent,
            reason
        } = req.body;

        db.run(
            `INSERT INTO attendance
            (student_id,student_name,class_section,date,present_absent,reason)
            VALUES(?,?,?,?,?,?)`,
            [
                student_id,
                student_name,
                class_section,
                date,
                present_absent,
                reason
            ],
            function (err) {

                if (err)
                    return res.status(500).json(err);

                res.json({
                    success: true,
                    id: this.lastID
                });

            }
        );

    });

    // Update attendance
    router.put("/:id", (req, res) => {

        const {
            student_id,
            student_name,
            class_section,
            date,
            present_absent,
            reason
        } = req.body;

        db.run(
            `UPDATE attendance
             SET student_id=?,
                 student_name=?,
                 class_section=?,
                 date=?,
                 present_absent=?,
                 reason=?
             WHERE record_id=?`,
            [
                student_id,
                student_name,
                class_section,
                date,
                present_absent,
                reason,
                req.params.id
            ],
            function (err) {

                if (err)
                    return res.status(500).json(err);

                res.json({
                    success: true
                });

            }
        );

    });

    // Delete attendance
    router.delete("/:id", (req, res) => {

        db.run(
            "DELETE FROM attendance WHERE record_id=?",
            [req.params.id],
            function (err) {

                if (err)
                    return res.status(500).json(err);

                res.json({
                    success: true
                });

            }
        );

    });

    return router;

};