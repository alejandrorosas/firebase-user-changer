'use strict';
import { key_firebase_user_id, key_play_console_user_id } from './constants.js'

window.onload = function () {
    chrome.storage.local.get([key_firebase_user_id, key_play_console_user_id,], (result) => {
        document.getElementById("firebase_user_id").value = result[key_firebase_user_id];
        document.getElementById("play_console_user_id").value = result[key_play_console_user_id];
    });
}

document.getElementById("save").onclick = () => {
    chrome.storage.local.set({
        [key_firebase_user_id]: document.getElementById("firebase_user_id").value,
        [key_play_console_user_id]: document.getElementById("play_console_user_id").value
    });
}
