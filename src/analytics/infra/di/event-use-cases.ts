import { EventUseCases } from "analytics/app";
import { context } from "./context";

export const eventUseCases = new EventUseCases(context);
