/*jslint node: true */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Teacher = require('../Scheduler/teacher');
//* Password Encryption
const saltRounds = 10;
const JWT_KEY = "anSHul2114CraNK";
//*
const DOMAIN = 'localhost:3000';

module.exports = {

  getUser: function(req, res, next) {
    const id = req.params.userid.trim();
    User.findOne({
        _id: id
      }).select('-__v -role -password -_id -date').exec()
      .then(doc => {
        if (!doc) return res.status(200).json({
          msg: "No Data"
        });
        console.log(doc);
        res.on('finish', function(err, result) { mongoose.disconnect });
        res.status(200).json({
          count: doc.length,
          data: doc
        });
        res.end();
      })

      .catch(err => GenericError(res, err));
  },
  get_all_users: function(req, res, next) {
    User.find({}).select('-__v').exec()
      .then(doc => {
        if (doc.length == 0) return res.status(400).json({
          msg: "No Data"
        });
        console.log(doc);
        res.status(200).json({
          count: doc.length,
          data: DataMapper(doc),
          Teacher: new Teacher(1, doc[0].firstname, ['Maths', 'Physics'], [1, 2])
        });
        res.end();
      })

      .catch(err => GenericError(res, err));

  },

  signup: function(req, res, next) {

    var user, pass = req.body.password.trim();

    if (!pass) {
      return res.status(400).json({
        error: "No Password Provided"
      });
    } else if (pass.length < 8) {
      return res.status(400).json({
        error: "Password doesn't met the required length"
      });
    }

    bcrypt.hash(pass, saltRounds).then(function(hash) {
        const user = Sanitize(req.body, hash);
        return user.save();

      }).then(doc => {
        res.status(201).json({
          count: doc.length,
          message: 'User Added',
          Data: DataMapper([doc])
        });
        res.end();
      })
      .catch(err => GenericError(res, err));

  },
  login: function(req, res, next) {
    var param = req.body.param;
    User.find({
        $or: [
          { username: param },
          { email: param }
        ]
      })
      .exec()
      .then(result => {
        if (result.length == 0) {
          return res.status(404).json({
            msg: 'Authentication Failed'
          });
        }
        bcrypt.compare(req.body.password.trim(), result[0].password, function(err, output) {
          if (err) {
            return res.status(404).json({
              msg: 'Authentication Failed'
            });
          }

          const token = jwt.sign({
              id: result[0]._id,
              email: result[0].email
            },
            JWT_KEY, { expiresIn: "2h" });

          if (output == true) {
            console.log(result);
            res.status(200).json({
              User: {
                id: result[0]._id,
                name: result[0].firstname + " " + result[0].lastname
              },
              msg: 'Authentication Successfull',
              webToken: token
            });
          } else {
            return res.status(404).json({
              msg: 'Authentication Failed'
            });
          }
          res.end();
        });

      })
      .catch(err => GenericError(res, err));
  },
  updateUser: function(req, res, next) {

    const id = req.params.userid.trim();

    const UpdateOps = {};
    for (const ops of req.body) {
      if (ops.propName == 'username') return res.status(403).json({ msg: "username cannot be changed" });
      UpdateOps[ops.propName] = ops.value.trim();
    }

    User.findByIdAndUpdate({
        _id: id
      }, {
        $set: UpdateOps
      })
      .exec()
      .then(doc => {
        if (!doc) {
          return res.status(404).json({
            status: {
              ObjectId: id,
              msg: "Object Doesn't Exists"
            }
          });
        }
        console.log(doc);
        res.status(200).json({
          msg: 'Data updated',
          request: {
            type: "GET",
            url: 'http://' + DOMAIN + '/user/' + id
          }
        });
        res.end();
      })
      .catch(err => GenericError(res, err));
  },

  deleteUser: function(req, res, next) {

    const id = req.params.userid.trim();

    User.findByIdAndRemove({
        _id: id
      })
      .exec()
      .then(doc => {
        if (!doc) {
          return res.status(404).json({
            status: {
              ObjectId: id,
              msg: "Object Doesn't Exists"
            }
          });
        }
        console.log(doc);
        res.status(200).json({
          status: {
            ObjectId: id,
            msg: "Object Deleted"
          }
        });
        res.end();
      })
      .catch(err => GenericError(res, err));

  },

  deleteAllUsers: function(req, res, next) {

    User.remove()
      .exec()
      .then(doc => {
        if (!doc) {
          return res.status(404).json({
            status: {
              msg: "Object Doesn't Exists"
            }
          });
        }
        console.log(doc);
        res.status(200).json({
          status: {
            msg: "Objects Deleted"
          }
        });
        res.end();
      })
      .catch(err => GenericError(res, err));
  }

}

// Non-exportable functions

function GenericError(res, err) {
  return console.error(err);
  res.status(400).json({
    error: err
  });
  res.end();
}

function DataMapper(dat) {
  console.log(dat);
  return dat.map(data => {
    return {
      name: data.firstname + " " + data.lastname,
      college: data.college,
      email: data.email,
      request: {
        type: "GET",
        url: 'http://' + DOMAIN + '/user/' + data._id
      }
    }
  });
}


//sets the recived data according to given norms
function Sanitize(req, hash) {

  const role = 'User';
  user = new User({
    _id: new mongoose.Types.ObjectId(),
    username: req.username.trim(),
    firstname: jsUcfirst(req.firstname.trim()),
    lastname: jsUcfirst(req.lastname.trim()),
    email: req.email.trim(),
    password: hash,
    country: req.country.trim(),
    college: req.college.trim(),
    role: role
  });
  return user;
}
//Capitalize first letter
function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}