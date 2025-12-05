// File upload preview and form handling
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('imageInput');
    const fileName = document.getElementById('fileName');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const uploadForm = document.getElementById('uploadForm');
    const submitBtn = document.getElementById('submitBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');

    // Handle file selection
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Show file name
            fileName.textContent = `Selected: ${file.name}`;
            fileName.classList.add('show');

            // Validate file type
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                showError('Please select a valid image file (PNG, JPG, JPEG, or GIF)');
                fileInput.value = '';
                fileName.classList.remove('show');
                previewContainer.style.display = 'none';
                return;
            }

            // Validate file size (max 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                showError('File size is too large. Please select an image smaller than 10MB.');
                fileInput.value = '';
                fileName.classList.remove('show');
                previewContainer.style.display = 'none';
                return;
            }

            // Hide error if validation passes
            hideError();

            // Show preview
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            fileName.classList.remove('show');
            previewContainer.style.display = 'none';
        }
    });

    // Handle form submission
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        
        if (!fileInput.files[0]) {
            showError('Please select an image file first.');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Generating...';
        loadingIndicator.style.display = 'block';
        hideError();
        
        // Hide poster preview if it exists
        const posterPreviewSection = document.getElementById('posterPreviewSection');
        posterPreviewSection.classList.remove('show');

        // Create FormData
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);

        // Send request using fetch
        fetch('/generate', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = 'Generate Poster';

            if (data.success && data.image) {
                // Show poster preview
                const posterPreviewImage = document.getElementById('posterPreviewImage');
                const downloadBtn = document.getElementById('downloadBtn');
                
                posterPreviewImage.src = data.image;
                downloadBtn.href = data.image;
                posterPreviewSection.classList.add('show');
                
                // Scroll to preview
                posterPreviewSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                showError(data.error || 'Failed to generate poster. Please try again.');
            }
        })
        .catch(error => {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = 'Generate Poster';
            showError('An error occurred while generating the poster. Please try again.');
            console.error('Error:', error);
        });
    });

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    // Hide error message
    function hideError() {
        errorMessage.style.display = 'none';
    }

    // Handle drag and drop (optional enhancement)
    const fileLabel = document.querySelector('.file-label');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileLabel.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        fileLabel.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileLabel.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        fileLabel.style.background = 'var(--light-orange)';
        fileLabel.style.borderColor = 'var(--primary-orange)';
    }

    function unhighlight(e) {
        fileLabel.style.background = 'var(--gray-100)';
        fileLabel.style.borderColor = 'var(--gray-300)';
    }

    fileLabel.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            fileInput.files = files;
            // Trigger change event
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
        }
    }
});

