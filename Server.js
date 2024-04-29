const express = require("express");
const XLSX = require("xlsx");
const app = express();
const fs = require("fs");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/submit", (req, res) => {
  const { employeeName, department } = req.body;
  console.log("Received:", employeeName, department);
  const fileName = "ADAT_OF_GAME_1.xlsx";

  try {
    let workbook;
    let worksheet;
    if (fs.existsSync(fileName)) {
      workbook = XLSX.readFile(fileName);
      worksheet = workbook.Sheets["Sheet1"];
    } else {
      workbook = XLSX.utils.book_new();
      worksheet = XLSX.utils.aoa_to_sheet([
        ["Name", "Department", "Stage 1", "Stage 2", "Stage 3", "Stage 4"]
      ]);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    }

    if (!worksheet) {
      throw new Error("Worksheet cannot be found or created.");
    }

    XLSX.utils.sheet_add_aoa(worksheet, [[employeeName, department]], {
      origin: -1
    });
    XLSX.writeFile(workbook, fileName);
    res.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/saveStage", (req, res) => {
  const { employeeName, stage, choice } = req.body;
  console.log("Received data for saving stage:", {
    employeeName,
    stage,
    choice
  });
  const fileName = "ADAT_OF_GAME_1.xlsx";

  try {
    let workbook;
    if (fs.existsSync(fileName)) {
      workbook = XLSX.readFile(fileName);
    } else {
      return res.status(400).json({ error: "Workbook not found." });
    }

    let worksheet = workbook.Sheets["Sheet1"];
    if (!worksheet) {
      throw new Error("Worksheet cannot be found.");
    }

    let rowIndex = findRowIndex(worksheet, employeeName);
    if (rowIndex === -1) {
      return res.status(400).json({ error: "Employee not found." });
    }

    // Assuming Stage 1 is column C (index 2), Stage 2 is column D (index 3), and so on.
    let colIndex = 2 + parseInt(stage)-1; // Convert stage number to column index.
    let cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
    console.log(`Writing '${choice}' to cell ${cellRef}`); // Logging the cell update

    worksheet[cellRef] = { t: "s", v: choice };

    // Save the workbook after making the update.
    XLSX.writeFile(workbook, fileName);
    res.json({ success: true });
  } catch (error) {
    console.error("Error on saving stage:", error);
    res.status(500).json({ error: error.message });
  }
});

function findRowIndex(worksheet, employeeName) {
  let ref = worksheet["!ref"];
  let range = XLSX.utils.decode_range(ref);

  for (let R = range.s.r; R <= range.e.r; ++R) {
    let cell = worksheet[XLSX.utils.encode_cell({ r: R, c: 0 })]; // Checking the first column for the name.
    if (cell && cell.v.toLowerCase() === employeeName.toLowerCase()) {
      return R; // Rows are 0-based index in xlsx package.
    }
  }
  return -1; // Not found.
}

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
