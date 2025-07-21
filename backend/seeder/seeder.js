import mongoose from "mongoose";
import Products from "./data.js";
import Product from "../models/product.js";

const seedProducts = async () => {
  try {
    await mongoose.connect("mongodb+srv://varshavenkatapuram2000:V%40rsha2308@shopit.9yjpla5.mongodb.net/shopit?retryWrites=true&w=majority&appName=shopit", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Product.deleteMany();
    console.log("Existing products deleted");

    await Product.insertMany(Products);
    console.log("New products added");

    process.exit(); // Exit after successful seeding
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedProducts();
