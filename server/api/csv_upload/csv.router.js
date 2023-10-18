const express = require('express');
const router = express.Router();
const { csvUpload } = require('./csv.controller');
const { checkToken } = require('../../auth/token_validation');

router.post('/csvupload', csvUpload);

module.exports = router;
