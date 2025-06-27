import express from 'express';
import { categoryRouter } from './house-resource-manager/presentation/routers';

const app = express();

app.use(express.json());

app.use("/category", categoryRouter)

export default app;
