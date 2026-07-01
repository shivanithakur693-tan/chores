/* =====================================================================
   google-apps-script.js
   ---------------------------------------------------------------------
   THIS FILE IS NOT RUN ON YOUR COMPUTER OR PHONE.
   You paste its contents into a Google Apps Script project that lives
   INSIDE a Google Sheet. See SETUP.md for the exact click-by-click
   steps. Once deployed as a "Web App", it gives you a URL that the
   voice-task-bot app (js/app.js -> SHEET_WEBHOOK_URL) sends results to.

   WHAT IT DOES
   - doPost(e): receives one JSON payload per "day finished" from the
     app (sent via fetch with mode:'no-cors' and a text/plain body —
     that's why we read it as e.postData.contents and JSON.parse it
     ourselves, rather than expecting Apps Script to parse form fields).
     It writes ONE ROW PER TASK into a sheet named "Log", creating that
     sheet (with a header row) the first time it's needed.
   - doGet(e): just replies "OK" as a plain text response, so you can
     quickly check your deployed Web App URL works by opening it in a
     browser — see step 4 in SETUP.md.

   COLUMNS WRITTEN TO THE "Log" SHEET:
     timestamp       - full date+time the result was recorded (ISO string)
     date            - just the date, e.g. 2026-07-01
     day             - day of week, e.g. "wednesday"
     task_id         - the task's id from tasks-config.js, e.g. "make_bed"
     task_label_hi   - the Hindi question that was asked for that task
     status          - "done" or "missed"
   ===================================================================== */

const SHEET_NAME = "Log";

function doGet(e) {
  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    // The app sends the JSON as a raw text/plain body (to dodge CORS
    // preflight — see the comment in js/app.js), so we parse it here
    // instead of relying on e.parameter.
    const data = JSON.parse(e.postData.contents);

    const sheet = getOrCreateLogSheet_();

    const timestamp = data.timestamp || new Date().toISOString();
    const date = data.date || "";
    const day = data.day || "";
    const tasks = Array.isArray(data.tasks) ? data.tasks : [];

    // Append one row per task in this submission.
    const rows = tasks.map(function (t) {
      return [
        timestamp,
        date,
        day,
        t.id || "",
        t.textHi || "",
        t.status === "yes" ? "done" : "missed"
      ];
    });

    if (rows.length > 0) {
      sheet
        .getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length)
        .setValues(rows);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, rowsWritten: rows.length }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Even on error, respond with something — the app ignores the
    // response anyway (no-cors), but this helps if you test manually.
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Finds the "Log" sheet, or creates it with a header row if it doesn't
// exist yet (e.g. the very first time the app ever submits results).
function getOrCreateLogSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["timestamp", "date", "day", "task_id", "task_label_hi", "status"]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}
