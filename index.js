require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Replicate = require('replicate');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

// إعداد الذكاء الاصطناعي (Gemini & Replicate)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

// إعداد مجلد الرفع
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
app.use('/uploads', express.static('uploads'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// المسار الرئيسي: جيميناي يخطط، وريبليكيت ينفذ
app.post('/generate', upload.single('image'), async (req, res) => {
    try {
        const { prompt } = req.body; // الطلب البسيط من المستخدم (مثلاً: "سوي فيديو أكشن")
        const file = req.file;

        if (!file || !prompt) {
            return res.status(400).json({ success: false, message: 'يرجى رفع صورة ووصف الطلب' });
        }

        console.log(`Ahmed-AI: جيميناي بدأ يفكر في طلبك: ${prompt}`);

        // 1. استخدام Gemini لتحويل طلب المستخدم لوصف احترافي بالإنجليزية
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const geminiResponse = await model.generateContent([
            `Create a high-quality, detailed cinematic video prompt in English based on this user request: "${prompt}". 
            Focus on motion, lighting, and realistic details for an AI video generator. Output only the prompt text.`
        ]);
        const professionalPrompt = geminiResponse.response.text();
        
        console.log(`Ahmed-AI: الوصف الاحترافي الناتج: ${professionalPrompt}`);

        // 2. إرسال الوصف الاحترافي إلى Replicate لتوليد الفيديو
        const imageUrl = `https://${req.get('host')}/uploads/${file.filename}`;
        const output = await replicate.run(
            "lucataco/luma-dream-machine:44e99f43-4f9e-4a6f-98c4-068a0f96898d",
            {
                input: {
                    prompt: professionalPrompt,
                    image_url: imageUrl
                }
            }
        );

        res.json({ 
            success: true, 
            message: 'جيميناي صمم لك السيناريو وAhmed-AI أنتج الفيديو!',
            videoUrl: output 
        });

    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ 
            success: false, 
            message: 'حدث خطأ. تأكد من رصيد Replicate وصحة مفتاح Gemini' 
        });
    }
});

app.listen(port, () => {
    console.log(`Ahmed-AI is live on port ${port}`);
});
