const { processCSV } = require('./csv.service');

async function csvUpload(req, res) {
    console.log("REQ", req.file );
  try {

    const filePath = req.file.path;

    const jsonData = await processCSV(filePath);

    res.status(200).json({ data: jsonData });
  } catch (error) {

    res.status(500).json({ error: 'An error occurred while processing the CSV.' });
  }
}

module.exports = { csvUpload };
