// ======= DOM References =======
const form = document.getElementById('cardForm');
const card = document.getElementById('idCard');
const downloadButton = document.querySelectorAll('.downloadBtn');

const inputs = {
    name: document.getElementById('name'),
    father: document.getElementById('fatherName'),
    enrollment: document.getElementById('enrollment'),
    program: document.getElementById('program'),
    rcCode: document.getElementById('rcCode'),
    address: document.getElementById('address'),
    pin: document.getElementById('pin'),
    photoInput: document.getElementById('photoInput')
};

const preview = {
    name: document.getElementById('cardName'),
    father: document.getElementById('cardFather'),
    enrollment: document.getElementById('cardEnroll'),
    program: document.getElementById('cardProgram'),
    rcCode: document.getElementById('cardRC'),
    address: document.getElementById('cardAddress'),
    pin: document.getElementById('cardPIN'),
    photo: document.getElementById('cardPhoto'),
    qr: document.getElementById('qrCode')
};

// ======= Helper Functions =======

// Wait for an image to fully load
const waitForImageLoad = (img) => {
    return new Promise((resolve) => {
        if (img.complete) resolve();
        else img.onload = resolve;
    });
};

// Fill the card with input values
const fillCardDetails = () => {
    preview.name.textContent = inputs.name.value;
    preview.father.textContent = inputs.father.value;
    preview.enrollment.textContent = inputs.enrollment.value;
    preview.program.textContent = inputs.program.value;
    preview.rcCode.textContent = inputs.rcCode.value;
    preview.address.textContent = inputs.address.value;
    preview.pin.textContent = inputs.pin.value;
};

// Load and display photo
const loadPhoto = () => {
    return new Promise((resolve) => {
        const file = inputs.photoInput.files[0];
        if (!file) return resolve();

        const reader = new FileReader();
        reader.onload = (e) => {
            preview.photo.src = e.target.result;
            waitForImageLoad(preview.photo).then(resolve);
        };
        reader.readAsDataURL(file);
    });
};

// ======= Event Listeners =======

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show download buttons
    downloadButton.forEach(btn => btn.classList.remove('hidden'));

    fillCardDetails();
    await Promise.all([loadPhoto()]);
});

// ======= Download Functions =======

const downloadCard = async () => {
    const name = preview.name.textContent;
    await Promise.all([waitForImageLoad(preview.photo)]);
    await new Promise(res => setTimeout(res, 300)); // small render buffer

    html2canvas(card, { scale: 3, useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${name} - ID Card.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    });
};

const downloadPDF = async () => {
    const name = preview.name.textContent;
    await Promise.all([waitForImageLoad(preview.photo)]);
    await new Promise(res => setTimeout(res, 300));

    html2canvas(card, { scale: 3 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png', 1.0);
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('landscape', 'pt', [canvas.width, canvas.height]);
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${name} - ID Card.pdf`);
    });
};
