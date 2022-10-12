import * as dotenv from "dotenv";
import {Request, Response} from 'express';
import express from "express";
import * as bodyParser from "body-parser";
import {router} from './routes/router';
const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use("/wallet",router);
app.listen(process.env.PORT, ()=>{
    console.log("Listening on port" + process.env.PORT);
});