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

// إعداد التخزين
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json());

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// معالجة طلبات التوليد
app.post('/generate', upload.single('image'), (req, res) => {
    const { prompt } = req.body;
    const file = req.file;

    if (!file || !prompt) {
        return res.status(400).json({ success: false, message: 'يرجى رفع صورة وكتابة وصف المقطع' });
    }

    console.log(`Ahmed-AI: جاري المعالجة لـ ${file.filename}`);

    // محاكاة رابط فيديو ناتج (يمكنك استبداله برابط API حقيقي لاحقاً)
    const videoResultUrl = "https://www.w3schools.com/html/mov_bbb.mp4"; 

    // محاكاة وقت المعالجة 5 ثواني قبل إرسال النتيجة
    setTimeout(() => {
        res.json({ 
            success: true, 
            message: 'تم توليد المقطع بنجاح بواسطة Ahmed-AI!',
            videoUrl: videoResultUrl 
        });
    }, 5000);
});

app.listen(port, () => {
    console.log(`Ahmed-AI is live on http://localhost:${port}`);
});
