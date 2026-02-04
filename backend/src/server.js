import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./libs/db.js";
import swaggerUi from 'swagger-ui-express';
import fs from 'fs'

import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import friendRoute from './routes/friendRoute.js';
import messageRoute from './routes/messageRoute.js';
import conversationRoute from './routes/conversationRoute.js';
import { protectedRoute } from "./middlewares/authMiddleWare.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
//MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true, // reflect request origin
    credentials: true,
  })
);
const swaggerDoc = JSON.parse(fs.readFileSync("./src/swagger.json", 'utf8'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))
//PUBLIC ROUTES
app.use(`/api/auth`, authRoute)

//PRIVATE ROUTES
app.use(protectedRoute);
app.use(`/api/user`, userRoute)
app.use(`/api/friend`, friendRoute)
app.use(`/api/message`, messageRoute)
app.use(`/api/conversation`, conversationRoute)


//START THE SERVER
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
  });
});
