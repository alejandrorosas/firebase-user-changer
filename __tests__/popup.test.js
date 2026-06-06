import fs from 'fs';
import path from 'path';
import { jest } from '@jest/globals';
import {
  key_firebase_user_id,
  key_firebase_enabled,
  key_play_console_user_id,
  key_play_console_enabled,
  key_cloud_console_user_id,
  key_cloud_console_enabled
} from '../constants.js';

const html = fs.readFileSync(path.resolve(process.cwd(), 'popup.html'), 'utf8');

describe('popup.js', () => {
  beforeEach(() => {
    document.body.innerHTML = html;
    jest.clearAllMocks();
    jest.resetModules();
  });

  test('initializes UI inputs based on storage state (all enabled)', async () => {
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({
        [key_firebase_enabled]: true,
        [key_firebase_user_id]: '1',
        [key_play_console_enabled]: true,
        [key_play_console_user_id]: '2',
        [key_cloud_console_enabled]: true,
        [key_cloud_console_user_id]: '3'
      });
    });

    await import('../popup.js');

    expect(document.getElementById('firebase_enabled').checked).toBe(true);
    expect(document.getElementById('firebase_user_id').value).toBe('1');
    expect(document.getElementById('firebase_user_id').disabled).toBe(false);
    expect(document.getElementById('card_firebase').classList.contains('disabled')).toBe(false);

    expect(document.getElementById('play_console_enabled').checked).toBe(true);
    expect(document.getElementById('play_console_user_id').value).toBe('2');
    expect(document.getElementById('play_console_user_id').disabled).toBe(false);
    expect(document.getElementById('card_play').classList.contains('disabled')).toBe(false);

    expect(document.getElementById('cloud_console_enabled').checked).toBe(true);
    expect(document.getElementById('cloud_console_user_id').value).toBe('3');
    expect(document.getElementById('cloud_console_user_id').disabled).toBe(false);
    expect(document.getElementById('card_cloud').classList.contains('disabled')).toBe(false);

    expect(document.getElementById('save').disabled).toBe(true);
  });

  test('initializes UI inputs based on storage state (some disabled)', async () => {
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({
        [key_firebase_enabled]: false,
        [key_firebase_user_id]: '1',
        [key_play_console_enabled]: false,
        [key_play_console_user_id]: '',
        [key_cloud_console_enabled]: true,
        [key_cloud_console_user_id]: '9'
      });
    });

    await import('../popup.js');

    expect(document.getElementById('firebase_enabled').checked).toBe(false);
    expect(document.getElementById('firebase_user_id').value).toBe('1');
    expect(document.getElementById('firebase_user_id').disabled).toBe(true);
    expect(document.getElementById('card_firebase').classList.contains('disabled')).toBe(true);

    expect(document.getElementById('play_console_enabled').checked).toBe(false);
    expect(document.getElementById('play_console_user_id').value).toBe('');
    expect(document.getElementById('play_console_user_id').disabled).toBe(true);
    expect(document.getElementById('card_play').classList.contains('disabled')).toBe(true);

    expect(document.getElementById('cloud_console_enabled').checked).toBe(true);
    expect(document.getElementById('cloud_console_user_id').value).toBe('9');
    expect(document.getElementById('cloud_console_user_id').disabled).toBe(false);
    expect(document.getElementById('card_cloud').classList.contains('disabled')).toBe(false);
  });

  test('enables/disables inputs and toggles cards when checkboxes are changed', async () => {
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({
        [key_firebase_enabled]: false,
        [key_firebase_user_id]: '',
        [key_play_console_enabled]: false,
        [key_play_console_user_id]: '',
        [key_cloud_console_enabled]: false,
        [key_cloud_console_user_id]: ''
      });
    });

    await import('../popup.js');

    const firebaseEnabledCheckbox = document.getElementById('firebase_enabled');
    const firebaseUserIdInput = document.getElementById('firebase_user_id');
    const cardFirebase = document.getElementById('card_firebase');

    expect(firebaseUserIdInput.disabled).toBe(true);
    expect(cardFirebase.classList.contains('disabled')).toBe(true);

    firebaseEnabledCheckbox.checked = true;
    firebaseEnabledCheckbox.dispatchEvent(new Event('change'));

    expect(firebaseUserIdInput.disabled).toBe(false);
    expect(cardFirebase.classList.contains('disabled')).toBe(false);

    firebaseEnabledCheckbox.checked = false;
    firebaseEnabledCheckbox.dispatchEvent(new Event('change'));

    expect(firebaseUserIdInput.disabled).toBe(true);
    expect(cardFirebase.classList.contains('disabled')).toBe(true);
  });

  test('enables Save button when unsaved changes exist, and disables when reverted', async () => {
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({
        [key_firebase_enabled]: false,
        [key_firebase_user_id]: '1',
      });
    });

    await import('../popup.js');

    const saveButton = document.getElementById('save');
    const firebaseEnabledCheckbox = document.getElementById('firebase_enabled');
    const statusText = document.getElementById('status');

    expect(saveButton.disabled).toBe(true);

    firebaseEnabledCheckbox.checked = true;
    firebaseEnabledCheckbox.dispatchEvent(new Event('change'));

    expect(saveButton.disabled).toBe(false);
    expect(statusText.innerText).toBe('Unsaved changes');
    expect(statusText.classList.contains('visible')).toBe(true);

    firebaseEnabledCheckbox.checked = false;
    firebaseEnabledCheckbox.dispatchEvent(new Event('change'));

    expect(saveButton.disabled).toBe(true);
    expect(statusText.classList.contains('visible')).toBe(false);
  });

  test('saves state to chrome.storage.local on Save button click', async () => {
    jest.useFakeTimers();

    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({
        [key_firebase_enabled]: false,
        [key_firebase_user_id]: '0',
      });
    });

    await import('../popup.js');

    const saveButton = document.getElementById('save');
    const firebaseEnabledCheckbox = document.getElementById('firebase_enabled');
    const firebaseUserIdInput = document.getElementById('firebase_user_id');
    const statusText = document.getElementById('status');

    firebaseEnabledCheckbox.checked = true;
    firebaseEnabledCheckbox.dispatchEvent(new Event('change'));
    firebaseUserIdInput.value = '5';
    firebaseUserIdInput.dispatchEvent(new Event('input'));

    expect(saveButton.disabled).toBe(false);

    saveButton.click();

    expect(chrome.storage.local.set).toHaveBeenCalledWith(
      expect.objectContaining({
        [key_firebase_enabled]: true,
        [key_firebase_user_id]: '5'
      }),
      expect.any(Function)
    );

    expect(saveButton.disabled).toBe(true);
    expect(statusText.innerText).toBe('Configuration saved');
    expect(statusText.classList.contains('success')).toBe(true);
    expect(statusText.classList.contains('visible')).toBe(true);

    jest.advanceTimersByTime(2000);
    expect(statusText.classList.contains('visible')).toBe(false);

    jest.useRealTimers();
  });
});
