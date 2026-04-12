import { UuidAdapterImpl, WsEventAdapter } from "./infra";

export const uuidAdapter = new UuidAdapterImpl();
export const wsEventAdaper = new WsEventAdapter();
