"use strict";

var ENTRIES_PER_PAGE = 10;

var express = require('express');
var app = express();
var multer = require('multer');

var md5 = require('MD5');
var moment = require('moment');
var gm = require('gm').subClass({imageMagick: true});

var knex = require('knex')({
  client : 'mysql',
  connection : require('./db.json')
});

app.use(function (req, res, next) {
  console.log((new Date()) + ' ' + req.method + ': ' + req.url);
  next();
});

app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended : true }));
app.use(require('cookie-parser')());

app.get('/api/list/:page', function (req, res) {
  var page = parseInt(req.params.page, 10);
  knex('entries').select('id').where('deleted', 0).orderBy('id', 'DESC')
    .offset(ENTRIES_PER_PAGE * page).limit(ENTRIES_PER_PAGE)
    .exec(function (err, result) {
      if (err) {
        console.log(err);
        return res.send({
          code : 1,
          error : err
        });
      }
      else {
        return res.send({
          code : 0,
          data : result.map(function (item) {
            return item.id;
          })
        });
      }
    });
});

app.get('/api/get/:id', function (req, res) {
  var id = parseInt(req.params.id);
  knex('entries').where('id', id).exec(function (err, result) {
    if (err) {
      console.log(err);
      return res.send({
        code : 1,
        error : err
      });
    }
    else if (result.length == 0) {
      console.log('Entry not found: ', id);
      return res.send({
        code : -1,
        error : 'Entry not found: ' + id
      });
    }
    else {
      var ret = result[0];
      knex('pictures').where({
        entry : id,
        deleted : 0
      }).exec(function (err, result) {
        if (err) {
          console.log(err);
          return res.send({
            code : 1,
            error : err
          });
        }
        else {
          ret.images = result.map(function (item) {
            return {
              src : item.url,
              w : item.width,
              h : item.height
            }
          });
          return res.send({
            code : 0,
            data : ret
          });
        }
      });
    }
  });
});

app.post('/api/login', function (req, res) {
  var username = req.body.username;
  var password = md5(req.body.password);

  knex('users').where('username', username).exec(function (err, result) {
    if (err) {
      console.log(err);
      return res.send({
        code : 1,
        error : err
      });
    }
    else if (result.length === 0 || result[0].password != password) {
      return res.send({
        code : -1,
        error : 'Username or password invalid'
      });
    }
    else {
      var date = moment();
      var token = md5(moment().toString() + username + password);
      knex('sessions').insert({
        username : username,
        token : token,
        expire : date.add(7, 'd').format('YYYY-MM-DD HH:mm:ss')
      }).exec(function (err) {
        if (err) {
          console.log(err);
          return res.send({
            code : 1,
            error : err,
          });
        }
        else {
          res.cookie('token', token, {
            expires : date.add(7, 'd').toDate()
          });
          return res.send({
            code : 0,
            username : username
          });
        }
      })
    }
  });
});

app.use('/api/admin', function (req, res, next) {
  if (!req.cookies.token) {
    return res.send({
      code : -1,
      error : 'Need login'
    });
  }
  else {
    knex('sessions').where('token', req.cookies.token)
      .exec(function (err, result) {
        if (err) {
          console.log(err);
          return res.send({
            code : 1,
            error : err
          });
        }
        else if (result.length === 0) {
          return res.send({
            code : 1,
            error : 'No session record found'
          })
        }
        else {
          if (!moment().isBefore(result[0].expire)) {
            return res.send({
              code : -1,
              error : 'Need login'
            });
          }
          else {
            return next();
          }
        }
      })
  }
});

app.get('/api/admin/check', function (req, res) {
  return res.send({
    code : 0
  });
});

app.get('/api/admin/new', function (req, res) {
  knex('entries').insert({
    date : moment().format('YYYY-MM-DD'),
    deleted : 1
  }).exec(function (err, result) {
    if (err) {
      console.log(err);
      return res.send({
        code : 1,
        error : err
      });
    }
    else {
      return res.send({
        code : 0,
        id : result[0]
      });
    }
  });
});

app.post('/api/admin/update', function (req, res) {
  knex('entries').where('id', req.body.id).update({
    content : req.body.content,
    deleted : 0
  }).exec(function (err) {
    if (err) {
      console.log(err);
      return res.send({
        code : 1,
        error : err
      });
    }
    else
      return res.send({
        code : 0
      });
  });
});

app.use('/api/admin/upload', multer({
  dest: './client/uploads/',
  fileSize: 10 * 1024 * 1024,
  putSingleFileInArray: true,
  rename: function () {
    var randStr = function(len) {
      let ret = '';
      const ALPHA = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      while (len--)
        ret += ALPHA[0 | (Math.random() * ALPHA.length)];
      return ret;
    };
    return randStr(32);
  },
  onFileUploadComplete: function (file, req, res) {
    if (file && !file.truncated) {
      gm(file.path).resize(1024, 1024).autoOrient().noProfile()
      .write(file.path, function (err) {
        if (err) {
          console.log(err);
          return res.send({
            code : -5,
            error : 'Disk unwritable'
          });
        }
        gm(file.path).size(function (err, size) {
          if (err) {
            console.log(err);
            return res.send({
              code : -4,
              error : 'Invalid image'
            });
          }
          gm(file.path)
            .resize(150, 150)
            .autoOrient()
            .noProfile()
            .write(
              file.path +
              '.min.' +
              file.extension, function(err) {
            if (err) {
              console.log(err);
              return res.send({
                code : -5,
                error : 'Disk unwritable'
              });
            }
              
            knex('pictures').insert({
              url : '/uploads/' + file.name,
              entry : req.body.eid,
              width : size.width,
              height : size.height
            }).exec(function(err, result) {
              if (err || result.length === 0) {
                console.log(err);
                return res.send({
                  code : -6,
                  error : 'Database Error'
                });
              }
              return res.send({
                code : 0,
                pid : result[0]
              })
            });
          })
        });
      })
    }
    else {
      if (!file) {
        return res.send({
          code : -1,
          error : 'No file uploaded'
        });
      }
      if (file.truncated) {
        return res.send({
          code : -3,
          error : 'File to large'
        });
      }
    }
  }
}));

app.post('/api/admin/upload', function (req, res) {});

app.use(express.static('client'));

app.listen(3000);
