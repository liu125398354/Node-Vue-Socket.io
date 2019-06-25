/**
 * Created by liunannan on 2017/12/24.
 */
const login = require('./user');
const doctor = require('./doctor');
const express = require('express');
const fs = require('fs');
const formidable = require('formidable');
const path = require('path');
const router = express.Router();

router.post('/api/login/createAccount', (req, res) => {
  login.findUser(req.body.account, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      if (data) {
        res.json({
          errno: 0,
          data: '用户已存在'
        });
      } else {
        // eslint-disable-next-line new-cap
        let newUser = new login({
          account: req.body.account,
          password: req.body.password,
          image: req.body.image,
          identity: req.body.identity
        });
        newUser.save((err, data) => {
          if (err) {
            res.send(err);
          } else {
            res.json({
              errno: 1,
              data: '注册成功'
            });
          }
        });
      }
    }
  });
});

router.post('/api/login/getAccount', (req, res) => {
  login.findUser(req.body.account, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      if (!data) {
        res.json({
          errno: 0,
          data: '用户不存在'
        });
      } else {
        var state = data.comparePassword(req.body.password);
        if (state === true) {
          res.json({
            errno: 1,
            data: data
          });
        } else {
          res.json({
            errno: 2,
            data: '密码不正确'
          });
        }
      }
    }
  });
});

router.post('/api/voice/upload', (req, res) => {
  let form = new formidable.IncomingForm();
  form.uploadDir = './uploadVoice';
  // eslint-disable-next-line handle-callback-err
  form.parse(req, function(err, fields, files) {
    let shu = fields.new;
    fs.writeFile('./aa.txt', shu, function (err) {
      if (err) {
        console.log('fail');
      } else {
        console.log('succeed');
      }
    });
    // eslint-disable-next-line no-path-concat
    let oldPath = __dirname + '/' + files.audio.path;
    let splitPath = files.audio.path.split('_');
    let fileName = splitPath[splitPath.length - 1];
    let extName = '.wav';
    // eslint-disable-next-line no-path-concat
    let newPath = __dirname + '/uploadVoice/' + fileName + extName;
    fs.rename(oldPath, newPath, function(err) {
      if (err) {
        console.log('fail: ' + err);
      }
    });
    res.writeHead(200, {'content-type': 'text/plain'});
    res.end('succeed');
  });
});

router.post('/api/img/upload', (req, res) => {
  let form = new formidable.IncomingForm();
  form.uploadDir = './uploadImg';
  // eslint-disable-next-line handle-callback-err
  form.parse(req, function(err, fields, files) {
    // eslint-disable-next-line no-path-concat
    let oldPath = __dirname + '/' + files.picture.path;
    let splitPath = files.picture.path.split('_');
    let fileName = splitPath[splitPath.length - 1];
    let extName = path.extname(files.picture.name);
    // eslint-disable-next-line no-path-concat
    let newPath = __dirname + '/uploadImg/' + fileName + extName;
    fs.rename(oldPath, newPath, function(err) {
      if (err) {
        console.log('fail: ' + err);
      }
    });
    res.writeHead(200, {'content-type': 'text/plain'});
    res.end('succeed');
  });
});

router.get('/api/doctors/getBasicInformation', (req, res) => {
  doctor.find({}, (err, doctorData) => {
    if (err) {
      res.send(err);
    } else {
      if (doctorData) {
        res.json({
          errno: 1,
          data: doctorData[0]
        });
      }
    }
  });
});

module.exports = router;
