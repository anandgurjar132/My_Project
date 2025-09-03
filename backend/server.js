
const express = require("express");
const bodyParser = require("body-parser");
const corsMiddleware = require("./middlewares/cors");
const errorHandlerMiddleware = require("./middlewares/errorHandler");
const connectToDatabase = require("./db/mongoose");
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const doctorController = require("./controllers/doctorController");
const nurseController = require("./controllers/nurseController");
const appointmentController = require("./controllers/appointmentController");
const adminController = require("./controllers/adminController");
const limiter = require("./middlewares/rateLimiter");
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const cors =require("cors")
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(corsMiddleware);
app.use(cors());

//check
// app.use('/', (req, res) => {
//   res.send("helo server is conected");
// });

mongoose.set('strictQuery', true);
//mongoose.connect(process.env.MONGOCONNECTION, { useNewUrlParser: true });
mongoose.connect(`${process.env.mongoDB}`, { useNewUrlParser: true })
.then(()=>{console.log("done")})
.catch((err)=>{console.log(err)})


app.get('/try', (req, res) => {
  console.log("server me aa gya ")
  res.json({data:"annnu"});
});



app.use("/auth",limiter, authController);
app.use("/user",limiter, userController);
app.use("/doctor",limiter, doctorController);
app.use("/nurse",limiter, nurseController);
app.use("/appointment",limiter, appointmentController);
app.use("/admin",limiter, adminController);
app.use(errorHandlerMiddleware)  ;  



let port = process.env.PORT   ;
 app.listen(port, () => {
   console.log(`Server running on port: http://localhost:${port}`);
  });

  