require('dotenv').config(); // تفعيل قراءة المتغيرات من البيئة أو ملف .env
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Replicate = require('replicate');

const app = express();
const port = process.env.PORT || 3000;

// إعداد Replicate باستخدام المفتاح السري الخاص بك
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

// التأكد من وجود مجلد الرفع لتخزين الصور مؤقتاً
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
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

// إعدادات الخادم
app.use(express.static('public'));
app.use('/uploads', express.static('uploads')); // السماح بالوصول للصور المرفوعة عبر الرابط
app.use(express.json());

// مسارات الموقع
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// المسار الحقيقي لتوليد الفيديو بواسطة الذكاء الاصطناعي
app.post('/generate', upload.single('image'), async (req, res) => {
    try {
        const { prompt } = req.body;
        const file = req.file;

        if (!file || !prompt) {
            return res.status(400).json({ success: false, message: 'يرجى رفع صورة وكتابة وصف المقطع' });
        }

        // ملاحظة: استبدل 'your-site.onrender.com' برابط موقعك الفعلي على Render
        const imageUrl = `https://${req.get('host')}/uploads/${file.filename}`;

        console.log(`Ahmed-AI: جاري بدء التصميم للطلب: ${prompt}`);

        // استخدام نموذج Luma Dream Machine لتحويل الصورة لفيديو
        const output = await replicate.run(
            "lucataco/luma-dream-machine:44e99f43-4f9e-4a6f-98c4-068a0f96898d",
            {
                input: {
                    prompt: prompt,
                    image_url: imageUrl
                }
            }
        );

        // إرسال رابط الفيديو الناتج للمتصفح
        res.json({ 
            success: true, 
            message: 'تم توليد المقطع بنجاح بواسطة Ahmed-AI!',
            videoUrl: output 
        });

    } catch (error) {
        console.error("Error from Replicate:", error);
        res.status(500).json({ 
            success: false, 
            message: 'حدث خطأ في التوليد. تأكد من شحن رصيدك في Replicate أو صحة الـ API Token' 
        });
    }
});

app.listen(port, () => {
    console.log(`Ahmed-AI is running on http://localhost:${port}`);
});
