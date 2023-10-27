import asyncHandler from "express-async-handler";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

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

      pythonProcess.on("error", (error) => {
        return res
          .status(500)
          .json({ error: "Python script execution failed" });
      });

      const jsonData = [];

      // Listen for data events and collect the output in chunks
      pythonProcess.stdout.on("data", (data) => {
        // Process the data as it arrives
        const lines = data.toString().split("\n");
        lines.forEach((line) => {
          if (line.trim() !== "") {
            try {
              const parsedData = JSON.parse(line);
              jsonData.push(parsedData);
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        });
      });
      pythonProcess.on("close", (code) => {
        if (code === 0) {
          return res.json({ data: jsonData });
        } else {
          return res
            .status(500)
            .json({ error: "Python script execution failed" });
        }
      });
    } else {
      fs.unlinkSync(tempFilePath);
      return res.status(400).json({ error: "Unsupported file format" });
    }
  });
});

export { uploadFile };
