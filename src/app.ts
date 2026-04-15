import cors from "cors";
import express from "express";
import expressWs from "express-ws";
import { analyticsRouter } from "@/apps/analytics/presentation";
import { houseResourceManager } from "@/apps/hrm/presentation";
import { monexoRouter } from "@/apps/monexo/shared/presentation";
import { ticTacToeRouterFactory } from "@/apps/tic-tac-toe/shared/presentation";

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

// WebSocket
const expressWsInstance = expressWs(app);

app.use("/analytics", analyticsRouter);
app.use("/monexo", monexoRouter);
app.use("/hrm", houseResourceManager);

const ticTacToeRouter = ticTacToeRouterFactory({
	expressWsInstance,
});
app.use("/tic-tac-toe", ticTacToeRouter);

app.get("/health", (_, res) => {
	res.status(200).json({
		ok: true,
	});
});

export default app;
