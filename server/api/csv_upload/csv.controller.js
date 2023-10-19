const { processCSV } = require("./csv.service");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

async function csvUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    console.log("req.file", req.file);
    const uniqueIdentifier = uuidv4();
    const originalFileName = req.file.originalname;
    const fileExtension = originalFileName.split(".").pop();

    const newPath = `uploads/${uniqueIdentifier}.${fileExtension}`;

    fs.renameSync(req.file.path, newPath);

    const jsonData = await processCSV(newPath);

    if (jsonData && jsonData.length > 0) {
      res.status(200).json({ data: jsonData });
    } else {
      res.status(400).json({ error: "No data found in the file." });
    }
  } catch (error) {
    console.error("Error processing the file:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the file." });
  }
}

module.exports = { csvUpload };
