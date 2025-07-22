import express from 'express';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import productRoutes from './routes/products.js';
import userRoutes from './routes/auth.js';
import orderRoutes from './routes/order.js';
import paymentRoutes from './routes/payment.js';

import { connectDatabase } from './config/dbConnect.js';
import errorMiddleware from './middlewares/error.js'
import { log } from 'console';
import cookieParser from 'cookie-parser';

import cors from 'cors';


// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();


//handle uncaught exceptions
process.on('uncaughtException',(err)=>
{
  console.log(`Error : ${err}`);
  console.log(`Shutting down due to uncaught exception`);
  process.exit(1);
})


// Load environment variables using absolute path
if(process.env.NODE_ENV!=="PRODUCTION")
{
config({ path: path.join(__dirname, 'config', 'config.env') });
}


connectDatabase();

console.log("Loaded DB_URI from env:", process.env.DB_URI);

// Middleware to parse JSON
app.use(express.json({ limit: "10mb" }));

app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
, // or your deployed frontend URL
  credentials: true,
}));



//routes
app.use("/api",productRoutes);
app.use("/api",userRoutes);
app.use("/api",orderRoutes);
app.use("/api",paymentRoutes);


if(process.env.NODE_ENV==="PRODUCTION")
  {
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    app.get("*",(req,res)=>{
     res.sendFile(path.resolve(__dirname,"../frontend/dist/index.html"))
    })
  }


//middlewares
app.use(errorMiddleware);



console.log("PORT from env:", process.env.PORT);

const server=app.listen(process.env.PORT, () => {
  console.log(`Server running on PORT : ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});

//handle unhandled promise rejections
process.on('unhandledRejection',(err)=>
{
  console.log(`Error : ${err}`);
  console.log('Server Shutting down due to unhandled promise rejection');
  server.close(()=>
  {
    process.exit(1);
  });

})