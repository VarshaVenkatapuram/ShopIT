import mongoose from 'mongoose';

export const connectDatabase = () => {
  let DB_URI = '';
  if (process.env.NODE_ENV === 'DEVELOPMENT') DB_URI = process.env.DB_LOCAL_URI;
  if (process.env.NODE_ENV === 'PRODUCTION') DB_URI = process.env.DB_URI;

  console.log("DB_URI being used:", DB_URI);

  mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((con) => {
    console.log(`MongoDB Database connected with HOST: ${con.connection.host}`);
  }).catch((err) => {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  });
};

