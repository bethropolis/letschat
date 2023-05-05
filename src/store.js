// store.js ~ the svelte stores
import { writable } from "svelte/store";
import { DB } from "./db";
import app from  "./app.json"


export const config = writable(app);
// create an user_token variable that is a writable store
export const login_token = writable(DB('get','token'));

export const current = writable(null);

export const is_playing = writable(false);

