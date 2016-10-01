//spreadsheet
var spreadSheetId = "1s_cX4xJ0Ew-tYNKxMJv6eH8XWfsMs9wOTWI6UU3G6Dc"; 
var spreadSheet = SpreadsheetApp.openById(spreadSheetId);

//sheets
var batteriesSheet = spreadSheet.getSheetByName(locales.en.sheets.batteries);
var actionsSheet = spreadSheet.getSheetByName(locales.en.sheets.actions);
var optionsSheet = spreadSheet.getSheetByName(locales.en.sheets.options);
var logeSheet = spreadSheet.getSheetByName(locales.en.sheets.logger);
