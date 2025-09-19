import "dotenv/config";

const HRM_MONGODB_URI = process.env.HRM_MONGODB_URI;

if (!HRM_MONGODB_URI) throw new Error("No MONGODB_URI env variable found");

export const CoreConfig = {
	HRM_MONGODB_URI,
};
