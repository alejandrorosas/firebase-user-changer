'use strict';
import {
    key_firebase_user_id,
    key_firebase_enabled,
    key_play_console_user_id,
    key_play_console_enabled,
    key_cloud_console_user_id,
    key_cloud_console_enabled
} from './constants.js';

let initialState = {};

function toggleInput(inputId, cardId, enabled) {
    const input = document.getElementById(inputId);
    if (input) {
        input.disabled = !enabled;
    }
    const card = document.getElementById(cardId);
    if (card) {
        if (enabled) {
            card.classList.remove("disabled");
        } else {
            card.classList.add("disabled");
        }
    }
}

function getCurrentState() {
    return {
        firebase_enabled: document.getElementById("firebase_enabled")?.checked ?? false,
        firebase_user_id: document.getElementById("firebase_user_id")?.value ?? '',
        play_console_enabled: document.getElementById("play_console_enabled")?.checked ?? false,
        play_console_user_id: document.getElementById("play_console_user_id")?.value ?? '',
        cloud_console_enabled: document.getElementById("cloud_console_enabled")?.checked ?? false,
        cloud_console_user_id: document.getElementById("cloud_console_user_id")?.value ?? '',
    };
}

function checkChanges() {
    const currentState = getCurrentState();
    const hasChanges = Object.keys(currentState).some(key => {
        const valA = initialState[key] ?? '';
        const valB = currentState[key] ?? '';
        return String(valA) !== String(valB);
    });

    const saveButton = document.getElementById("save");
    if (saveButton) {
        saveButton.disabled = !hasChanges;
    }

    const statusEl = document.getElementById("status");
    if (statusEl) {
        if (hasChanges) {
            statusEl.innerText = "Unsaved changes";
            statusEl.classList.remove("success");
            statusEl.classList.add("visible");
        } else {
            if (statusEl.innerText === "Unsaved changes") {
                statusEl.classList.remove("visible");
            }
        }
    }
}

// Initialize and setup event listeners immediately since script is deferred/module at the bottom of the body
function init() {
    chrome.storage.local.get([
        key_firebase_user_id,
        key_firebase_enabled,
        key_play_console_user_id,
        key_play_console_enabled,
        key_cloud_console_user_id,
        key_cloud_console_enabled
    ], (result) => {
        const firebaseEnabled = result[key_firebase_enabled] ?? (result[key_firebase_user_id] !== undefined);
        const playEnabled = result[key_play_console_enabled] ?? (result[key_play_console_user_id] !== undefined);
        const cloudEnabled = result[key_cloud_console_enabled] ?? (result[key_cloud_console_user_id] !== undefined);

        initialState = {
            firebase_enabled: firebaseEnabled,
            firebase_user_id: result[key_firebase_user_id] ?? '',
            play_console_enabled: playEnabled,
            play_console_user_id: result[key_play_console_user_id] ?? '',
            cloud_console_enabled: cloudEnabled,
            cloud_console_user_id: result[key_cloud_console_user_id] ?? '',
        };

        // Initialize UI values
        const firebaseEnabledEl = document.getElementById("firebase_enabled");
        if (firebaseEnabledEl) firebaseEnabledEl.checked = firebaseEnabled;
        const firebaseUserIdEl = document.getElementById("firebase_user_id");
        if (firebaseUserIdEl) firebaseUserIdEl.value = initialState.firebase_user_id;
        toggleInput("firebase_user_id", "card_firebase", firebaseEnabled);

        const playEnabledEl = document.getElementById("play_console_enabled");
        if (playEnabledEl) playEnabledEl.checked = playEnabled;
        const playUserIdEl = document.getElementById("play_console_user_id");
        if (playUserIdEl) playUserIdEl.value = initialState.play_console_user_id;
        toggleInput("play_console_user_id", "card_play", playEnabled);

        const cloudEnabledEl = document.getElementById("cloud_console_enabled");
        if (cloudEnabledEl) cloudEnabledEl.checked = cloudEnabled;
        const cloudUserIdEl = document.getElementById("cloud_console_user_id");
        if (cloudUserIdEl) cloudUserIdEl.value = initialState.cloud_console_user_id;
        toggleInput("cloud_console_user_id", "card_cloud", cloudEnabled);

        // Run check once to ensure correct initial button state
        checkChanges();
    });

    const inputs = [
        "firebase_enabled", "firebase_user_id",
        "play_console_enabled", "play_console_user_id",
        "cloud_console_enabled", "cloud_console_user_id"
    ];

    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const eventType = el.type === 'checkbox' ? 'change' : 'input';
            el.addEventListener(eventType, () => {
                if (el.type === 'checkbox') {
                    let cardId = '';
                    let inputTargetId = '';
                    if (id === 'firebase_enabled') {
                        cardId = 'card_firebase';
                        inputTargetId = 'firebase_user_id';
                    } else if (id === 'play_console_enabled') {
                        cardId = 'card_play';
                        inputTargetId = 'play_console_user_id';
                    } else if (id === 'cloud_console_enabled') {
                        cardId = 'card_cloud';
                        inputTargetId = 'cloud_console_user_id';
                    }
                    toggleInput(inputTargetId, cardId, el.checked);
                }
                checkChanges();
            });
        }
    });

    const saveButton = document.getElementById("save");
    if (saveButton) {
        saveButton.onclick = () => {
            const currentState = getCurrentState();
            chrome.storage.local.set({
                [key_firebase_enabled]: currentState.firebase_enabled,
                [key_firebase_user_id]: currentState.firebase_user_id,
                [key_play_console_enabled]: currentState.play_console_enabled,
                [key_play_console_user_id]: currentState.play_console_user_id,
                [key_cloud_console_enabled]: currentState.cloud_console_enabled,
                [key_cloud_console_user_id]: currentState.cloud_console_user_id,
            }, () => {
                initialState = { ...currentState };
                saveButton.disabled = true;

                const statusEl = document.getElementById("status");
                if (statusEl) {
                    statusEl.innerText = "Configuration saved";
                    statusEl.classList.add("success", "visible");

                    setTimeout(() => {
                        if (statusEl.innerText === "Configuration saved") {
                            statusEl.classList.remove("visible");
                        }
                    }, 2000);
                }
            });
        };
    }
}

init();
