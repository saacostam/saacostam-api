import "dotenv/config";

const BINGO_TRACKER_JWT_SECRET = process.env.BINGO_TRACKER_JWT_SECRET;
if (!BINGO_TRACKER_JWT_SECRET)
	throw new Error("No BINGO_TRACKER_JWT_SECRET env variable found");

const HRM_MONGODB_URI = process.env.HRM_MONGODB_URI;
const HRM_JWT_SECRET = process.env.HRM_JWT_SECRET;
if (!HRM_MONGODB_URI) throw new Error("No HRM_MONGODB_URI env variable found");
if (!HRM_JWT_SECRET) throw new Error("No HRM_JWT_SECRET env variable found");

const MONEXO_JWT_SECRET = process.env.MONEXO_JWT_SECRET;
if (!MONEXO_JWT_SECRET)
	throw new Error("No MONEXO_JWT_SECRET env variable found");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("No MONGODB_URI env variable found");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) throw new Error("No OPENAI_API_KEY env variable found");

export const CoreConfig = {
	BINGO_TRACKER_JWT_SECRET,
	HRM_MONGODB_URI,
	HRM_JWT_SECRET,
	MONEXO_JWT_SECRET,
	MONGODB_URI,
	OPENAI_API_KEY,
};
