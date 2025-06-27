import express from 'express';
import { houseResourceManager } from './house-resource-manager/presentation/routers';

const app = express();

app.use(express.json());

app.use("/hrm", houseResourceManager)

export default app;
