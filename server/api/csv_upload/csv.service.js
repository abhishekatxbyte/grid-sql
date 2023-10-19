// const fs = require('fs');
// const csv = require('csv-parser');

// function processCSV(filePath) {
//   return new Promise((resolve, reject) => {
//     const results = [];

//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on('data', (data) => results.push(data))
//       .on('end', () => {
//         resolve(results);
//       })
//       .on('error', (error) => {
//         reject(error);
//       });
//   });
// }

// module.exports = { processCSV };



const fs = require('fs').promises; 
const XLSX = require('xlsx');

async function processCSV(filePath) {
  try {
    const data = await fs.readFile(filePath); 
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
    });

    const headerRow = jsonData[0];
    const formattedData = jsonData.slice(1).map((row, index) => {
      const obj = {};
      headerRow.forEach((key, index) => {
        const value = row[index];

        if (value !== "" && value !== undefined) {
          obj[key] = value;
        }
      });
      obj.key = index + 1;
      return obj;
    });

    return formattedData;
  } catch (error) {
    throw error;
  }
}

module.exports = { processCSV };




