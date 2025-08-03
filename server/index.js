import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://krc5win:1234@cluster0.tcobysy.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB error:", error));

async function sendEmailRecord(emailData) {
  try {
    const result = await Email.create(emailData);
    console.log("Email record saved:", result._id);
  } catch (error) {
    console.error("Can't save email:", error.message);
  }
}

const credential = mongoose.model("credential", {}, "bulkmail");

const Email = mongoose.model(
  "emailContent",
  new mongoose.Schema({}, { strict: false }),
  "emailContent"
);
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("users", userSchema, "users");

app.post("/sendemail", async (req, res) => {
  const { subject, message, emailList } = req.body;

  try {
    const data = await credential.find();
    const { user, pass } = data[0].toJSON();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    for (let i = 0; i < emailList.length; i++) {
      await transporter.sendMail({
        from: user,
        to: emailList[i],
        subject: subject,
        text: message,
      });
    }

    console.log("All emails sent.");
    console.log(subject, message, emailList);
    res.status(200).json({ message: "Emails sent successfully" });
    sendEmailRecord({
      subject: subject,
      emailList: emailList,
      body: message,
      time: new Date(),
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.get("/gethistory", async (req, res) => {
  try {
    const emailHistory = await Email.find();
    res.json(emailHistory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch email history" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request:", email, password);

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    console.log("Fetched user:", user);

    if (!user || user.password.trim() !== password.trim()) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    console.log("Login successful");
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
