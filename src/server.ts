import { CoreConfig, connectToDb } from "@/shared/config";
import { mongoClient } from "@/shared/mongo";
import app from "./app";

const PORT = 3333;

async function main() {
	try {
		await Promise.all([
			connectToDb(CoreConfig.HRM_MONGODB_URI),
			mongoClient.connect(),
		]);

		app.listen(PORT, () => {
			console.log(`Server listening on port ${PORT}`);
		});
	} catch {
		console.log("No connection to database");
	}
}

void main();
