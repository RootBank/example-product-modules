// This file contains a set of generic functions that can
// parse a CSV string and enable Excel-like cell and range access.

// Parses a CSV string into a 2D array
const csvParser = (csvString) => {
  const rows = csvString.trim().split('\n');
  return rows.map(row => parseRow(row));
};
const parseRow = (row) => {
  const result = [];
  let inQuotes = false;
  let value = '';

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(value);
      value = '';
    } else {
      value += char;
    }
  }
  result.push(value);
  return result;
};

// Gets a cell value from a 2D array using A1 notation (e.g. "B7")
const getCell = (data, cell) => {
  const column = cell.charCodeAt(0) - 65; // Convert letter to column index (A=0, B=1, ...)
  const row = parseInt(cell.slice(1), 10) - 1; // Convert row number to index (1-based to 0-based)
  return data[row][column];
};

// Gets a range of values from a 2D array using A1 notation (e.g. "B7:D10")
const getRange = (data, range) => {
  const [start, end] = range.split(':');
  
  const startColumn = start.charCodeAt(0) - 65;
  const startRow = parseInt(start.slice(1), 10) - 1;
  
  const endColumn = end.charCodeAt(0) - 65;
  const endRow = parseInt(end.slice(1), 10) - 1;
  
  const rangeData = [];
  
  for (let row = startRow; row <= endRow; row++) {
    const rowData = [];
    for (let col = startColumn; col <= endColumn; col++) {
      let cellData = data[row][col];
      if (cellData !== undefined)
        cellData = cellData.trim();
      rowData.push(cellData);
    }
    rangeData.push(rowData);
  }
  
  return rangeData;
};
// The Sheet class provides a simple interface for working with Excel-like data.
// Example usage:
//   const sheet = new Sheet(csvString);
//   const cellValue = sheet.getCell('B7');
class Sheet {
  constructor(csvString) {
    this.data = csvParser(csvString);
  }

  getCell(cell) {
    return getCell(this.data, cell);
  }

  getRange(range) {
    return getRange(this.data, range);
  }
};
