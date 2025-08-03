const express = require("express");
const app = express();
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://priyabef:123@cluster0.nk5u2ws.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("connected to db"))
  .catch(() => console.log("failed to connect"));

const credential = mongoose.model("credential", {}, "bulkmail");

// ✅ Add this route to test from browser/Postman/Render
app.get("/", (req, res) => {
  res.status(200).json({ message: "BulkMail backend is live" });
});


app.post("/sendemail", function (req, res) {
  const msg = req.body.msg;
  const emailList = req.body.emailList;

  credential.find().then(function (data) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass,
      },
    });

    new Promise(async function (resolve, reject) {
      try {
        for (let i = 0; i < emailList.length; i++) {
          await transporter.sendMail({
            from: "priyabef@gmail.com",
            to: emailList[i],
            subject: "message from bulk mail app",
            text: msg
          });
          console.log("Email sent to:" + emailList[i]);
        }
        resolve("success");
      } catch (error) {
        reject("failed");
      }
    }).then(function () {
      res.send(true);
    }).catch(function () {
      res.send(false);
    });

  }).catch(function (error) {
    console.log(error);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
