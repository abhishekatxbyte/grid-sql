import asyncHandler from "express-async-handler";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import rimraf from "rimraf"; // Import the rimraf library
import connectDB from "../config/db.js";
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
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

async function getData(req, res) {
  let client;

  try {
    const uniqueIdentifier = req.query.unique_identifier;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortDirection =
      req.query.sort === "asc" ? 1 : req.query.sort === "desc" ? -1 : 1; // Default to ascending order if not provided
    const sortField = req.query.sortField || "_id"; // Default to sorting by "_id" if not provided
    console.log(sortField);
    const dbConnection = await connectDB();
    client = dbConnection.connection.client;

    const db = client.db("grid");
    const collection = db.collection("gridData");

    const query = { unique_identifier: uniqueIdentifier };

    const result = await collection
      .find(query)
      .sort({ [sortField]: sortDirection }) // Sort by the specified field and direction
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalDocuments = await collection.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / limit);

    res.json({ data: result, totalPages });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Database error" });
  }
}
async function updateData(req, res) {
  let client;
  try {
    const dbConnection = await connectDB();
    client = dbConnection.connection.client;
    const db = client.db("grid");
    const collection = db.collection("gridData");
    const document_id = new ObjectId(req.body.document_id);
    const update_field = req.body.update_field;
    const update_value = req.body.update_value;

    console.log("Document ID:", document_id);
    console.log("Update Field:", update_field);
    console.log("Update Value:", update_value);

    const query = { _id: document_id };
    const update = {
      $set: {
        [update_field]: update_value,
      },
    };

    console.log("Query:", query);
    console.log("Update:", update);

    const result = await collection.updateOne(query, update);
    console.log("Update Result:", result);

    if (result.matchedCount === 1 && result.modifiedCount === 1) {
      res.json({ message: "Field updated successfully" });
    } else {
      res
        .status(404)
        .json({ error: "Document not found or field not updated" });
    }
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ error: "Database error", message: error.message });
  }
}

export { getData, uploadFile, updateData };
