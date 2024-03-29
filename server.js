import express from 'express';
import Multer from 'multer';
const app = express();

const DIST = process.env.DIST || 'src/translate';
const PORT = process.env.PORT || 7345;

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
  res.header("Access-Control-Allow-Origin", 'http://localhost:7345');
  next();
})

app.post('/words', upload.single('words'),  (req, res) => {
  res.sendStatus(200);
});

app.post('/texts', upload.single('texts'), (req, res) => {
  res.sendStatus(200);
});

app.post('/settings', upload.single('settings'), (req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.info(`Files server listening on port ${PORT} and saving files (words.json & texts.json) to ${DIST}`);
});
