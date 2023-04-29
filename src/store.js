// store.js ~ the svelte stores
import { writable } from "svelte/store";
import { DB } from "./db";


// create an user_token variable that is a writable store
export const login_token = writable(DB('get','token'));
