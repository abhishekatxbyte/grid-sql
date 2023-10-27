import asyncHandler from "express-async-handler";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import rimraf from "rimraf"; // Import the rimraf library
import connectDB from "../config/db.js";

const uploadFile = asyncHandler(async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const uploadedFile = req.files.file;
  const fileName = uploadedFile.name;

  const tempDir = path.join(__dirname, "temp");
  const tempFilePath = path.join(tempDir, fileName);

  uploadedFile.mv(tempFilePath, async function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    const extension = path.extname(fileName).toLowerCase();

    if (extension === ".csv" || extension === ".xlsx") {
      const pythonScriptPath = path.join(__dirname, "processCsv.py");

      if (!fs.existsSync(pythonScriptPath)) {
        return res.status(500).json({ error: "Python script file not found" });
      }

      const pythonProcess = spawn("python3", [pythonScriptPath, tempFilePath]);
      let pythonOutput = ""; // To capture the output from the Python script

      pythonProcess.stdout.on("data", (data) => {
        pythonOutput += data.toString();
      });

      pythonProcess.on("error", (error) => {
        return res
          .status(500)
          .json({ error: "Python script execution failed" });
      });

      pythonProcess.on("close", (code) => {
        if (code === 0) {
          // Processing completed successfully
          // Remove the temporary directory forcefully
          rimraf(tempDir, () => {
            // Recreate the temporary directory
            fs.mkdirSync(tempDir);

            // Extract the unique identifier from the python output
            const match = /"unique_identifier": "([a-f0-9]+)"/.exec(
              pythonOutput
            );
            const uniqueIdentifier = match ? match[1] : null;

            return res.json({
              message: "File uploaded and processed successfully",
              pythonOutput: uniqueIdentifier, // Include only the unique identifier in the response
            });
          });
        } else {
          // Python script execution failed
          return res
            .status(500)
            .json({ error: "Python script execution failed" });
        }
      });
    } else {
      // Remove the temporary file, as it's an unsupported format
      fs.unlinkSync(tempFilePath);
      return res.status(400).json({ error: "Unsupported file format" });
    }
  });
});
//using params
// async function getData(req, res) {
//   let client; // Define the client variable

//   try {
//     // Extract the query parameter from the request
//     const uniqueIdentifier = req.query.unique_identifier;

//     // Establish a connection to the MongoDB database using connectDB
//     const dbConnection = await connectDB();
//     client = dbConnection.connection.client; // Assign the client

//     const db = client.db("grid"); // Access the database name
//     const collection = db.collection("gridData");

//     // Construct the query to find documents with the specified unique_identifier
//     const query = { unique_identifier: uniqueIdentifier };

//     // Fetch all documents that match the query
//     const result = await collection.find(query).toArray();

//     // No need to close the client here

//     res.json(result);
//   } catch (error) {
//     console.log("Error: " + error);
//     res.status(500).json({ error: "Database error" });
//   }
// }

async function getData(req, res) {
  let client; // Define the client variable

  try {
    // Extract the query parameter from the request
    const uniqueIdentifier = req.query.unique_identifier;

    // Establish a connection to the MongoDB database using connectDB
    const dbConnection = await connectDB();
    client = dbConnection.connection.client; // Assign the client

    const db = client.db("grid"); // Access the database name
    const collection = db.collection("gridData");

    // Construct the query to find documents with the specified unique_identifier
    const query = { unique_identifier: uniqueIdentifier };

    // Fetch all documents that match the query
    const result = await collection.find(query).toArray();

    // No need to close the client here

    res.json(result);
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Database error" });
  }
}

export { getData, uploadFile };
