const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// التأكد من وجود مجلد الرفع
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json());

// عرض الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// معالجة طلبات الذكاء الاصطناعي
app.post('/generate', upload.single('image'), (req, res) => {
    const { prompt } = req.body;
    const file = req.file;

    if (!file || !prompt) {
        return res.status(400).json({ success: false, message: 'يرجى رفع صورة وكتابة وصف المقطع' });
    }

    // ملاحظة: هنا يمكنك مستقبلاً ربط API التوليد الحقيقي
    console.log(`طلب جديد من Ahmed-AI: الشرح: ${prompt} | الملف: ${file.filename}`);
    
    res.json({ 
        success: true, 
        message: 'تم استلام طلبك بنجاح! جاري معالجة الفيديو بواسطة Ahmed-AI...' 
    });
});

app.listen(port, () => {
    console.log(`Ahmed-AI is running on port ${port}`);
});
