'use strict';
import { key_firebase_user_id, key_firebase_enabled, key_play_console_user_id, key_play_console_enabled } from './constants.js'

function toggleInput(inputId, enabled) {
    document.getElementById(inputId).disabled = !enabled;
}

window.onload = function () {
    chrome.storage.local.get([key_firebase_user_id, key_firebase_enabled, key_play_console_user_id, key_play_console_enabled], (result) => {
        const firebaseEnabled = result[key_firebase_enabled] ?? (result[key_firebase_user_id] !== undefined);
        const playEnabled = result[key_play_console_enabled] ?? (result[key_play_console_user_id] !== undefined);

        document.getElementById("firebase_enabled").checked = firebaseEnabled;
        document.getElementById("firebase_user_id").value = result[key_firebase_user_id] ?? '';
        toggleInput("firebase_user_id", firebaseEnabled);

        document.getElementById("play_console_enabled").checked = playEnabled;
        document.getElementById("play_console_user_id").value = result[key_play_console_user_id] ?? '';
        toggleInput("play_console_user_id", playEnabled);
    });

    document.getElementById("firebase_enabled").onchange = (e) => toggleInput("firebase_user_id", e.target.checked);
    document.getElementById("play_console_enabled").onchange = (e) => toggleInput("play_console_user_id", e.target.checked);
}

document.getElementById("save").onclick = () => {
    chrome.storage.local.set({
        [key_firebase_enabled]: document.getElementById("firebase_enabled").checked,
        [key_firebase_user_id]: document.getElementById("firebase_user_id").value,
        [key_play_console_enabled]: document.getElementById("play_console_enabled").checked,
        [key_play_console_user_id]: document.getElementById("play_console_user_id").value
    });
}
