import cors from "cors";
import express from "express";
import { analyticsRouter } from "@/apps/analytics/presentation";
import { houseResourceManager } from "@/apps/hrm/presentation";
import { ticTacToeRouter } from "@/apps/tic-tac-toe/shared/presentation";

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
app.use("/tic-tac-toe", ticTacToeRouter);

app.get("/health", (_, res) => {
	res.status(200).json({
		ok: true,
	});
});

export default app;
