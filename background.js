'use strict';

import { key_firebase_user_id, key_play_console_user_id } from './constants.js'

const firebaseNetworkFilters = { urls: ["*://console.firebase.google.com/*"] };
const playConsoleNetworkFilters = { urls: ["*://play.google.com/*"] };

var firebase_user_id;
var play_console_user_id;

chrome.storage.local.get([key_firebase_user_id,key_play_console_user_id,], function (result) {
    firebase_user_id = result[key_firebase_user_id];
    play_console_user_id = result[key_play_console_user_id];
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        if (key == key_firebase_user_id) {
            firebase_user_id = changes[key].newValue;
        } else if (key == key_play_console_user_id) {
            play_console_user_id = changes[key].newValue;
        }
    }
});

chrome.webRequest.onBeforeRequest.addListener((details) => {
    const redirectUrl = details.url.replace('/u/0/', '/u/' + firebase_user_id + '/');
    if (typeof firebase_user_id !== 'undefined' && details.url != redirectUrl) {
        return { redirectUrl: redirectUrl };
    }
}, firebaseNetworkFilters, ["blocking"]);

chrome.webRequest.onBeforeRequest.addListener((details) => {

    const redirectUrl = details.url.replace('/u/0/', '/u/' + play_console_user_id + '/');
    if (typeof play_console_user_id !== 'undefined' && details.url != redirectUrl) {
        return { redirectUrl: redirectUrl };
    }

    const redirectUrlUnusered = details.url.replace('/console/developers', '/console/u/' + play_console_user_id + '/developers');
    if (typeof play_console_user_id !== 'undefined' && details.url != redirectUrlUnusered) {
        return { redirectUrl: redirectUrlUnusered };
    }
}, playConsoleNetworkFilters, ["blocking"]);
