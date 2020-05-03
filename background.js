'use strict';

import { key_firebase_user_id } from './constants.js'

const networkFilters = {
    urls: [
        "*://console.firebase.google.com/*"
    ]
};

var user_id;

chrome.storage.local.get([key_firebase_user_id], function (result) {
    user_id = result[key_firebase_user_id];
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        if (key == key_firebase_user_id) {
            user_id = changes[key].newValue;
        }
    }
});

chrome.webRequest.onBeforeRequest.addListener((details) => {
    const redirectUrl = details.url.replace('/u/0/', '/u/' + user_id + '/');
    if (typeof user_id !== 'undefined' && details.url != redirectUrl) {
        return { redirectUrl: redirectUrl };
    }
}, networkFilters, ["blocking"]);
