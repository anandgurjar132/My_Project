const mongoose = require("mongoose");
const {MongoClient} = require("mongodb") ;
require("dotenv/config");
// man seeee
 const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
 let database = 'My_Project' ;

 const connectToDatabase = async()=>{
 try{ 
  let result  = await client.connect();
   result.db(database) ;

  }catch (error) {
     console.error("Error connecting to the database:", error.message);
     throw error;
   }
}


// const connectToDatabase = async () => {
//   try {
//     await mongoose.connect(process.env.DB_URI);
//     console.log("DB Connected!");
//   } catch (error) {
//     console.error("Error connecting to the database:", error.message);
//     throw error;
//   }
// };   


module.exports = connectToDatabase;


// const {MongoClient} = require("mongodb") ;
//  const url = 'mongodb://localhost:27017';
//  const client = new MongoClient(url);
//  let database = 'e_com' ;

//  async function dbconnection(){
//   let result  = await client.connect();
//   let db = result.db(database) ;
//   return db.collection('product');
//   // let responce = await collection.find({name:"sunny"}).toArray() ;
//   // console.log(responce);

// }

// module.exports = dbconnection ;