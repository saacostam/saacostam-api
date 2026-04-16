import "dotenv/config";

const HRM_MONGODB_URI = process.env.HRM_MONGODB_URI;
const HRM_JWT_SECRET = process.env.HRM_JWT_SECRET;

const MONEXO_JWT_SECRET = process.env.MONEXO_JWT_SECRET;

if (!HRM_MONGODB_URI) throw new Error("No HRM_MONGODB_URI env variable found");
if (!HRM_JWT_SECRET) throw new Error("No HRM_JWT_SECRET env variable found");
if (!MONEXO_JWT_SECRET)
	throw new Error("No MONEXO_JWT_SECRET env varible found");

export const CoreConfig = {
	HRM_MONGODB_URI,
	HRM_JWT_SECRET,
	MONEXO_JWT_SECRET,
};
