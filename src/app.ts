import express from 'express';
import cors from "cors";
import { houseResourceManager } from './house-resource-manager/presentation/routers';

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use("/hrm", houseResourceManager)

export default app;
