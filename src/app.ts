import cors from "cors";
import express from "express";
import { analyticsRouter } from "./apps/analytics/presentation";
import { houseResourceManager } from "./apps/house-resource-manager/presentation/routers";

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

app.use("/analytics", analyticsRouter);
app.use("/hrm", houseResourceManager);

app.get("/health", (_, res) => {
	res.status(200).json({
		ok: true,
	});
});

export default app;
