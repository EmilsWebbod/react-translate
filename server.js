const express = require('express');
const app = express();
const Multer = require('multer');

const dist = process.env.DIST || 'public/';

const storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../' + dist)
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}.json`)
  }
});

const upload = Multer({ storage });

app.post('/words', upload.single('words'),  (req, res) => {
  res.sendStatus(200);
});

app.post('/texts', upload.single('texts'), (req, res) => {
  res.sendStatus(200);
});

app.listen(3001, () => {
  console.log('File server listening on 3001');
});
