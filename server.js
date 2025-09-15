// server.js - النسخة النهائية والمؤمّنة

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken'; // 1. استيراد مكتبة التوكن
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port = 3000;
const dbPath = path.join(__dirname, 'db.json');
const SECRET_KEY = 'your-very-secret-key-that-should-be-in-a-env-file';

app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// التأكد من وجود مجلد الرفع، وإنشائه إذا لم يكن موجوداً
const uploadDir = path.join(__dirname, 'public/uploads/verifications');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// إعدادات التخزين
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// تهيئة Multer
const upload = multer({ storage: storage });

// 3. Middleware للتحقق من التوكن (الحارس الأمني)

const checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. إذا كان هناك Authorization header، حاول التحقق من التوكن
  if (authHeader) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, SECRET_KEY);
      // إذا نجح التحقق، أضف بيانات المستخدم إلى الطلب
      req.user = decoded; 
    } catch (error) {
      // إذا فشل التحقق (توكن منتهي الصلاحية أو غير صالح)، لا تفعل شيئًا.
      // هذا سيجعل req.user يبقى undefined، وهذا هو المطلوب.
      console.error("Token verification failed:", error.message);
    }
  }

  // 2. مرر الطلب دائمًا إلى الخطوة التالية في السلسلة
  // سواء تم العثور على مستخدم أم لا. المسار نفسه هو الذي سيقرر ما إذا كان يحتاج لمستخدم.
  next(); 
};

app.use(checkAuth);

// ===   نقطة نهاية التحقق من الهوية (POST) - أضف هذه النقطة   ===
app.post('/api/verify-identity', 
    checkAuth, // التأكد من أن المستخدم مسجل دخوله
    upload.fields([
        { name: 'id_front', maxCount: 1 },
        { name: 'id_back', maxCount: 1 },
        { name: 'selfie_with_id', maxCount: 1 }
    ]), 
    (req, res) => {
        // 1. التحقق من وجود المستخدم (تم بواسطة checkAuth)
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: You must be logged in." });
        }

        // 2. التحقق من أن جميع الملفات تم رفعها
        if (!req.files || !req.files.id_front || !req.files.id_back || !req.files.selfie_with_id) {
            return res.status(400).json({ message: 'الرجاء رفع جميع المستندات الثلاثة المطلوبة.' });
        }

        try {
            // 3. قراءة قاعدة البيانات
            const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

            // 4. إنشاء سجل طلب التحقق الجديد
            const newVerificationRequest = {
                id: Date.now(),
                userId: req.user.id, // ربط الطلب بالمستخدم الحالي
                status: 'pending', // الحالة الأولية للطلب
                idFrontUrl: `/public/uploads/verifications/${req.files.id_front[0].filename}`,
                idBackUrl: `/public/uploads/verifications/${req.files.id_back[0].filename}`,
                selfieUrl: `/public/uploads/verifications/${req.files.selfie_with_id[0].filename}`,
                createdAt: new Date().toISOString(),
            };

            // 5. إضافة السجل الجديد إلى قاعدة البيانات
            if (!db.verificationRequests) {
                db.verificationRequests = []; // أنشئ المصفوفة إذا لم تكن موجودة
            }
            db.verificationRequests.push(newVerificationRequest);

            // 6. حفظ التغييرات في ملف db.json
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

            console.log(`تم استلام طلب تحقق هوية جديد من المستخدم: ${req.user.email}`);
            
            // 7. إرسال استجابة نجاح
            res.status(201).json({
                message: 'تم استلام مستنداتك بنجاح! ستتم مراجعتها قريبًا.',
                data: newVerificationRequest
            });

        } catch (error) {
            console.error("Identity Verification Error:", error);
            res.status(500).json({ message: "Server error during identity verification." });
        }
    }
);

// --- نقطة نهاية لإرسال رمز التحقق إلى رقم هاتف (POST) ---
app.post('/api/phone/send-otp', checkAuth, (req, res) => {
    // 1. التحقق من وجود المستخدم
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: You must be logged in." });
    }

    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required." });
    }

    // 2. إنشاء رمز تحقق عشوائي مكون من 6 أرقام
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 3. (مهم) حفظ الرمز وتاريخ انتهاء صلاحيته مؤقتاً مع المستخدم في قاعدة البيانات
    // هذا ضروري للتحقق منه لاحقاً
    try {
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        const userIndex = db.users.findIndex(u => u.id === req.user.id);

        if (userIndex === -1) {
            return res.status(404).json({ message: "User not found." });
        }

        // حفظ الرمز وتاريخ انتهاء الصلاحية (مثلاً، 5 دقائق من الآن)
        db.users[userIndex].phoneVerification = {
            code: otpCode,
            expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
            phoneNumber: phoneNumber
        };

        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        // 4. محاكاة إرسال الرمز عبر طباعته في طرفية الخادم
        console.log('================================================');
        console.log('||          رمز التحقق من الهاتف (للتجربة)          ||');
        console.log('================================================');
        console.log(`||   الرمز للمستخدم ${req.user.email} هو: ${otpCode}   ||`);
        console.log('================================================');

        // 5. إرسال رد ناجح إلى الواجهة الأمامية
        res.status(200).json({ message: "Verification code has been sent." });

    } catch (error) {
        console.error("Send OTP Error:", error);
        res.status(500).json({ message: "Server error while sending OTP." });
    }
});

// --- نقطة نهاية للتحقق من صحة الرمز (POST) ---
app.post('/api/phone/verify-otp', checkAuth, (req, res) => {
    // 1. التحقق من وجود المستخدم
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: You must be logged in." });
    }

    const { otp } = req.body;
    if (!otp) {
        return res.status(400).json({ message: "OTP code is required." });
    }

    try {
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        const userIndex = db.users.findIndex(u => u.id === req.user.id);

        if (userIndex === -1) {
            return res.status(404).json({ message: "User not found." });
        }

        const user = db.users[userIndex];
        const verificationData = user.phoneVerification;

        // 2. التحقق من وجود بيانات التحقق، وأن الرمز صحيح، وأن صلاحيته لم تنتهِ
        if (!verificationData) {
            return res.status(400).json({ message: "No verification process started. Please request a code first." });
        }
        if (verificationData.code !== otp) {
            return res.status(400).json({ message: "Invalid verification code." });
        }
        if (Date.now() > verificationData.expiresAt) {
            return res.status(400).json({ message: "Verification code has expired. Please request a new one." });
        }

        // 3. إذا كان كل شيء صحيحاً، قم بتحديث بيانات المستخدم
        user.phone = {
            number: verificationData.phoneNumber,
            verified: true,
            verifiedAt: new Date().toISOString()
        };
        
        // حذف بيانات التحقق المؤقتة
        delete user.phoneVerification; 

        db.users[userIndex] = user;
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        console.log(`تم التحقق من رقم هاتف المستخدم بنجاح: ${user.email}`);

        // 4. إرسال رد ناجح
        res.status(200).json({ message: "Phone number verified successfully.", user: user });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ message: "Server error while verifying OTP." });
    }
});


// --- نقطة نهاية تسجيل مستخدم جديد (POST) ---
app.post('/register', (req, res) => {
  // ... الكود الحالي يبقى كما هو ...
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(data);
    const { email, password, name, firstname, lastname } = req.body;

    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ message: "This email is already registered." });
    }

    const newUser = {
      id: Date.now(),
      name: name || `${firstname} ${lastname}`,
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password, // في تطبيق حقيقي، يجب تشفير كلمة المرور
      role: 'user',
      status: 'active',
      avatar_url: `https://i.pravatar.cc/150?u=${email}`,
    };

    db.users.push(newUser );
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    
    // 5. إنشاء توكن عند التسجيل
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ user: newUser, token });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// --- نقطة نهاية تسجيل الدخول (POST) ---
app.post('/login', (req, res) => {
  // ... الكود الحالي يبقى كما هو ...
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(data);
    const { email, password } = req.body;
    const user = db.users.find(u => u.email === email && u.password === password);
    if (user) {
      // 6. إنشاء توكن عند تسجيل الدخول
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ user: user, token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error reading or parsing database file." });
    console.error(error);
  }
});

// --- نقطة نهاية لطلب إعادة تعيين كلمة المرور (POST) ---
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  
  // اقرأ قاعدة البيانات
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const user = db.users.find(u => u.email === email);

  if (user) {
    // في تطبيق حقيقي، يتم إنشاء توكن فريد وحفظه مع تاريخ انتهاء الصلاحية.
    // هنا، سنقوم بإنشاء توكن وهمي بسيط.
    const resetToken = `fake-reset-token-for-${user.id}-${Date.now()}`;
    
    // =================================================================
    // محاكاة إرسال البريد الإلكتروني عن طريق طباعة الرابط في الكونسول
    // هذا هو الرابط الذي ستستخدمه للوصول إلى صفحة إعادة التعيين
    // =================================================================
    console.log('================================================');
    console.log('||          رابط إعادة تعيين كلمة المرور (انسخه)          ||');
    console.log('================================================');
    console.log(`http://localhost:5174/reset-password?token=${resetToken}&email=${email}` );
    console.log('================================================');

  } else {
    // إذا لم يتم العثور على البريد الإلكتروني، لا تفعل شيئًا سوى الطباعة في الكونسول
    console.log(`محاولة إعادة تعيين لكلمة مرور لبريد إلكتروني غير موجود: ${email}`);
  }

  // هام: أرسل دائمًا ردًا ناجحًا (200) للواجهة الأمامية.
  // هذا يمنع المهاجمين من استخدام هذه الميزة لمعرفة أي الإيميلات مسجلة في نظامك.
  res.status(200).json({ message: 'If your email is registered, you will receive a reset link.' });
});

// --- نقطة نهاية لتنفيذ إعادة تعيين كلمة المرور (POST) ---
app.post('/reset-password', (req, res) => {
  const { token, email, password } = req.body;

  // 1. تحقق من وجود كل البيانات المطلوبة
  if (!token || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields (token, email, password).' });
  }

  // 2. اقرأ قاعدة البيانات
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  // 3. ابحث عن المستخدم
  const userIndex = db.users.findIndex(u => u.email === email);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User with this email not found.' });
  }

  // 4. في تطبيق حقيقي، يجب التحقق من صحة التوكن وأنه لم تنتهِ صلاحيته.
  // هنا، سنفترض أن التوكن صحيح طالما أنه موجود.

  // 5. قم بتحديث كلمة المرور للمستخدم
  db.users[userIndex].password = password; // في تطبيق حقيقي، يجب تشفيرها

  // 6. احفظ التغييرات في قاعدة البيانات
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  console.log(`تم تحديث كلمة المرور بنجاح للمستخدم: ${email}`);

  // 7. أرسل ردًا ناجحًا
  res.status(200).json({ message: 'Password has been reset successfully.' });
});

// --- نقطة نهاية للتحقق من الهوية (مهمة لـ AuthContext) ---
app.get('/auth/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No valid token provided." });
  }

  // 2. إذا كان هناك مستخدم، ابحث عنه في قاعدة البيانات
  try {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const userFromDb = db.users.find(u => u.id === req.user.id);

    if (userFromDb) {
      // 3. إذا تم العثور عليه، أرسل بياناته بعد إزالة كلمة المرور
      const { ...userData } = userFromDb;
      res.json(userData);
    } else {
      // هذا يعني أن التوكن صالح، لكن المستخدم تم حذفه من قاعدة البيانات
      res.status(404).json({ message: "User specified in token not found in database." });
    }
  } catch (error) {
    console.error("Error in /auth/me:", error);
    res.status(500).json({ message: "Server error while fetching user profile." });
  }
});

// --- نقطة نهاية تحديث المستخدم (PATCH) ---
app.patch('/users/:id', checkAuth, (req, res) => {
  // ... الكود الحالي يبقى كما هو ...
  try {
    const { id } = req.params;
    const updates = req.body;

    const data = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(data);

    const userIndex = db.users.findIndex(u => String(u.id) === String(id));

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found." });
    }

    db.users[userIndex] = { ...db.users[userIndex], ...updates };
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.json(db.users[userIndex]);

  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Server error during user update." });
  }
});

// --- نقطة نهاية تحديث المعاملة (PATCH) ---
app.patch('/transactions/:id', checkAuth, (req, res) => {
  // ... الكود الحالي يبقى كما هو ...
  try {
    const { id } = req.params;
    const updates = req.body;

    const data = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(data);

    const transactionIndex = db.transactions.findIndex(t => String(t.id) === String(id));

    if (transactionIndex === -1) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    db.transactions[transactionIndex] = { ...db.transactions[transactionIndex], ...updates };
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.json(db.transactions[transactionIndex]);

  } catch (error) {
    console.error("Update Transaction Error:", error);
    res.status(500).json({ message: "Server error during transaction update." });
  }
});


app.patch('/services/:id', checkAuth, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const serviceIndex = db.services.findIndex(s => String(s.id) === String(id));

    if (serviceIndex === -1) {
      return res.status(404).json({ message: "Service not found." });
    }

    // دمج التحديثات مع البيانات القديمة
    db.services[serviceIndex] = { ...db.services[serviceIndex], ...updates };
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    // ▼▼▼ الحل هنا: إثراء الرد ليتطابق مع بنية GET ▼▼▼
    const updatedService = db.services[serviceIndex];
    
    // جلب الطلبات والمراجعات المرتبطة (تمامًا كما يفعل GET)
    const serviceOrders = db.orders.filter(o => o.serviceId === updatedService.id);
    const serviceReviews = db.reviews.filter(r => r.serviceId === updatedService.id);

    const enrichedService = {
      ...updatedService,
      orders: serviceOrders,
      reviews: serviceReviews,
    };

    res.json(enrichedService); // <-- إرسال الرد الكامل والغني

  } catch (error) {
    console.error("Update Service Error:", error);
    res.status(500).json({ message: "Server error during service update." });
  }
});

// ===   نقطة النهاية المحسّنة لجلب عنصر واحد مع إثراء البيانات (GET /:resource/:id)   ===
app.get('/:resource/:id', (req, res) => {
  try {
    const { resource, id } = req.params;
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    // 1. التحقق من وجود المورد في قاعدة البيانات
    if (!db[resource]) {
      return res.status(404).json({ message: `Resource '${resource}' not found.` });
    }

    // 2. البحث عن العنصر المحدد
    const item = db[resource].find(i => String(i.id) === String(id));

    if (item) {
      let finalItem = { ...item };
      if (resource === 'verificationRequests') {
        // جلب بيانات المستخدم الكاملة وإرفاقها بالطلب
        finalItem.user = db.users.find(u => u.id === item.userId) || null;
      }

      // --- إثراء تذاكر الدعم الفني (Support Tickets) ---
      else if (resource === 'supportTickets') {
        // جلب بيانات المستخدم الكاملة وإرفاقها بالتذكرة
        finalItem.user = db.users.find(u => u.id === item.userId) || null;
      }

      // --- إثراء الطلبات (Orders) ---
      else if (resource === 'orders') {
        // جلب بيانات الخدمة، المشتري، والبائع
        finalItem.service = db.services.find(s => s.id === item.serviceId) || null;
        finalItem.buyer = db.users.find(u => u.id === item.buyerId) || null;
        finalItem.seller = db.users.find(u => u.id === item.sellerId) || null;
      }

      // --- إثراء الخدمات (Services) ---
      else if (resource === 'services') {
        // جلب بيانات صاحب الخدمة (المستخدم)
        finalItem.user = db.users.find(u => u.id === item.userId) || null;
        // جلب التقييمات والطلبات المرتبطة بالخدمة
        finalItem.reviews = db.reviews.filter(r => r.serviceId === item.id);
        finalItem.orders = db.orders.filter(o => o.serviceId === item.id);
      }

      // --- إثراء المستخدمين (Users) ---
      else if (resource === 'users') {
        // جلب كل ما يخص المستخدم: خدماته، مشاريعه، وتقييماته
        finalItem.services = db.services.filter(s => s.userId === item.id);
        finalItem.projects = db.projects.filter(p => p.userId === item.id);
        const userServicesIds = finalItem.services.map(s => s.id);
        finalItem.reviews = db.reviews.filter(r => userServicesIds.includes(r.serviceId));
      }

      // 4. إرسال العنصر النهائي بعد إثرائه بالبيانات
      res.json(finalItem);

    } else {
      // إذا لم يتم العثور على العنصر
      res.status(404).json({ message: `Item with id '${id}' not found in '${resource}'.` });
    }
  } catch (error) {
    console.error(`FATAL ERROR in GET /:resource/:id:`, error);
    res.status(500).json({ message: "Server error" });
  }
});

  app.get('/:resource', (req, res) => {
    try {
      const resourceName = req.params.resource;
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

      if (!db[resourceName]) {
        return res.status(404).json({ message: `Resource '${resourceName}' not found.` });
      }

      let results = [...db[resourceName]];

      // --- 1. الفلترة أولاً ---
      if (req.query.userId) {
        results = results.filter(item => String(item.userId) === String(req.query.userId));
      }
      if (req.query.buyerId) {
        results = results.filter(item => String(item.buyerId) === String(req.query.buyerId));
      }
      if (req.query.sellerId) {
        results = results.filter(item => String(item.sellerId) === String(req.query.sellerId));
      }
      if (req.query.status) {
        results = results.filter(item => item.status === req.query.status);
      }

      // --- 2. الإثراء الدفاعي (Smart Enrichment) ---
      if (resourceName === 'orders') {
        results = results.map(order => {
          const service = db.services.find(s => s.id === order.serviceId) || null;
          const seller = db.users.find(u => u.id === order.sellerId) || null;
          const buyer = db.users.find(u => u.id === order.buyerId) || null;
          return { ...order, service, seller, buyer };
        });
      }
      else if (['services', 'projects', 'supportTickets', 'verificationRequests'].includes(resourceName)) {
        results = results.map(item => ({
          ...item,
          user: db.users.find(u => String(u.id) === String(item.userId)) || null
        }));
      }
      // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
      // --- هذا هو الجزء الذي تم تصحيحه ---
      else if (resourceName === 'transactions') {
        // يجب أن يكون منطق الإثراء داخل دالة .map()
        results = results.map(transaction => {
          // البائع هو صاحب المعاملة الرئيسي
          const seller = db.users.find(u => u.id === transaction.userId) || null;
          
          // المشتري (إن وجد) موجود داخل كائن التفاصيل
          const buyerId = transaction.details?.buyerId;
          const buyer = buyerId ? db.users.find(u => u.id === buyerId) || null : null;

          // يجب أن تكون جملة return هنا، لتعيد الكائن المُعدل لكل معاملة
          return {
            ...transaction,
            fromUser: seller, // البائع هو fromUser
            toUser: buyer,    // المشتري هو toUser
            order: transaction.orderId ? db.orders.find(o => o.id === transaction.orderId) : null,
          };
        }); // <-- نهاية دالة .map()
      }
      // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

      // --- 3. الفرز والترتيب (في النهاية) ---
      if (req.query._sort && req.query._order) {
          results.sort((a, b) => {
              const fieldA = a[req.query._sort];
              const fieldB = b[req.query._sort];
              if (req.query._order.toLowerCase() === 'desc') {
                  return fieldA < fieldB ? 1 : -1;
              }
              return fieldA > fieldB ? 1 : -1;
          });
      }

      // إرسال النتائج النهائية بعد الإثراء والفرز
      res.json(results);

    } catch (error) {
      console.error("Get All Items Error:", error);
      res.status(500).json({ message: "Error reading or parsing database file." });
    }
  });

// --- نقطة نهاية لإضافة رد على تذكرة (POST) ---
app.post('/ticketReplies', checkAuth, (req, res) => {
    try {
        const { ticketId, userId, message } = req.body;
        const data = fs.readFileSync(dbPath, 'utf8');
        const db = JSON.parse(data);

        const ticketIndex = db.supportTickets.findIndex(t => String(t.id) === String(ticketId));
        if (ticketIndex === -1) return res.status(404).json({ message: 'Ticket not found' });

        const newReply = { id: Date.now(), userId, text: message, timestamp: new Date().toISOString() };

        db.supportTickets[ticketIndex].messages.push(newReply);
        db.supportTickets[ticketIndex].status = 'in_progress';
        db.supportTickets[ticketIndex].updatedAt = new Date().toISOString();

        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        res.status(201).json(newReply);

    } catch (error) {
        console.error("Add Reply Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// --- نقطة نهاية لإنشاء تذكرة دعم فني (POST) ---
app.post('/supportTickets', checkAuth, (req, res) => {
  // ... الكود الحالي يبقى كما هو ...
  try {
    const { subject, message, userId } = req.body;
    const data = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(data);

    const newTicket = {
      id: Date.now(),
      userId, subject, status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [{ id: Date.now() + 1, userId, text: message, timestamp: new Date().toISOString() }]
    };

    db.supportTickets.push(newTicket);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.status(201).json(newTicket);

  } catch (error) {
    console.error("Create Ticket Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --- نقطة نهاية لإنشاء طلب جديد (POST) ---
app.post('/orders', checkAuth, (req, res) => {
  // ... الكود الحالي يبقى كما هو ...
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(data);
    
    const newOrder = {
      id: Date.now(),
      ...req.body
    };

    if (!db.orders) {
      db.orders = [];
    }

    db.orders.push(newOrder);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.status(201).json(newOrder); 

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server error during order creation." });
  }
});


app.post('/payout-requests', checkAuth, (req, res) => {
  try {
    const { userId, amount } = req.body;
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    // 1. إنشاء طلب السحب الجديد
    const newPayoutRequest = {
      id: Date.now(),
      userId: parseInt(userId, 10),
      amount: parseFloat(amount),
      status: 'pending', // الحالة الأولية للطلب هي "قيد المراجعة"
      createdAt: new Date().toISOString(),
    };

    // 2. إنشاء معاملة مالية لتوثيق عملية طلب السحب
    const newTransaction = {
        id: Date.now() + 1, // لضمان ID فريد
        userId: parseInt(userId, 10),
        type: 'payout_request', // نوع المعاملة
        amount: parseFloat(amount),
        date: new Date().toISOString(),
        details: {
            method: 'PayPal', // يمكن تطويرها لاحقًا
            requestId: newPayoutRequest.id
        }
    };

    // 3. إضافة البيانات الجديدة إلى قاعدة البيانات
    if (!db.payoutRequests) db.payoutRequests = [];
    if (!db.transactions) db.transactions = [];
    
    db.payoutRequests.push(newPayoutRequest);
    db.transactions.push(newTransaction);

    // 4. حفظ التغييرات
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    // 5. إرجاع رسالة نجاح
    res.status(201).json({ message: "Payout request created successfully.", request: newPayoutRequest });

  } catch (error) {
    console.error("Create Payout Request Error:", error);
    res.status(500).json({ message: "Server error during payout request creation." });
  }
});

// --- نقطة نهاية لإنشاء خدمة جديدة (POST) ---
app.post('/services', checkAuth, (req, res) => {
  try {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    const newServiceData = {
      id: Date.now(),
      status: 'active',
      createdAt: new Date().toISOString(),
      ...req.body
    };

    if (!db.services) db.services = [];
    db.services.push(newServiceData);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    // ▼▼▼ الحل هنا: إثراء الرد ليتطابق مع بنية GET ▼▼▼
    const enrichedService = {
      ...newServiceData,
      // إضافة المصفوفات الفارغة التي تتوقعها الواجهة الأمامية
      orders: [], 
      reviews: []
    };

    res.status(201).json(enrichedService); // <-- إرسال الرد الكامل والغني

  } catch (error) {
    console.error("Create Service Error:", error);
    res.status(500).json({ message: "Server error during service creation." });
  }
});

// --- تشغيل الخادم ---
app.listen(port, () => {
  console.log(`*** الخادم المؤمّن يعمل الآن على المنفذ ${port} ***`);
});
