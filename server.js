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

const app = express();

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

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

const upload = multer({ dest: 'uploads/' });

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.send({ message: 'File uploaded!' });
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
