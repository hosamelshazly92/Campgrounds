const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const dbPort = 27017;
const dbName = 'camp';
mongoose.connect(`mongodb://localhost:${dbPort}/${dbName}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log(`==========> DB server is running on port: ${dbPort}`);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
});

const port = 3000;
app.listen(port, () => {
    console.log(`==========> Server is running on port: ${port}`);
});