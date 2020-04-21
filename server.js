require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const config = require('./config');

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) console.log(err);
    console.log("Connected to database");
});

// app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(morgan('dev'));

const contactRoutes = require('./routes/contacts');
app.use('/api/contacts', contactRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(config.port, () => {
    console.log("Listening on server " + config.port);
});