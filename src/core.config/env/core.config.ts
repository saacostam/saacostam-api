import "dotenv/config";

const HRM_MONGODB_URI = process.env.HRM_MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!HRM_MONGODB_URI) throw new Error("No MONGODB_URI env variable found");
if (!JWT_SECRET) throw new Error("No JWT_SECRET env variable found");

export const CoreConfig = {
	HRM_MONGODB_URI,
	JWT_SECRET,
};
