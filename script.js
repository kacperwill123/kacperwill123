// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Converter Tabs
const converterTabs = document.querySelectorAll('.tab-button');
const converterPanels = document.querySelectorAll('.converter-panel');

converterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetConverter = tab.getAttribute('data-converter');

        // Remove active class from all tabs and panels
        converterTabs.forEach(t => t.classList.remove('active'));
        converterPanels.forEach(p => p.classList.remove('active'));

        // Add active class to clicked tab
        tab.classList.add('active');

        // Show corresponding panel
        const targetPanel = document.getElementById(`${targetConverter}-converter`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    });
});

// =====================
// IMAGE CONVERTER
// =====================

const imageUploadArea = document.getElementById('image-upload');
const imageInput = document.getElementById('image-input');
const imagePreview = document.getElementById('image-preview');
const imageOptions = document.getElementById('image-options');
const imageFormatSelect = document.getElementById('image-format');
const imageQuality = document.getElementById('image-quality');
const qualityValue = document.getElementById('quality-value');
const convertImageBtn = document.getElementById('convert-image');

let currentImage = null;

// Click to upload
imageUploadArea.addEventListener('click', () => {
    imageInput.click();
});

// Drag and drop
imageUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    imageUploadArea.style.borderColor = 'var(--primary)';
    imageUploadArea.style.background = 'rgba(102, 126, 234, 0.05)';
});

imageUploadArea.addEventListener('dragleave', () => {
    imageUploadArea.style.borderColor = '';
    imageUploadArea.style.background = '';
});

imageUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    imageUploadArea.style.borderColor = '';
    imageUploadArea.style.background = '';

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        handleImageFile(files[0]);
    }
});

// File input change
imageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleImageFile(e.target.files[0]);
    }
});

function handleImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = new Image();
        currentImage.onload = () => {
            imagePreview.src = e.target.result;
            imageUploadArea.style.display = 'none';
            imageOptions.style.display = 'block';
        };
        currentImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Quality slider
imageQuality.addEventListener('input', (e) => {
    qualityValue.textContent = Math.round(e.target.value * 100) + '%';
});

// Convert image
convertImageBtn.addEventListener('click', () => {
    if (!currentImage) return;

    const format = imageFormatSelect.value;
    const quality = parseFloat(imageQuality.value);

    convertImageBtn.disabled = true;
    convertImageBtn.innerHTML = '<span class="loading"></span> Converting...';

    setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = currentImage.width;
        canvas.height = currentImage.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(currentImage, 0, 0);

        const mimeType = format === 'jpeg' ? 'image/jpeg' :
                        format === 'png' ? 'image/png' :
                        'image/webp';

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `converted-image.${format === 'jpeg' ? 'jpg' : format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            convertImageBtn.disabled = false;
            convertImageBtn.innerHTML = 'Convert Image';

            showNotification('Image converted successfully!');
        }, mimeType, quality);
    }, 500);
});

// =====================
// PDF GENERATOR
// =====================

const inputTabs = document.querySelectorAll('.input-tab');
const inputPanels = document.querySelectorAll('.input-panel');
const generatePdfBtn = document.getElementById('generate-pdf');
const pdfTextInput = document.getElementById('pdf-text-input');
const pdfHtmlInput = document.getElementById('pdf-html-input');
const pdfFilename = document.getElementById('pdf-filename');

// Input tabs
inputTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetInput = tab.getAttribute('data-input');

        inputTabs.forEach(t => t.classList.remove('active'));
        inputPanels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');

        const targetPanel = document.getElementById(`${targetInput}-input-panel`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    });
});

// Generate PDF
generatePdfBtn.addEventListener('click', async () => {
    const activeInput = document.querySelector('.input-tab.active').getAttribute('data-input');
    const content = activeInput === 'text' ? pdfTextInput.value : pdfHtmlInput.value;

    if (!content.trim()) {
        showNotification('Please enter some content first!', 'error');
        return;
    }

    generatePdfBtn.disabled = true;
    generatePdfBtn.innerHTML = '<span class="loading"></span> Generating...';

    try {
        // Using jsPDF library
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        if (activeInput === 'text') {
            // Simple text to PDF
            const lines = doc.splitTextToSize(content, 180);
            doc.text(lines, 15, 15);
        } else {
            // HTML to PDF (basic conversion)
            const lines = doc.splitTextToSize(content, 180);
            doc.text(lines, 15, 15);
        }

        const filename = pdfFilename.value || 'document.pdf';
        doc.save(filename.endsWith('.pdf') ? filename : filename + '.pdf');

        generatePdfBtn.disabled = false;
        generatePdfBtn.innerHTML = 'Generate PDF';

        showNotification('PDF generated successfully!');
    } catch (error) {
        console.error('PDF generation error:', error);
        showNotification('Error generating PDF', 'error');
        generatePdfBtn.disabled = false;
        generatePdfBtn.innerHTML = 'Generate PDF';
    }
});

// =====================
// TEXT CONVERTER
// =====================

const textUploadArea = document.getElementById('text-upload');
const textInput = document.getElementById('text-input');
const textPreview = document.getElementById('text-preview');
const textOptions = document.getElementById('text-options');
const textFormatSelect = document.getElementById('text-format');
const textTransformSelect = document.getElementById('text-transform');
const convertTextBtn = document.getElementById('convert-text');

let currentTextFilename = 'converted';

// Click to upload
textUploadArea.addEventListener('click', () => {
    textInput.click();
});

// Drag and drop
textUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    textUploadArea.style.borderColor = 'var(--primary)';
    textUploadArea.style.background = 'rgba(102, 126, 234, 0.05)';
});

textUploadArea.addEventListener('dragleave', () => {
    textUploadArea.style.borderColor = '';
    textUploadArea.style.background = '';
});

textUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    textUploadArea.style.borderColor = '';
    textUploadArea.style.background = '';

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleTextFile(files[0]);
    }
});

// File input change
textInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleTextFile(e.target.files[0]);
    }
});

function handleTextFile(file) {
    currentTextFilename = file.name.split('.')[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        textPreview.value = e.target.result;
        textUploadArea.style.display = 'none';
        textOptions.style.display = 'block';
    };
    reader.readAsText(file);
}

// Convert text
convertTextBtn.addEventListener('click', () => {
    let content = textPreview.value;

    if (!content.trim()) {
        showNotification('No content to convert!', 'error');
        return;
    }

    // Apply text transformation
    const transform = textTransformSelect.value;
    switch (transform) {
        case 'uppercase':
            content = content.toUpperCase();
            break;
        case 'lowercase':
            content = content.toLowerCase();
            break;
        case 'titlecase':
            content = content.replace(/\w\S*/g, (txt) => {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
            break;
    }

    const format = textFormatSelect.value;
    let filename = `${currentTextFilename}.${format}`;
    let mimeType = 'text/plain';

    switch (format) {
        case 'txt':
            mimeType = 'text/plain';
            break;
        case 'md':
            mimeType = 'text/markdown';
            break;
        case 'json':
            try {
                // Try to format as JSON if possible
                const jsonObj = JSON.parse(content);
                content = JSON.stringify(jsonObj, null, 2);
                mimeType = 'application/json';
            } catch (e) {
                // If not valid JSON, create a simple JSON structure
                content = JSON.stringify({ text: content }, null, 2);
                mimeType = 'application/json';
            }
            break;
        case 'csv':
            mimeType = 'text/csv';
            break;
    }

    convertTextBtn.disabled = true;
    convertTextBtn.innerHTML = '<span class="loading"></span> Converting...';

    setTimeout(() => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        convertTextBtn.disabled = false;
        convertTextBtn.innerHTML = 'Convert Text';

        showNotification('Text file converted successfully!');
    }, 500);
});

// =====================
// NOTIFICATION SYSTEM
// =====================

function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 600;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// =====================
// RESET FUNCTIONS
// =====================

// Add reset buttons functionality
document.querySelectorAll('.converter-panel').forEach(panel => {
    const uploadArea = panel.querySelector('.upload-area');
    if (uploadArea) {
        const resetBtn = document.createElement('button');
        resetBtn.textContent = '← Upload Different File';
        resetBtn.style.cssText = `
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: transparent;
            border: 1px solid var(--border);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
        `;

        resetBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const options = panel.querySelector('.conversion-options');
            if (options) {
                options.style.display = 'none';
                uploadArea.style.display = 'block';
            }
            // Reset input
            const input = panel.querySelector('input[type="file"]');
            if (input) input.value = '';
        });

        const options = panel.querySelector('.conversion-options');
        if (options) {
            options.insertBefore(resetBtn, options.firstChild);
        }
    }
});

// Initialize
console.log('ConvertHub initialized successfully!');
console.log('All converters are ready to use.');
