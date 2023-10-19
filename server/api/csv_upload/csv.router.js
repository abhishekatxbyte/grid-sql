// const express = require('express');
// const router = express.Router();
// const { csvUpload } = require('./csv.controller');
// const { checkToken } = require('../../auth/token_validation');

// router.post('/csvupload', csvUpload);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { csvUpload } = require('./csv.controller');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/csvupload', upload.single('file'), csvUpload);

module.exports = router;
// clg