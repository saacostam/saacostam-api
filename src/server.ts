import app from "./app";
import { CoreConfig, connectToDb } from "@/shared/config";

const PORT = 3333;

async function main() {
	try {
		await connectToDb(CoreConfig.HRM_MONGODB_URI);
		app.listen(PORT, () => {
			console.log(`Server listening on port ${PORT}`);
		});
	} catch {
		console.log("No connection to database");
	}
}

void main();
