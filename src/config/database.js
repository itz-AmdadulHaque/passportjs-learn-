import mongoose from "mongoose";

export const db = async()=>{
    try {
        await mongoose.connect(
          process.env.DB_URI
        );
        console.log("Connected to database successfully!");
      } catch (error) {
        console.error("Failed to connect to database:", error);
        process.exit(1); // Terminate the application on connection error
      }
}

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
