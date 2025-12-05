# IEEE CSR8 AI Caravan Regional Summit Poster Generator

A web application for generating personalized posters for the IEEE CSR8 AI Caravan Regional Summit. Users can upload their photos and create custom posters with the event branding.

## Features

- Upload and preview images before generating the poster
- Automatic image resizing and positioning on the poster template
- Real-time preview of the generated poster
- Download functionality with a single click
- Responsive design that works on desktop, tablet, and mobile devices
- Orange-themed UI matching the IEEE CSR8 AI Caravan website
- Drag and drop file upload support
- File validation (type and size checking)
- Error handling with user-friendly messages

## Requirements

- Python 3.7 or higher
- Flask
- Pillow (PIL)
- Werkzeug

## Installation

1. Clone or download this repository

2. Install the required Python packages:
```bash
pip install flask pillow werkzeug
```

Or use a requirements file:
```bash
pip install -r requirements.txt
```

3. Ensure you have the poster template image:
   - Place your poster template as `static/images/poster_template.png`
   - The template should be a PNG file with the desired poster layout

## Project Structure

```
Poster/
├── app.py                    # Flask application main file
├── templates/
│   └── upload.html          # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css        # Stylesheet with orange theme
│   ├── js/
│   │   └── main.js          # JavaScript for form handling and preview
│   └── images/
│       └── poster_template.png  # Poster template image
├── uploads/                 # Directory for user uploads (auto-created)
└── README.md               # This file
```

## Configuration

The application can be configured in `app.py`:

- `UPLOAD_FOLDER`: Directory for storing uploaded files (default: "uploads")
- `ALLOWED_EXT`: Allowed image file extensions (default: png, jpg, jpeg, gif)
- `POSTER_TEMPLATE`: Path to the poster template image
- `MAX_CONTENT_LENGTH`: Maximum file upload size (default: 30MB)

### Poster Template Settings

In `app.py`, you can adjust:
- Image resize dimensions: `img.resize((280, 280))`
- Position on template: `position = (350, 170)`

Adjust these values based on your template design.

## Usage

1. Start the Flask development server:
```bash
python app.py
```

2. Open your web browser and navigate to:
```
http://localhost:5000
```

3. Upload an image:
   - Click "Choose File" or drag and drop an image
   - Supported formats: PNG, JPG, JPEG, GIF
   - Maximum file size: 30MB
   - Image must be square for best results

4. Generate the poster:
   - Click "Generate Poster"
   - Wait for processing (loading indicator will show)

5. Preview and download:
   - The generated poster will appear in the preview section
   - Click "Download Poster" to save the image

## API Endpoints

### GET /
Renders the main upload page.

### POST /generate
Generates a poster from the uploaded image.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: Form data with 'image' field containing the image file

**Response:**
- Success (200):
  ```json
  {
    "success": true,
    "image": "data:image/png;base64,..."
  }
  ```
- Error (400/500):
  ```json
  {
    "error": "Error message"
  }
  ```

## Technical Details

### Image Processing
- User images are automatically resized to 280x280 pixels
- Images are positioned at coordinates (350, 170) on the template
- Final output is in PNG format with transparency support

### Frontend
- Uses Fetch API for asynchronous requests
- Base64 encoding for image preview
- Smooth scrolling and animations
- Responsive CSS Grid and Flexbox layouts

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- CSS Grid and Flexbox support required

## Troubleshooting

### Template Not Found Error
- Ensure `poster_template.png` exists in `static/images/` directory
- Check the file path in `app.py` matches your file location

### Image Upload Fails
- Verify file size is under 30MB
- Check file format is supported (PNG, JPG, JPEG, GIF)
- Ensure the uploads directory has write permissions

### Preview Not Showing
- Check browser console for JavaScript errors
- Verify Flask server is running and accessible
- Ensure image processing completed successfully

### Download Button Not Working
- Check browser allows downloads
- Verify the preview image loaded correctly
- Try right-clicking the preview image and "Save As"

## Development

### Running in Debug Mode
The application runs in debug mode by default. For production:
- Set `debug=False` in `app.py`
- Configure proper error handling
- Use a production WSGI server (e.g., Gunicorn)

### Customization
- Modify `static/css/style.css` for styling changes
- Update `templates/upload.html` for layout changes
- Adjust image processing parameters in `app.py`

## License

This project is created for IEEE CSR8 AI Caravan Regional Summit.

## Support

For issues or questions, please contact the IEEE CSR8 AI Caravan team or visit the main website at https://ieeecsr8aicaravan.site/

