const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// تحديد مسار مجلد الرفع
const uploadDir = path.join(__dirname, 'uploads');

// حل مشكلة EEXIST: التأكد من المجلد قبل البدء
if (!fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
    } catch (err) {
        console.log("Uploads folder already exists or handled by system.");
    }
}

// إعداد تخزين الصور المرفوعة
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json());

// مسارات الموقع لـ Ahmed-AI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/slides', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/slides.html'));
});

// معالجة طلبات الذكاء الاصطناعي
app.post('/generate', upload.single('image'), (req, res) => {
    const { prompt } = req.body;
    if (!req.file || !prompt) {
        return res.status(400).json({ error: 'يرجى رفع صورة وكتابة وصف المقطع' });
    }
    res.json({ success: true, message: 'تم استلام الطلب! جاري التوليد بواسطة Ahmed-AI' });
});

app.listen(port, () => {
    console.log(`Ahmed-AI is running on http://localhost:${port}`);
});
