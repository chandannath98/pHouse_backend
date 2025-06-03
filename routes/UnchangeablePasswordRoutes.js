const UnChnagablePassword = require("../models/UnChnagablePassword");

router.post("/", authMiddleware, async (req, res) => {
  try {
    let { ciphertext, iv, salt } = req.body;

    // If platformId is "0", create a new platform

    const newPassword = new UnChnagablePassword({
      user: req.user.id,
      ciphertext,
      iv,
      salt,
    });
    await newPassword.save();
    res.status(201).json({
      message: "Password Saved Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const Password = await UnChnagablePassword.findOne({ user: req.user.id });

    if (Password) {
      res.status(200).json({
        data: Password,
        status: true,
      });
    } else {
      res.status(200).json({
        status: false,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
