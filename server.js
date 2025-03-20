require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Platform = require("./models/Platform");

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


const predefinedPlatforms = [
    {
        "platformId": "facebook",
        "platformName": "Facebook",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
        "platformColor": "#1877F2"
      },
      {
        "platformId": "google",
        "platformName": "Google",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        "platformColor": "#4285F4"
      },
      {
        "platformId": "netflix",
        "platformName": "Netflix",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg",
        "platformColor": "#E50914"
      },
      {
        "platformId": "amazon",
        "platformName": "Amazon",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        "platformColor": "#FF9900"
      },
      {
        "platformId": "twitter",
        "platformName": "Twitter",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/en/6/60/Twitter_Logo_as_of_2021.svg",
        "platformColor": "#1DA1F2"
      },
      {
        "platformId": "github",
        "platformName": "GitHub",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
        "platformColor": "#181717"
      },
      {
        "platformId": "linkedin",
        "platformName": "LinkedIn",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
        "platformColor": "#0077B5"
      },
      {
        "platformId": "instagram",
        "platformName": "Instagram",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg",
        "platformColor": "#E1306C"
      },
      {
        "platformId": "whatsapp",
        "platformName": "WhatsApp",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
        "platformColor": "#25D366"
      },
      {
        "platformId": "youtube",
        "platformName": "YouTube",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
        "platformColor": "#FF0000"
      },
      {
        "platformId": "snapchat",
        "platformName": "Snapchat",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/en/c/c4/Snapchat_logo.svg",
        "platformColor": "#FFFC00"
      },
      {
        "platformId": "pinterest",
        "platformName": "Pinterest",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png",
        "platformColor": "#E60023"
      },
      {
        "platformId": "tiktok",
        "platformName": "TikTok",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg",
        "platformColor": "#010101"
      },
      {
        "platformId": "discord",
        "platformName": "Discord",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/en/9/98/Discord_logo.svg",
        "platformColor": "#5865F2"
      },
      {
        "platformId": "reddit",
        "platformName": "Reddit",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/en/8/82/Reddit_logo_and_wordmark.svg",
        "platformColor": "#FF4500"
      },
      {
        "platformId": "paypal",
        "platformName": "PayPal",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
        "platformColor": "#00457C"
      },
      {
        "platformId": "spotify",
        "platformName": "Spotify",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
        "platformColor": "#1DB954"
      },
      {
        "platformId": "apple",
        "platformName": "Apple",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
        "platformColor": "#A3AAAE"
      },
      {
        "platformId": "microsoft",
        "platformName": "Microsoft",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
        "platformColor": "#737373"
      },
      {
        "platformId": "adobe",
        "platformName": "Adobe",
        "platformLogo": "https://upload.wikimedia.org/wikipedia/commons/d/d8/Adobe_Corporate_logo.svg",
        "platformColor": "#FF0000"
      }
  ];
  
  const seedPlatforms = async () => {
    const count = await Platform.countDocuments();
    if (count === 0) {
      await Platform.insertMany(predefinedPlatforms);
      console.log("Predefined platforms added");
    }
  };
  
  mongoose.connection.once("open", seedPlatforms);


// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/passwords", require("./routes/passwordRoutes"));
app.use("/api/platforms", require("./routes/platformRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
