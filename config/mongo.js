import mongoose from "mongoose";

export const connectMongo = async (uri = process.env.MONGO_URI) => { //process.env.MONGO_URI เป็นการเชื่อมต่อไปยัง mongodb เข้าถึงprocessแต่ละขั้นที่เกิดการทำงาน uriเป็นคัวแปรมาเก็บ
    if(!uri) throw new Error("Missing MONGO_URI or MongoDB connection string.");
    
    //Attach event listener BEFORE connection is made
    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB");
    });
    
    //Attach event listener ONCE any error occurs
    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
    });

    //disconnect
    mongoose.connection.on("disconnected", () => {
        console.warn("Disconnected from MongoDB");
    });

    try {
        await mongoose.connect(uri);   
    } catch (err) {
        console.log("Initial MongoDB connection failed.", err);
        
        throw err;
    }
};