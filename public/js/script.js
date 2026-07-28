const API = "/api/attendance";
const form = document.getElementById("attendanceForm");
const tableBody = document.getElementById("tableBody");
const warningBox = document.getElementById("warningBox");
const search = document.getElementById("search");
const filterStatus = document.getElementById("filterStatus");
let attendanceData = [];
async function loadAttendance() {
    try {
        tableBody.innerHTML =
            `<tr><td colspan="9" class="loading">Loading...</td></tr>`;

        const response = await fetch(API);
        attendanceData = await response.json();

        displayTable(attendanceData);
        loadWarnings();

    } catch (error) {
        tableBody.innerHTML =
            `<tr><td colspan="9" class="error">Failed to load data.</td></tr>`;
    }
}
function displayTable(data) {

    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML =
            `<tr><td colspan="9" class="empty">No attendance records found.</td></tr>`;
        return;
    }

    data.forEach(record => {

        tableBody.innerHTML += `
        <tr>
            <td>${record.record_id}</td>
            <td>${record.student_id}</td>
            <td>${record.student_name}</td>
            <td>${record.class_section}</td>
            <td>${record.date}</td>

            <td class="${record.present_absent === "Present" ? "present" : "absent"}">
                ${record.present_absent}
            </td>

            <td>${record.reason || "-"}</td>
            <td>${record.remarks || "-"}</td>

            <td>
                <button class="edit-btn"
                    onclick="editRecord(${record.record_id})">
                    Edit
                </button>

                <button class="delete-btn"
                    onclick="deleteRecord(${record.record_id})">
                    Delete
                </button>
            </td>
        </tr>
        `;
    });
}
form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const id = document.getElementById("record_id").value;

    const record = {
        student_id: document.getElementById("student_id").value,
        student_name: document.getElementById("student_name").value,
        class_section: document.getElementById("class_section").value,
        date: document.getElementById("date").value,
        present_absent: document.getElementById("present_absent").value,
        reason: document.getElementById("reason").value,
        remarks: document.getElementById("remarks").value
    };

    try {

        let response;

        if (id === "") {

            response = await fetch(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(record)
            });

        } else {

            response = await fetch(`${API}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(record)
            });

        }

        const result = await response.json();

        if (!response.ok) {
            alert(result.message);
            return;
        }

        alert(result.message);

        form.reset();
        document.getElementById("record_id").value = "";

        loadAttendance();

    } catch (error) {

        alert("Error saving record.");

    }

});
async function deleteRecord(id) {

    if (!confirm("Delete this record?"))
        return;

    try {

        await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        loadAttendance();

    } catch (error) {

        alert("Error deleting record.");

    }

}
function editRecord(id) {

    const record =
        attendanceData.find(r => r.record_id == id);

    if (!record)
        return;

    document.getElementById("record_id").value =
        record.record_id;

    document.getElementById("student_id").value =
        record.student_id;

    document.getElementById("student_name").value =
        record.student_name;

    document.getElementById("class_section").value =
        record.class_section;

    document.getElementById("date").value =
        record.date;

    document.getElementById("present_absent").value =
        record.present_absent;

    document.getElementById("reason").value =
        record.reason || "";

    document.getElementById("remarks").value =
        record.remarks || "";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
search.addEventListener("keyup", filterData);
filterStatus.addEventListener("change", filterData);

function filterData() {

    const text =
        search.value.toLowerCase();

    const status =
        filterStatus.value;

    const filtered =
        attendanceData.filter(record => {

            const nameMatch =
                record.student_name
                    .toLowerCase()
                    .includes(text);

            const statusMatch =
                status === "" ||
                record.present_absent === status;

            return nameMatch && statusMatch;
        });

    displayTable(filtered);
}
async function loadWarnings() {

    try {

        const response =
            await fetch("/api/warnings");

        const warnings =
            await response.json();

        if (warnings.length === 0) {

            warningBox.innerHTML =
                "No students crossed the absence threshold.";

            return;
        }

        let html = "";

        warnings.forEach(student => {

            html += `
            <p>
                <b>${student.student_name}</b>
                (${student.student_id})
                - ${student.absent_days} absences
            </p>
            `;
        });

        warningBox.innerHTML = html;

    } catch (error) {

        warningBox.innerHTML =
            "Unable to load warnings.";

    }
}
loadAttendance();