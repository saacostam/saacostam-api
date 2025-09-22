import mongoose from "mongoose";

export async function connectToDb(uri: string) {
	return mongoose.connect(uri);
}
