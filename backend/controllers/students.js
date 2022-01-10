const Student = require('../models/Student');
// for file extension like .jpg/ .png
const path = require('path');
// use file upload to cloudinary
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Get all Students
exports.getStudents = async (req, res, next) => {
  try {
    const students = await Student.find();
    res.status(200).json({ data: students });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get single Student
exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json({ data: student });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Create a Student
exports.createStudent = async (req, res, next) => {
  try {
    const students = await Student.create(req.body);
    res.status(200).json({ data: students });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update Student
exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!student) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json({ data: student });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete Student
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    console.log(student);
    if (!student) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json({ data: {} });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Upload Student Profile
// exports.uploadProfile = async (req, res, next) => {
//   try {
//     const student = await Student.findById(req.params.id);

//     if (!student) {
//       return res.status(404).json({ message: 'Resource not found' });
//     }
//     console.log('files->', req.files);
//     // res.send('ok');

//     const profile = req.files.profile;
//     // Validate Image
//     const fileSize = profile.size / 1000;
//     console.log('fileSize->', fileSize);
//     const fileExt = profile.name.split('.')[1];
//     if (fileSize > 500) {
//       return res
//         .status(400)
//         .json({ message: 'file size must be lower than 500kb' });
//     }

//     if (!['jpg', 'png'].includes(fileExt)) {
//       return res
//         .status(400)
//         .json({ message: 'file extension must be jpg or png' });
//     }

//     const fileName = `${req.params.id}${path.extname(profile.name)}`;
//     profile.mv(`uploads/${fileName}`, async (err) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send(err);
//       }
//       // update student profile field
//       await Student.findByIdAndUpdate(req.params.id, { profile: fileName });
//       res.status(200).json({
//         data: {
//           file: `${req.protocol}://${req.get('host')}/${fileName}`,
//         },
//       });
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

exports.uploadProfile = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    console.log('files->', req.files);
    // res.send('ok');

    const profile = req.files.profile;
    // Validate image
    const fileSize = profile.size / 1000;
    // upload below 500 kb
    // const fileTxtFormat = profile.name.split('.');
    // console.log('fileTxt', fileTxtFormat);
    const fileTxtFormat = profile.name.split('.')[1];
    // console.log('fileTxt', fileTxtFormat);

    const textFormatSpecified = ['jpg', 'jpeg', 'png'].includes(fileTxtFormat);

    if (fileSize > 500) {
      // bad request
      return res.status(400).json({
        message: 'File size must be lower than 500kb',
      });
    }

    if (!textFormatSpecified) {
      // bad request
      return res.status(400).json({
        message: 'File extension must be jpg/jpeg or png',
      });
    }
    // `uploads/${profile.name}`
    const fileName = `${req.params.id}${Date.now()}${path.extname(
      profile.name
    )}`;

    // normal file upload to folder
    profile.mv(`uploads/${fileName}`, async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      // update student with profile based image upload
      // "Student" model
      await Student.findByIdAndUpdate(req.params.id, { profile: fileName });
      // res.send('success');
      res.status(200).json({
        data: {
          // send file url
          // "protocol" is http/https
          file: `${req.protocol}://${req.get('host')}/${fileName}`,
        },
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.uploadProfileCloud = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    console.log('files->', req.files);
    // res.send('ok');

    const profile = req.files.profile;
    // Validate image
    const fileSize = profile.size / 1000;
    // upload below 500 kb
    // const fileTxtFormat = profile.name.split('.');
    // console.log('fileTxt', fileTxtFormat);
    const fileTxtFormat = profile.name.split('.')[1];
    // console.log('fileTxt', fileTxtFormat);

    const textFormatSpecified = ['jpg', 'jpeg', 'png'].includes(fileTxtFormat);

    if (fileSize > 500) {
      // bad request
      return res.status(400).json({
        message: 'File size must be lower than 500kb',
      });
    }

    if (!textFormatSpecified) {
      // bad request
      return res.status(400).json({
        message: 'File extension must be jpg/jpeg or png',
      });
    }

    // start
    cloudinary.uploader.upload(
      profile.tempFilePath,
      {
        // create perticular folder
        folder: 'all-students',
        // use_filename: true,
        // unique_filename: false,
        public_id: req.params.id,
      },
      async (err, image) => {
        if (err) {
          console.log(err);
        }
        console.log('File uploaded successful!');
        // console.log(image);
        // console.log(image.url);
        // update student with profile based image upload
        // "Student" model
        // send url of image
        await Student.findByIdAndUpdate(req.params.id, { profile: image.url });
        // after upload image clean path "temp"
        fs.unlink(profile.tempFilePath, (error) => {
          if (error) {
            console.log(error);
          }
        });
        res.status(200).json({
          data: {
            // send file url
            // "protocol" is http/https
            file: image.url,
          },
        });
      }
    );

    // end cloudinary ops.
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// upload file to cloudinary
//  for testing
// cloudinary.uploader.upload(
//   'uploads/61dbe940b7249e13e47c28771641802181530.jpeg',
//   {
//     // create perticular folder
//     folder: 'all-students',
//     use_filename: true,
//     unique_filename: false,
//   },
//   (err, image) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log('File uploaded successful!');
//     console.log(image);
//     console.log(image.url);
//   }
// );
