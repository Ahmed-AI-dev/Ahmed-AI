const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;

// إعداد تخزين الصور المرفوعة مؤقتاً
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use(express.json());

// مسار الصفحة الرئيسية لـ Ahmed-AI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// مسار العرض التقديمي (إذا أردت الاحتفاظ به)
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
