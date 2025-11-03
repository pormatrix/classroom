// === การตั้งค่าที่สำคัญ ===
// 1. คัดลอกโค้ดทั้งหมดนี้ไปวางในโปรเจกต์ Google Apps Script ของคุณ
// 2. **สำคัญมาก:** แก้ไข `SPREADSHEET_ID` ด้านล่าง ให้เป็น ID ของ Google Sheet ของคุณ
//    - ID ของชีต คือส่วนที่อยู่ใน URL ระหว่าง /d/ และ /edit/
//    - ตัวอย่าง: https://docs.google.com/spreadsheets/d/ SPREADSHEET_ID_อยู่ตรงนี้ /edit
// 3. ใน Google Sheet ของคุณ ต้องมีชีต 5 อันชื่อตรงตามนี้:
//    'Students', 'HealthRecords', 'GrowthRecords', 'TeachingLog', 'HomeroomLog'
// 4. Deploy สคริปต์นี้เป็น Web App โดยตั้งค่า "Who has access" เป็น "Anyone"

const SPREADSHEET_ID = "PASTE_YOUR_SPREADSHEET_ID_HERE"; // <--- !!! สำคัญมาก: แก้ไขส่วนนี้ !!!

const SHEET_NAMES = {
  STUDENTS: 'Students',
  HEALTH: 'HealthRecords',
  GROWTH: 'GrowthRecords',
  TEACHING: 'TeachingLog',
  HOMEROOM: 'HomeroomLog',
};

function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    const data = {
      students: getSheetDataAsJSON(ss.getSheetByName(SHEET_NAMES.STUDENTS)),
      healthRecords: getSheetDataAsObject(ss.getSheetByName(SHEET_NAMES.HEALTH)),
      growthRecords: getSheetDataAsObject(ss.getSheetByName(SHEET_NAMES.GROWTH)),
      teachingLog: getSheetDataAsGroupedObject(ss.getSheetByName(SHEET_NAMES.TEACHING), 'day'),
      homeroomLog: getSheetDataAsObject(ss.getSheetByName(SHEET_NAMES.HOMEROOM)),
    };
    
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // Save data to respective sheets
    saveJsonToSheet(ss.getSheetByName(SHEET_NAMES.STUDENTS), data.students);
    saveObjectToSheet(ss.getSheetByName(SHEET_NAMES.HEALTH), data.healthRecords);
    saveObjectToSheet(ss.getSheetByName(SHEET_NAMES.GROWTH), data.growthRecords);
    saveGroupedObjectToSheet(ss.getSheetByName(SHEET_NAMES.TEACHING), data.teachingLog, 'day');
    saveObjectToSheet(ss.getSheetByName(SHEET_NAMES.HOMEROOM), data.homeroomLog);
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


// === HELPER FUNCTIONS ===

function getSheetDataAsJSON(sheet) {
  if (!sheet || sheet.getLastRow() < 2) return [];
  const range = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
  const values = range.getValues();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  return values.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
        // Attempt to parse numbers
        obj[header] = isNaN(row[i]) || row[i] === '' ? row[i] : parseFloat(row[i]);
    });
    return obj;
  });
}

function getSheetDataAsObject(sheet) {
  if (!sheet || sheet.getLastRow() < 2) return {};
  const data = getSheetDataAsJSON(sheet);
  const result = {};
  data.forEach(row => {
    const id = row.id;
    delete row.id;
    result[id] = row;
  });
  return result;
}

function getSheetDataAsGroupedObject(sheet, groupBy) {
  if (!sheet || sheet.getLastRow() < 2) return {};
  const data = getSheetDataAsJSON(sheet);
  const result = {};
  data.forEach(row => {
    const key = row[groupBy];
    if (!result[key]) {
      result[key] = [];
    }
    // Don't include the grouping key in the final object
    const item = { ...row };
    delete item[groupBy];
    result[key].push(item);
  });
  return result;
}

function saveJsonToSheet(sheet, data) {
  if (!data || data.length === 0) {
    sheet.clearContents().getRange(1,1).setValue("id"); // Clear and set header if data is empty
    return;
  }
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => headers.map(header => obj[header]));
  
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function saveObjectToSheet(sheet, data) {
    const rows = Object.entries(data).map(([id, values]) => ({ id, ...values }));
    saveJsonToSheet(sheet, rows);
}

function saveGroupedObjectToSheet(sheet, data, groupBy) {
    const rows = [];
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            data[key].forEach(item => {
                const row = {};
                row[groupBy] = key;
                Object.assign(row, item);
                rows.push(row);
            });
        }
    }
    saveJsonToSheet(sheet, rows);
}
