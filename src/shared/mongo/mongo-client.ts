import { MongoClient } from "mongodb";
import { CoreConfig } from "@/shared/config";

export const mongoClient = new MongoClient(CoreConfig.MONGODB_URI);
