import easyocr
import sys
# Define the image path directly in the script
image_path1 = 'C:/Users/rebhi/OneDrive/Bureau/ocr.png'
image_path = sys.argv[1]

# Initialize the EasyOCR reader (e.g., with language support for 'en' - English)
reader = easyocr.Reader(['en'])

# Perform OCR and get results
results = reader.readtext(image_path)

# Extract text from results
extracted_text = ' '.join([result[1] for result in results])

# Print the extracted text to stdout
print(extracted_text)
