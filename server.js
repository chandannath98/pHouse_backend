require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Platform = require("./models/Platform");
const setupSwagger = require("./swagger");
const authMiddleware = require("./middleware/authMiddleware");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const app = express();

const encodedCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

const filePath = '/tmp/service-account.json';

fs.writeFileSync(filePath, Buffer.from(encodedCredentials, 'base64'));

const cron = require('node-cron');
const User = require("./models/User");


// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// Swagger Setup
setupSwagger(app);

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure multer to store files with original filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // You can add custom logic here to rename files (e.g., add timestamp)
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Max file size: 10MB
});




admin.initializeApp({
  credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS = filePath  )
});



cron.schedule('0 * * * *', async() => {
 
  const users = await User.find(
    { fcm_token: { $exists: true, $ne: null, $ne: "" } },
    { fcm_token: 1, _id: 0 }
  );
  
const tokens = users.map(user => user.fcm_token);
  const message = {
    tokens: tokens,
    // "data": {
    //   "type": "reply",
    //   "title": "New message from Rahul",
    //   "body": "Are you coming?333",
    //   "conversation_id": "chat_1234"
    // }

    "data": {
      "type": "default",
      "title": "Security Alert",
      "body": "Save your passwords in Password Manager and make them secure"
    }

    // data: {
    //   type: "image",
    //   title: "Promo Alert",
    //   body: "Watch now!",
    //   image: "https://picsum.photos/200/300"
    // }
  };

  admin.messaging().sendEachForMulticast(message)
}, {
  scheduled: true,
  timezone: "Asia/Kolkata" // Example: For New Delhi time zone
});





// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.status(200).json({
      message: 'File uploaded successfully',
      fileName: req.file.originalname,
      path: `/uploads/${req.file.originalname}`
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Upload endpoint
app.get('/api/sendNotification', async(req, res) => {

  // const registrationTokens = [
  //   'dTZTYWP2TCGfMdMPLJcmp1:APA91bElHI87c9Ixi-MKOqZ97ggczSZrwv6OxP2oGQSmMc4C7gtlwFpToxwYWqIHFyy8OeOfSZgnVVD9xA4cfi5qzQaBmYIUzyTvT42ZXV4dAsXY2DQCybc',
    
  // ];

  const users = await User.find(
    { fcm_token: { $exists: true, $ne: null, $ne: "" } },
    { fcm_token: 1, _id: 0 }
  );
  
const tokens = users.map(user => user.fcm_token);
  const message = {
    tokens: tokens,
    // "data": {
    //   "type": "reply",
    //   "title": "New message from Rahul",
    //   "body": "Are you coming?333",
    //   "conversation_id": "chat_1234"
    // }

    "data": {
      "type": "default",
      "title": "Security Alert",
      "body": "Save your passwords in Password Manager and make them secure"
    }

    // data: {
    //   type: "image",
    //   title: "Promo Alert",
    //   body: "Watch now!",
    //   image: "https://picsum.photos/200/300"
    // }
  };

  admin.messaging().sendEachForMulticast(message)
    .then(() => res.send('Data message sent'))
    .catch(err => {
      console.error(err);
      res.status(500).send('Failed to send message');
    });
});


// Get list of uploaded files
app.get('/api/files', (req, res) => {
  const dirPath = path.join(__dirname, 'uploads');
  fs.readdir(dirPath, (err, files) => {
    if (err) return res.status(500).send('Unable to scan files');
    res.json(files);
  });
});

// Download specific file route
app.get('/api/download-passwordmanager-apk', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', 'passwordmanager.apk');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'passwordmanager.apk');
  } else {
    res.status(404).send('File not found');
  }
});


// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/passwords", require("./routes/passwordRoutes"));
app.use("/api/platforms", require("./routes/platformRoutes"));
app.use("/api/UnChangablePassword", require("./routes/UnchangeablePasswordRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
