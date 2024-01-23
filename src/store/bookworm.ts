import { writable } from 'svelte/store';

export const queries = writable([]);
export const result = writable([]);
export const chats = writable(["Hi, how can I help you today?"]);