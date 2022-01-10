const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

const connectDatabase = require('./config/database');
const fileUpload = require('express-fileupload');
const path = require('path');

dotenv.config({ path: './config/config.env' });

connectDatabase();

const students = require('./routes/students');

const app = express();

if (process.env.NODE_ENV != 'production') {
  app.use(morgan('dev'));
}

app.use(cors());

app.use(express.json());
// app.use(fileUpload());
// if use cloudinary
app.use(
  fileUpload({
    debug: true,
    useTempFiles: true,
    // path for cloudinary
    tempFileDir: path.join(__dirname, './temp'),
  })
);
// if use cloudinary end

// make "uploads" as static image folder
app.use(express.static('uploads'));
app.use('/api/v1/students', students);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server running at port: ${PORT}`)
);
