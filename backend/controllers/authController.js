const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const User = require("../models/user.js");
const config = require("config");
const Doctor = require("../models/doctor.js");
const Nurse = require("../models/nurse.js");
//require("dotenv/config");
require('dotenv').config(); // correct way

// const verifyUser = (req, res, next) => {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.json("The Token is Not Available");
//     } else {
//       jwt.verify(token, "jwt-secret-key", (err, decoded) => {
//         if (err) {
//           return res.json("The Token is Not Valid");
//         } else {
//           req.email = decoded.email;
//           req.username = decoded.username;
//           next();
//         }
//       });
//     }
//   };
  
//   router.get("/", verifyUser, (req, res) => {
//     return res.json({ email: req.email, username: req.username });
//   });        
  
  router.post("/register", async (req, res) => {

  
    
    const { userName, email, password } = req.body;
   
    try {
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        userName,
        email,
        password: hashedPassword,
      });
  
      const savedUser = await newUser.save();
  
      res.json({savedUser, message:"Success"});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
     
  
    try {
      let user, doctor, nurse;
      let isPasswordValid = false;
  
      user = await User.findOne({ email });
      doctor = await Doctor.findOne({ email });
      nurse = await Nurse.findOne({ email });
  
      if (user || doctor || nurse) {

        if (user) {
          //console.log("user ka pass")
          //console.log(user.password)
          isPasswordValid = await bcrypt.compare(password, user.password);
         // console.log(isPasswordValid);
        } else if (doctor) {
          // console.log("doctor me aa gya")
          // console.log(password)
          // console.log(doctor.password)
          isPasswordValid = (password == doctor.password);
          
         // console.log("doctor")
                //    console.log(isPasswordValid);
        } else if (nurse) {
          console.log("nure auth")
          isPasswordValid = (password == nurse.password)
         // console.log(isPasswordValid)
        }
  
        if (isPasswordValid) {
          let token, role, loggedInUser;
          // console.log(doctor)
          // console.log("doctor h ki nahi")
          console.log(nurse)
          if (user) {
            console.log("haa user patient me aa gya")
            console.log("JWT Secret:", process.env.jwtsecret);
            token = jwt.sign({ id: user._id, role: user.role }, process.env.jwtsecret, {
              expiresIn: "2d",
             
            });
            console.log("token")
            console.log(token)
            role = user.role;
            loggedInUser = user;
            console.log("logged in user44444")
          } else if (doctor) {
            console.log("doctor me aa gya")
            token = jwt.sign({ id: doctor._id, role: doctor.role }, process.env.jwtsecret, {
              expiresIn: "2d",
              
            });
            role = doctor.role;
            loggedInUser = doctor;
          } else if (nurse) {
            token = jwt.sign({ id: nurse._id, role: nurse.role }, process.env.jwtsecret, {
              expiresIn: "2d",
            });
            role = nurse.role;
            loggedInUser = nurse;
          }
          res.cookie('token', token);
          //console.log("token")

          res.json({ status: "Success", token, role, user: loggedInUser });
        } else {
          res.status(401).json({ error: "Invalid email or password" });
        }
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.log("backend ke catch me aa gya ")
      res.status(500).json({ error: error.message+"catvh mke erro" });
    }
  });
  
  router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "User Logged Out" });
  });

    // router.post("/google-login", async (req, res) => {
  //   const { tokenId } = req.body;
  
  //   try {
  //     const response = await client.verifyIdToken({
  //       idToken: tokenId,
  //       audience: config.get("googleClientId"),
  //     });
  
  //     const { email_verified, email } = response.payload;
  
  //     if (email_verified) {
  //       const user = await mySchemas.User.findOne({ email });
  
  //       if (user) {
  //         const token = jwt.sign({ id: user._id }, config.get("jwtsecret"), {
  //           expiresIn: "2d",
  //         });
  
  //         return res.json({ token });
  //       } else {
  //         const newUser = new mySchemas.User({
  //           email,
  //         });
  
  //         const savedUser = await newUser.save();
  
  //         const token = jwt.sign({ id: savedUser._id }, config.get("jwtsecret"), {
  //           expiresIn: "2d",
  //         });
  
  //         return res.json({ token });
  //       }
  //     }
  //   } catch (error) {
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // });

module.exports = router;