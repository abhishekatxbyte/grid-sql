// import asyncHandler from "express-async-handler";
// import xlsx from "xlsx";
// import path from "path";
// import fs from "fs";
// import pkg from "papaparse";
// const Papa = pkg;

// const uploadFile = asyncHandler(async (req, res) => {
//   if (!req.files || !req.files.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const uploadedFile = req.files.file;
//   const fileName = uploadedFile.name;

//   // Set the destination directory for temporary storage
//   const tempDir = path.join(__dirname, "temp");
//   const tempFilePath = path.join(tempDir, fileName);

//   // Move the uploaded file to the server
//   uploadedFile.mv(tempFilePath, async function (err) {
//     if (err) {
//       return res.status(500).send(err);
//     }

//     let jsonData = [];
//     const extension = path.extname(fileName).toLowerCase();

//     if (extension === ".csv") {
//       // Parse CSV using PapaParse
//       const csvData = fs.readFileSync(tempFilePath, "utf8");
//       const parseResult = await new Promise((resolve) => {
//         Papa.parse(csvData, { header: true, complete: resolve });
//       });
//       jsonData = parseResult.data;
//     } else if (extension === ".xlsx") {
//       // Convert Excel to CSV
//       const workbook = xlsx.readFile(tempFilePath);
//       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//       const csvData = xlsx.utils.sheet_to_csv(worksheet);

//       // Parse the CSV using PapaParse
//       const parseResult = await new Promise((resolve) => {
//         Papa.parse(csvData, { header: true, complete: resolve });
//       });
//       jsonData = parseResult.data;
//     } else {
//       // Unsupported file format
//       fs.unlinkSync(tempFilePath);
//       return res.status(400).json({ error: "Unsupported file format" });
//     }

//     // Clean up the temporary file
//     fs.unlinkSync(tempFilePath);

//     res.json({ data: jsonData });
//   });
// });

// export { uploadFile };

//python

import asyncHandler from "express-async-handler";
import xlsx from "xlsx";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import pkg from "papaparse";
const Papa = pkg;

const uploadFile = asyncHandler(async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const uploadedFile = req.files.file;
  const fileName = uploadedFile.name;

  // Set the destination directory for temporary storage
  const tempDir = path.join(__dirname, "temp");
  const tempFilePath = path.join(tempDir, fileName);

  // Move the uploaded file to the server
  uploadedFile.mv(tempFilePath, async function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    let jsonData = [];
    const extension = path.extname(fileName).toLowerCase();

    if (extension === ".csv") {
      const pythonScriptPath = path.join(__dirname, "processCsv.py");

      // Check if the Python script file exists
      if (!fs.existsSync(pythonScriptPath)) {
        return res.status(500).json({ error: "Python script file not found" });
      }

      console.log("Python Script Path: " + pythonScriptPath);

      const pythonProcess = spawn("python3", [pythonScriptPath, tempFilePath]);

      pythonProcess.on("error", (error) => {
        return res
          .status(500)
          .json({ error: "Python script execution failed" });
      });

      let pythonScriptOutput = "";
      pythonProcess.stdout.on("data", (data) => {
        pythonScriptOutput += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code === 0) {
          try {
            const jsonData = JSON.parse(pythonScriptOutput);
            return res.json({ data: jsonData });
          } catch (error) {
            return res
              .status(500)
              .json({ error: "Invalid JSON data received from Python script" });
          }
        } else {
          return res
            .status(500)
            .json({ error: "Python script execution failed" });
        }
      });
    } else if (extension === ".xlsx") {
      const pythonScriptPath = path.join(__dirname, "processCsv.py");

      // Check if the Python script file exists
      if (!fs.existsSync(pythonScriptPath)) {
        return res.status(500).json({ error: "Python script file not found" });
      }

      console.log("Python Script Path: " + pythonScriptPath);

      const pythonProcess = spawn("python3", [pythonScriptPath, tempFilePath]);

      pythonProcess.on("error", (error) => {
        return res
          .status(500)
          .json({ error: "Python script execution failed" });
      });

      let pythonScriptOutput = "";
      pythonProcess.stdout.on("data", (data) => {
        pythonScriptOutput += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code === 0) {
          try {
            const jsonData = JSON.parse(pythonScriptOutput);
            return res.json({ data: jsonData });
          } catch (error) {
            return res
              .status(500)
              .json({ error: "Invalid JSON data received from Python script" });
          }
        } else {
          return res
            .status(500)
            .json({ error: "Python script execution failed" });
        }
      });
    } else {
      // Unsupported file format
      fs.unlinkSync(tempFilePath);
      return res.status(400).json({ error: "Unsupported file format" });
    }

    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);

    res.json({ data: jsonData });
  });
});
export { uploadFile };
