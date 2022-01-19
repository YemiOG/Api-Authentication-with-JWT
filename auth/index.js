import express from 'express';
import authRoute from './routes/auth.js';
import postRoute from './routes/posts.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

//connecting to DB

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true}, ()=> console.log('connected to db!'));
mongoose.set ('bufferCommands', false);


const app = express();

const PORT = 3000;
app.use(express.json());
//importing routes
app.use ('/api/user', authRoute);
app.use ('/api/posts', postRoute);


app.listen(PORT, () => console.log('Server Up and Running!'));

