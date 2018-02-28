const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const userRoutes = require('./API/routes/users');
const timetableRoutes = require('./API/routes/timetable');
const DataBase = require('./api/controllers/database');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//To prevent CORS Errors

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Accept,Content-Type,Authorization");
  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST,GET,DELETE,PATCH');
    return res.status(200).json({});
  }
  next();
});

//Routes used to handle requests

app.use('/user', userRoutes);
app.use('/timetable', timetableRoutes);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});



module.exports = app;