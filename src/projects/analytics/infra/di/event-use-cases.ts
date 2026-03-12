import { EventUseCases } from "@/projects/analytics/app";
import { context } from "./context";

export const eventUseCases = new EventUseCases(context);
