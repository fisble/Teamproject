const pdfParse = require('pdf-parse');

const extractTextFromPDF = async (pdfBuffer) => {
  try {
    const data = await pdfParse(pdfBuffer);
    let text = data.text;

    // Clean text: remove extra spaces, special characters
    text = text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[^\w\s\-\.,]/g, '') // Remove special characters except common ones
      .trim();

    // Limit to 4000 characters
    if (text.length > 4000) {
      text = text.substring(0, 4000);
    }

    return text;
  } catch (error) {
    throw new Error('Failed to parse PDF: ' + error.message);
  }
};

module.exports = { extractTextFromPDF };
