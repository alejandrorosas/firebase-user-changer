'use strict';
import { key_firebase_user_id } from './constants.js'

window.onload = function () {
    var storage = chrome.storage.local.get([key_firebase_user_id], (result) => {
        document.getElementById("user_id").value = result[key_firebase_user_id];
    });
}

document.getElementById("save").onclick = () => {
    chrome.storage.local.set({
        "firebase_user_id": document.getElementById("user_id").value
    });
}
