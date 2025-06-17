require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Platform = require("./models/Platform");
const setupSwagger = require("./swagger");
const authMiddleware = require("./middleware/authMiddleware");
const multer = require('multer');

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

const upload = multer({ dest: 'uploads/' });

app.post('/api/upload',authMiddleware, upload.single('file'), (req, res) => {
  console.log('File uploaded:', req.file);
  res.status(200).send({ message: 'File uploaded!' });
});


// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/passwords", require("./routes/passwordRoutes"));
app.use("/api/platforms", require("./routes/platformRoutes"));
app.use("/api/UnChangablePassword", require("./routes/UnchangeablePasswordRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
