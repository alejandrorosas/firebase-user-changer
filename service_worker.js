'use strict';

import { key_firebase_user_id, key_play_console_user_id, key_firebase_rule_id, key_play_console_rule_id } from './constants.js'

setupDynamicRules();

chrome.storage.onChanged.addListener(function (changes, namespace) {
    setupDynamicRules();
});

function setupDynamicRules() {
    setupFirebaseRule();
    setupPlayConsoleRule();
}

async function setupFirebaseRule() {
    const { firebase_user_id } = await chrome.storage.local.get([key_firebase_user_id]);
    if (typeof firebase_user_id === 'undefined') {
        return;
    }
    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [{
            "id": key_firebase_rule_id,
            "priority": 1,
            "action": {
                "type": "redirect",
                "redirect": {
                    "regexSubstitution": `https://console.firebase.google.com/u/${firebase_user_id}/\\2`
                }
            },
            "condition": {
                "regexFilter": `^https?:\/\/console\.firebase\.google\.com\/u\/(\\d*)\/(.*)`,
                "resourceTypes": ["main_frame"],
                "requestDomains": ["console.firebase.google.com"]
            }
        }],
        removeRuleIds: [key_firebase_rule_id]
    });
}

async function setupPlayConsoleRule() {
    const { play_console_user_id } = await chrome.storage.local.get([key_play_console_user_id]);
    if (typeof play_console_user_id === 'undefined') {
        return;
    }
    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [{
            "id": key_play_console_rule_id,
            "priority": 1,
            "action": {
                "type": "redirect",
                "redirect": {
                    "regexSubstitution": `https://play.google.com/console/u/${play_console_user_id}/developers\\2`
                }
            },
            "condition": {
                "regexFilter": `^https?:\/\/play\.google\.com\/console\/u\/(\\d*)\/developers(.*)`,
                "resourceTypes": ["main_frame"],
                "requestDomains": ["play.google.com"]
            }
        }],
        removeRuleIds: [key_play_console_rule_id]
    });
}
