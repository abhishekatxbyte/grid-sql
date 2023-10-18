const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
require('dotenv').config();
const userRouter = require("./api/users/user.router");

app.use(express.json());
app.use("/api/users", userRouter);

const port = process.env.APP_PORT;
app.listen(port, () => {
    console.log('Server up and running on port ' + port);
});
