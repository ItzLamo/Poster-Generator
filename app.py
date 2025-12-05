from flask import Flask, request, send_file, render_template, jsonify
from PIL import Image
import io
import os
import base64
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = "uploads"
ALLOWED_EXT = {'png', 'jpg', 'jpeg', 'gif'}
POSTER_TEMPLATE = os.path.join('static', 'images', 'poster_template.png')

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 30 * 1024 * 1024  # 30MB max file size

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXT

@app.route("/")
def home():
    return render_template("upload.html")  # the main front-end page

@app.route("/generate", methods=["POST"])
def generate():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    file = request.files['image']
    if file.filename == "":
        return jsonify({"error": "No image selected"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        img = Image.open(file).convert("RGBA")

        # Load poster template
        if not os.path.exists(POSTER_TEMPLATE):
            return jsonify({"error": "Poster template not found"}), 500
        poster = Image.open(POSTER_TEMPLATE).convert("RGBA")

        # Resize user image if needed
        img = img.resize((280, 280))  # adjust size to match your template

        # Position — adjust based on template
        position = (350, 170)  
        poster.paste(img, position, img)

        # Convert to base64 for preview
        buf = io.BytesIO()
        poster.save(buf, format='PNG')
        buf.seek(0)
        
        # Encode image to base64
        image_base64 = base64.b64encode(buf.read()).decode('utf-8')
        
        return jsonify({
            "success": True,
            "image": f"data:image/png;base64,{image_base64}"
        })

    else:
        return jsonify({"error": "File type not allowed"}), 400

if __name__ == "__main__":
    app.run(debug=True)
