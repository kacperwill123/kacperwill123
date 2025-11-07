// =====================
// SMOOTH SCROLLING
// =====================

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

// =====================
// CONVERTER TABS
// =====================

const converterTabs = document.querySelectorAll('.tab-button');
const converterPanels = document.querySelectorAll('.converter-panel');

converterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetConverter = tab.getAttribute('data-converter');

        converterTabs.forEach(t => t.classList.remove('active'));
        converterPanels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');

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

imageUploadArea.addEventListener('click', () => {
    imageInput.click();
});

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

imageQuality.addEventListener('input', (e) => {
    qualityValue.textContent = Math.round(e.target.value * 100) + '%';
});

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
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const lines = doc.splitTextToSize(content, 180);
        doc.text(lines, 15, 15);

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

textUploadArea.addEventListener('click', () => {
    textInput.click();
});

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

convertTextBtn.addEventListener('click', () => {
    let content = textPreview.value;

    if (!content.trim()) {
        showNotification('No content to convert!', 'error');
        return;
    }

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
                const jsonObj = JSON.parse(content);
                content = JSON.stringify(jsonObj, null, 2);
                mimeType = 'application/json';
            } catch (e) {
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
// DATA FORMAT CONVERTER
// =====================

const dataTabs = document.querySelectorAll('.data-tab');
const dataPanels = document.querySelectorAll('.data-panel');

dataTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetType = tab.getAttribute('data-type');

        dataTabs.forEach(t => t.classList.remove('active'));
        dataPanels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');

        const targetPanel = document.getElementById(`${targetType}-panel`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    });
});

// CSV to JSON
document.getElementById('csv-to-json').addEventListener('click', () => {
    const csvInput = document.getElementById('csv-input').value;
    if (!csvInput.trim()) {
        showNotification('Please enter CSV data!', 'error');
        return;
    }

    try {
        const lines = csvInput.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            const obj = {};
            const currentLine = lines[i].split(',');

            headers.forEach((header, index) => {
                obj[header] = currentLine[index] ? currentLine[index].trim() : '';
            });

            result.push(obj);
        }

        document.getElementById('json-output').value = JSON.stringify(result, null, 2);
        showNotification('Converted to JSON successfully!');
    } catch (error) {
        showNotification('Error converting CSV to JSON', 'error');
    }
});

// JSON to CSV
document.getElementById('json-to-csv').addEventListener('click', () => {
    const jsonOutput = document.getElementById('json-output').value;
    if (!jsonOutput.trim()) {
        showNotification('Please convert to JSON first!', 'error');
        return;
    }

    try {
        const data = JSON.parse(jsonOutput);
        if (!Array.isArray(data) || data.length === 0) {
            showNotification('JSON must be an array of objects', 'error');
            return;
        }

        const headers = Object.keys(data[0]);
        let csv = headers.join(',') + '\n';

        data.forEach(row => {
            const values = headers.map(header => row[header] || '');
            csv += values.join(',') + '\n';
        });

        document.getElementById('csv-input').value = csv;
        showNotification('Converted to CSV successfully!');
    } catch (error) {
        showNotification('Error converting JSON to CSV', 'error');
    }
});

// Download Data
document.getElementById('download-data').addEventListener('click', () => {
    const jsonOutput = document.getElementById('json-output').value;
    if (!jsonOutput.trim()) {
        showNotification('No data to download!', 'error');
        return;
    }

    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Downloaded successfully!');
});

// JSON to XML
document.getElementById('json-to-xml').addEventListener('click', () => {
    const jsonInput = document.getElementById('json-xml-input').value;
    if (!jsonInput.trim()) {
        showNotification('Please enter JSON data!', 'error');
        return;
    }

    try {
        const data = JSON.parse(jsonInput);
        const xml = jsonToXml(data, 'root');
        document.getElementById('xml-output').value = xml;
        showNotification('Converted to XML successfully!');
    } catch (error) {
        showNotification('Error converting to XML', 'error');
    }
});

function jsonToXml(obj, rootName) {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n`;

    function convert(obj, indent = '  ') {
        let result = '';
        for (const key in obj) {
            const value = obj[key];
            if (typeof value === 'object' && !Array.isArray(value)) {
                result += `${indent}<${key}>\n`;
                result += convert(value, indent + '  ');
                result += `${indent}</${key}>\n`;
            } else if (Array.isArray(value)) {
                value.forEach(item => {
                    result += `${indent}<${key}>${item}</${key}>\n`;
                });
            } else {
                result += `${indent}<${key}>${value}</${key}>\n`;
            }
        }
        return result;
    }

    xml += convert(obj);
    xml += `</${rootName}>`;
    return xml;
}

// Download XML
document.getElementById('download-xml').addEventListener('click', () => {
    const xmlOutput = document.getElementById('xml-output').value;
    if (!xmlOutput.trim()) {
        showNotification('No XML to download!', 'error');
        return;
    }

    const blob = new Blob([xmlOutput], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.xml';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Downloaded successfully!');
});

// Markdown to HTML
document.getElementById('md-to-html').addEventListener('click', () => {
    const mdInput = document.getElementById('markdown-input').value;
    if (!mdInput.trim()) {
        showNotification('Please enter Markdown!', 'error');
        return;
    }

    const html = markdownToHtml(mdInput);
    document.getElementById('html-output').value = html;
    showNotification('Converted to HTML successfully!');
});

function markdownToHtml(markdown) {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');

    // Line breaks
    html = html.replace(/\n/gim, '<br>');

    return html;
}

// Download HTML
document.getElementById('download-html').addEventListener('click', () => {
    const htmlOutput = document.getElementById('html-output').value;
    if (!htmlOutput.trim()) {
        showNotification('No HTML to download!', 'error');
        return;
    }

    const blob = new Blob([htmlOutput], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.html';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Downloaded successfully!');
});

// =====================
// ENCODERS & DECODERS
// =====================

const encodeTabs = document.querySelectorAll('.encode-tab');
const encodePanels = document.querySelectorAll('.encode-panel');

encodeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetType = tab.getAttribute('data-type');

        encodeTabs.forEach(t => t.classList.remove('active'));
        encodePanels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');

        const targetPanel = document.getElementById(`${targetType}-panel`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    });
});

// Base64 Encode
document.getElementById('encode-base64').addEventListener('click', () => {
    const input = document.getElementById('base64-input').value;
    if (!input) {
        showNotification('Please enter text to encode!', 'error');
        return;
    }

    const encoded = btoa(unescape(encodeURIComponent(input)));
    document.getElementById('base64-output').value = encoded;
    showNotification('Encoded successfully!');
});

// Base64 Decode
document.getElementById('decode-base64').addEventListener('click', () => {
    const input = document.getElementById('base64-input').value;
    if (!input) {
        showNotification('Please enter Base64 to decode!', 'error');
        return;
    }

    try {
        const decoded = decodeURIComponent(escape(atob(input)));
        document.getElementById('base64-output').value = decoded;
        showNotification('Decoded successfully!');
    } catch (error) {
        showNotification('Invalid Base64 input!', 'error');
    }
});

// Copy Base64
document.getElementById('copy-base64').addEventListener('click', () => {
    const output = document.getElementById('base64-output').value;
    if (output) {
        navigator.clipboard.writeText(output);
        showNotification('Copied to clipboard!');
    }
});

// URL Encode
document.getElementById('encode-url').addEventListener('click', () => {
    const input = document.getElementById('url-input').value;
    if (!input) {
        showNotification('Please enter text to encode!', 'error');
        return;
    }

    const encoded = encodeURIComponent(input);
    document.getElementById('url-output').value = encoded;
    showNotification('Encoded successfully!');
});

// URL Decode
document.getElementById('decode-url').addEventListener('click', () => {
    const input = document.getElementById('url-input').value;
    if (!input) {
        showNotification('Please enter URL to decode!', 'error');
        return;
    }

    try {
        const decoded = decodeURIComponent(input);
        document.getElementById('url-output').value = decoded;
        showNotification('Decoded successfully!');
    } catch (error) {
        showNotification('Invalid URL encoding!', 'error');
    }
});

// Copy URL
document.getElementById('copy-url').addEventListener('click', () => {
    const output = document.getElementById('url-output').value;
    if (output) {
        navigator.clipboard.writeText(output);
        showNotification('Copied to clipboard!');
    }
});

// HTML Entities Encode
document.getElementById('encode-html').addEventListener('click', () => {
    const input = document.getElementById('html-input').value;
    if (!input) {
        showNotification('Please enter HTML to encode!', 'error');
        return;
    }

    const encoded = input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    document.getElementById('html-entities-output').value = encoded;
    showNotification('Encoded successfully!');
});

// HTML Entities Decode
document.getElementById('decode-html').addEventListener('click', () => {
    const input = document.getElementById('html-input').value;
    if (!input) {
        showNotification('Please enter HTML entities to decode!', 'error');
        return;
    }

    const decoded = input
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");

    document.getElementById('html-entities-output').value = decoded;
    showNotification('Decoded successfully!');
});

// Copy HTML
document.getElementById('copy-html').addEventListener('click', () => {
    const output = document.getElementById('html-entities-output').value;
    if (output) {
        navigator.clipboard.writeText(output);
        showNotification('Copied to clipboard!');
    }
});

// Hash Generator
document.getElementById('generate-hash').addEventListener('click', async () => {
    const input = document.getElementById('hash-input').value;
    if (!input) {
        showNotification('Please enter text to hash!', 'error');
        return;
    }

    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        document.getElementById('hash-output').value = hashHex;
        showNotification('Hash generated successfully!');
    } catch (error) {
        showNotification('Error generating hash!', 'error');
    }
});

// Copy Hash
document.getElementById('copy-hash').addEventListener('click', () => {
    const output = document.getElementById('hash-output').value;
    if (output) {
        navigator.clipboard.writeText(output);
        showNotification('Copied to clipboard!');
    }
});

// =====================
// COLOR CONVERTER
// =====================

const colorPreview = document.getElementById('color-preview');
const hexInput = document.getElementById('hex-input');
const rInput = document.getElementById('r-input');
const gInput = document.getElementById('g-input');
const bInput = document.getElementById('b-input');
const hInput = document.getElementById('h-input');
const sInput = document.getElementById('s-input');
const lInput = document.getElementById('l-input');
const colorPicker = document.getElementById('color-picker');

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function updateColorFromHex() {
    const hex = hexInput.value;
    const rgb = hexToRgb(hex);
    if (rgb) {
        rInput.value = rgb.r;
        gInput.value = rgb.g;
        bInput.value = rgb.b;

        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        hInput.value = hsl.h;
        sInput.value = hsl.s;
        lInput.value = hsl.l;

        colorPreview.style.background = hex;
        colorPicker.value = hex;
    }
}

function updateColorFromRgb() {
    const r = parseInt(rInput.value) || 0;
    const g = parseInt(gInput.value) || 0;
    const b = parseInt(bInput.value) || 0;

    const hex = rgbToHex(r, g, b);
    hexInput.value = hex;

    const hsl = rgbToHsl(r, g, b);
    hInput.value = hsl.h;
    sInput.value = hsl.s;
    lInput.value = hsl.l;

    colorPreview.style.background = hex;
    colorPicker.value = hex;
}

function updateColorFromPicker() {
    const hex = colorPicker.value;
    hexInput.value = hex;
    updateColorFromHex();
}

hexInput.addEventListener('input', updateColorFromHex);
rInput.addEventListener('input', updateColorFromRgb);
gInput.addEventListener('input', updateColorFromRgb);
bInput.addEventListener('input', updateColorFromRgb);
colorPicker.addEventListener('input', updateColorFromPicker);

// Initialize color
updateColorFromHex();

// Copy buttons
document.getElementById('copy-hex').addEventListener('click', () => {
    navigator.clipboard.writeText(hexInput.value);
    showNotification('HEX copied to clipboard!');
});

document.getElementById('copy-rgb').addEventListener('click', () => {
    const rgb = `rgb(${rInput.value}, ${gInput.value}, ${bInput.value})`;
    navigator.clipboard.writeText(rgb);
    showNotification('RGB copied to clipboard!');
});

document.getElementById('copy-hsl').addEventListener('click', () => {
    const hsl = `hsl(${hInput.value}, ${sInput.value}%, ${lInput.value}%)`;
    navigator.clipboard.writeText(hsl);
    showNotification('HSL copied to clipboard!');
});

// =====================
// IMAGE TO PDF
// =====================

const imagePdfUpload = document.getElementById('image-pdf-upload');
const imagePdfInput = document.getElementById('image-pdf-input');
const imagePdfOptions = document.getElementById('image-pdf-options');
const imageGrid = document.getElementById('image-grid');
const convertImagesPdfBtn = document.getElementById('convert-images-pdf');
const imagePdfFilename = document.getElementById('image-pdf-filename');

let uploadedImages = [];

imagePdfUpload.addEventListener('click', () => {
    imagePdfInput.click();
});

imagePdfUpload.addEventListener('dragover', (e) => {
    e.preventDefault();
    imagePdfUpload.style.borderColor = 'var(--primary)';
});

imagePdfUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    imagePdfUpload.style.borderColor = '';

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
        handleMultipleImages(files);
    }
});

imagePdfInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        handleMultipleImages(files);
    }
});

function handleMultipleImages(files) {
    uploadedImages = [];
    imageGrid.innerHTML = '';

    files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImages.push(e.target.result);

            const gridItem = document.createElement('div');
            gridItem.className = 'image-grid-item';
            gridItem.innerHTML = `
                <img src="${e.target.result}" alt="Image ${index + 1}">
                <button class="remove-btn" onclick="removeImage(${index})">×</button>
            `;
            imageGrid.appendChild(gridItem);

            if (uploadedImages.length === files.length) {
                imagePdfUpload.style.display = 'none';
                imagePdfOptions.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);
    });
}

window.removeImage = function(index) {
    uploadedImages.splice(index, 1);
    imageGrid.children[index].remove();

    if (uploadedImages.length === 0) {
        imagePdfUpload.style.display = 'block';
        imagePdfOptions.style.display = 'none';
    }
};

convertImagesPdfBtn.addEventListener('click', async () => {
    if (uploadedImages.length === 0) return;

    convertImagesPdfBtn.disabled = true;
    convertImagesPdfBtn.innerHTML = '<span class="loading"></span> Creating PDF...';

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        for (let i = 0; i < uploadedImages.length; i++) {
            if (i > 0) {
                pdf.addPage();
            }

            const img = new Image();
            img.src = uploadedImages[i];

            await new Promise((resolve) => {
                img.onload = () => {
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const pageHeight = pdf.internal.pageSize.getHeight();

                    const imgWidth = img.width;
                    const imgHeight = img.height;
                    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

                    const width = imgWidth * ratio;
                    const height = imgHeight * ratio;

                    const x = (pageWidth - width) / 2;
                    const y = (pageHeight - height) / 2;

                    pdf.addImage(uploadedImages[i], 'JPEG', x, y, width, height);
                    resolve();
                };
            });
        }

        const filename = imagePdfFilename.value || 'images.pdf';
        pdf.save(filename.endsWith('.pdf') ? filename : filename + '.pdf');

        convertImagesPdfBtn.disabled = false;
        convertImagesPdfBtn.innerHTML = 'Create PDF';

        showNotification('PDF created successfully!');
    } catch (error) {
        console.error('Error creating PDF:', error);
        showNotification('Error creating PDF', 'error');
        convertImagesPdfBtn.disabled = false;
        convertImagesPdfBtn.innerHTML = 'Create PDF';
    }
});

// =====================
// NOTIFICATION SYSTEM
// =====================

function showNotification(message, type = 'success') {
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

console.log('ConvertHub initialized successfully!');
console.log('✓ Image Converter (PNG, JPG, WebP)');
console.log('✓ PDF Generator (Text/HTML)');
console.log('✓ Text File Converter');
console.log('✓ CSV ↔ JSON Converter');
console.log('✓ JSON → XML Converter');
console.log('✓ Markdown → HTML Converter');
console.log('✓ Base64 Encoder/Decoder');
console.log('✓ URL Encoder/Decoder');
console.log('✓ HTML Entities Encoder/Decoder');
console.log('✓ SHA-256 Hash Generator');
console.log('✓ Color Converter (HEX/RGB/HSL)');
console.log('✓ Image to PDF Converter');
console.log('All converters are ready to use!');
