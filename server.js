const express = require('express');
const app = express();
const Multer = require('multer');

const DIST = process.env.DIST || 'src/translate';
const PORT = process.env.PORT || 3001;

const storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DIST)
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}.json`)
  }
});

const upload = Multer({ storage });

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
  next();
})

app.post('/words', upload.single('words'),  (req, res) => {
  res.sendStatus(200);
});

app.post('/texts', upload.single('texts'), (req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.info(`Files server listening on port ${PORT} and saving files (words.json & texts.json) to ${DIST}`);
});
