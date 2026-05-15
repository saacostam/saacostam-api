import { mongoClient } from "@/shared/mongo";

export const monexoDb = mongoClient.db("monexo");
