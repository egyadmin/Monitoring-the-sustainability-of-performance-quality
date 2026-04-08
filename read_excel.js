import XLSX from 'xlsx';
import path from 'path';

const filePath = process.argv[2];
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

// Find column names
if (json.length === 0) {
  console.log("Empty sheet");
  process.exit(0);
}

// Just log the first 5 rows and keys so I can see what the columns are named
console.log("Columns:", Object.keys(json[0]));
console.log("First 5 rows:");
console.log(JSON.stringify(json.slice(0, 5), null, 2));
