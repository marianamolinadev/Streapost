const DB_NAME = "streapost-offline";
const DB_VERSION = 1;
const POSTS_STORE = "posts";
const USERS_STORE = "users";
const API_RESPONSES_STORE = "api_responses";

export type PostRecord = { id: number; title: string; body: string; userId: number; user?: object };
export type UserRecord = { id: number; name: string; username: string; email: string; phone?: string | null; website?: string | null; company?: string | null; city?: string | null };

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(API_RESPONSES_STORE)) {
        db.createObjectStore(API_RESPONSES_STORE, { keyPath: "url" });
      }
      if (!db.objectStoreNames.contains(POSTS_STORE)) {
        db.createObjectStore(POSTS_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(USERS_STORE)) {
        db.createObjectStore(USERS_STORE, { keyPath: "id" });
      }
    };
  });
}

export async function putApiResponse(url: string, data: unknown): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(API_RESPONSES_STORE, "readwrite");
    tx.objectStore(API_RESPONSES_STORE).put({ url, data, updatedAt: Date.now() });
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function getApiResponse<T>(url: string): Promise<T | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(API_RESPONSES_STORE, "readonly");
    const req = tx.objectStore(API_RESPONSES_STORE).get(url);
    req.onsuccess = () => {
      const row = req.result;
      db.close();
      resolve(row ? (row.data as T) : null);
    };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}
