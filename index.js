const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// إعداد تخزين الصور المرفوعة
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, 'Ahmed-AI-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json());

// مسار الصفحة الرئيسية (Ahmed-AI)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// مسار معالجة الطلبات
app.post('/generate', upload.single('image'), (req, res) => {
  const prompt = req.body.prompt;
  const imagePath = req.file ? req.file.path : null;

  if (!imagePath || !prompt) {
    return res.status(400).json({ error: 'أحمد، يرجى التأكد من رفع الصورة وكتابة الشرح' });
  }

  // هنا يتم الربط مع API الذكاء الاصطناعي لاحقاً
  console.log(`جاري المعالجة لـ: ${prompt}`);
  
  res.json({ 
    success: true, 
    message: 'تم استلام طلبك في Ahmed-AI بنجاح! جاري التوليد...' 
  });
});

app.listen(port, () => {
  console.log(`Ahmed-AI server is running on port ${port}`);
});
