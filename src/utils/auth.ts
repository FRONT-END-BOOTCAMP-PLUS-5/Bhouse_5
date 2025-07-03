// eslint-disable-next-line import/no-cycle
import requester from "./requester";
import storage from "./storage";
import { API } from "./constants";

export async function session(sessionId: string): Promise<boolean> {
  try {
    const url = `${API}/user/session`;
    const response = await requester.put(url, { sessionId });
    if (response) {
      console.log("###### API Response - session: ", response);
      return true;
    }
    return false;
  } catch (e) {
    console.error("###### API session error:", e);
    return false;
  }
}

export async function setSessionId(sessionId: string): Promise<boolean> {
  try {
    storage.set("session", "sessionId", sessionId);
    return true;
  } catch (e) {
    console.error("##### setSessionId error:", e);
    return false;
  }
}

export function getSessionId(): string {
  try {
    const savedValue = storage.get<string>("session", "sessionId");
    return savedValue || "";
  } catch (e) {
    console.error("##### getSessionId error:", e);
    return "";
  }
}

export async function removeSessionId(): Promise<boolean> {
  try {
    storage.remove("session", "sessionId");
    return true;
  } catch (e) {
    console.error("##### removeSessionId error:", e);
    return false;
  }
}
