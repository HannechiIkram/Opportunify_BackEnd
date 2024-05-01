const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });


router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const jobInfo  = await Tesseract.recognize(imagePath, 'eng');


    if (!jobInfo) {
        res.json({ success: false, error: 'No text was extracted from the image.' });
        return;
    }console.log('OCR Output:', jobInfo); 
    res.json({ success: true, jobInfo: jobInfo.data.text  });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
module.exports = router;
/*
// Function to parse OCR output and extract job information
function parseJobInfo(text) {
  // Implement your logic to extract job title, salary, location, qualifications, etc.
  const jobInfo = {
    title: extractJobTitle(text),
    salary: extractSalary(text),
    location: extractLocation(text),
    qualifications: extractQualifications(text),
    // Add other fields as needed
  };
  return jobInfo;
}
/*
// Implement specific extraction functions as needed
function extractJobTitle(text) {
  // Add logic to extract job title
  return 'Sample Job Title';
}

function extractSalary(text) {
  // Add logic to extract salary information
  return '$50,000';
}

function extractLocation(text) {
  // Add logic to extract location
  return 'New York, NY';
}

function extractQualifications(text) {
  // Add logic to extract qualifications
  return 'Bachelor\'s degree in Computer Science';
}

*/
