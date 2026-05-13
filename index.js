const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs'); // استدعاء مكتبة النظام لإدارة الملفات
const app = express();
const port = process.env.PORT || 3000;

// التأكد من وجود مجلد uploads قبل بدء السيرفر لتجنب خطأ التشغيل في Render
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// إعداد تخزين الصور المرفوعة
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use(express.json());

// مسار الصفحة الرئيسية لـ Ahmed-AI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// مسار العرض التقديمي
app.get('/slides', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/slides.html'));
});

// محاكاة معالجة الذكاء الاصطناعي
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
