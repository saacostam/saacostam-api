import { mongoClient } from "@/shared/mongo";

export const bingoTrackingDb = mongoClient.db("bingo-tracking");
