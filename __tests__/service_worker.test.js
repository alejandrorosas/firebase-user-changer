import { jest } from '@jest/globals';
import {
  key_firebase_user_id,
  key_firebase_enabled,
  key_play_console_user_id,
  key_play_console_enabled,
  key_cloud_console_user_id,
  key_cloud_console_enabled,
  key_firebase_rule_id,
  key_play_console_rule_id,
  key_cloud_console_rule_id
} from '../constants.js';

describe('service_worker.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.__clearStorageListeners();
    jest.resetModules();
  });

  test('registers storage onChanged listener and runs setupDynamicRules on startup', async () => {
    chrome.storage.local.get.mockResolvedValue({
      [key_firebase_enabled]: true,
      [key_firebase_user_id]: '1',
      [key_play_console_enabled]: true,
      [key_play_console_user_id]: '2',
      [key_cloud_console_enabled]: true,
      [key_cloud_console_user_id]: '3',
    });

    await import('../service_worker.js');

    expect(chrome.storage.onChanged.addListener).toHaveBeenCalledTimes(1);
    expect(chrome.storage.local.get).toHaveBeenCalledWith([key_firebase_user_id, key_firebase_enabled]);
    expect(chrome.storage.local.get).toHaveBeenCalledWith([key_play_console_user_id, key_play_console_enabled]);
    expect(chrome.storage.local.get).toHaveBeenCalledWith([key_cloud_console_user_id, key_cloud_console_enabled]);

    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledTimes(3);

    // Verify Firebase redirect rule format
    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith(
      expect.objectContaining({
        addRules: expect.arrayContaining([
          expect.objectContaining({
            id: key_firebase_rule_id,
            action: expect.objectContaining({
              type: 'redirect',
              redirect: expect.objectContaining({
                regexSubstitution: 'https://console.firebase.google.com/u/1/\\2'
              })
            })
          })
        ])
      })
    );
  });

  test('removes rules when disabled or user ID is undefined', async () => {
    chrome.storage.local.get.mockResolvedValue({
      [key_firebase_enabled]: false,
      [key_firebase_user_id]: '1',
      [key_play_console_enabled]: true,
      [key_play_console_user_id]: undefined,
      [key_cloud_console_enabled]: false,
      [key_cloud_console_user_id]: undefined
    });

    await import('../service_worker.js');

    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith({
      removeRuleIds: [key_firebase_rule_id]
    });
    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith({
      removeRuleIds: [key_play_console_rule_id]
    });
    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith({
      removeRuleIds: [key_cloud_console_rule_id]
    });
  });

  test('re-runs setupDynamicRules when storage changes', async () => {
    chrome.storage.local.get.mockResolvedValue({});
    await import('../service_worker.js');

    chrome.storage.local.get.mockClear();
    chrome.declarativeNetRequest.updateDynamicRules.mockClear();

    global.__triggerStorageChange({ [key_firebase_enabled]: { newValue: true } });

    expect(chrome.storage.local.get).toHaveBeenCalled();
  });

  test('validates exact redirect URL matching and substitution patterns for all supported URL formats', async () => {
    chrome.storage.local.get.mockResolvedValue({
      [key_firebase_enabled]: true,
      [key_firebase_user_id]: '99',
      [key_play_console_enabled]: true,
      [key_play_console_user_id]: '88',
      [key_cloud_console_enabled]: true,
      [key_cloud_console_user_id]: '77',
    });

    await import('../service_worker.js');

    const calls = chrome.declarativeNetRequest.updateDynamicRules.mock.calls;

    const firebaseRule = calls.find(call => 
      call[0].addRules && call[0].addRules[0].id === key_firebase_rule_id
    )[0].addRules[0];

    const playRule = calls.find(call => 
      call[0].addRules && call[0].addRules[0].id === key_play_console_rule_id
    )[0].addRules[0];

    const cloudRule = calls.find(call => 
      call[0].addRules && call[0].addRules[0].id === key_cloud_console_rule_id
    )[0].addRules[0];

    const firebaseRegex = new RegExp(firebaseRule.condition.regexFilter);
    const firebaseSub = firebaseRule.action.redirect.regexSubstitution.replace(/\\(\d+)/g, '$$$1');

    const playRegex = new RegExp(playRule.condition.regexFilter);
    const playSub = playRule.action.redirect.regexSubstitution.replace(/\\(\d+)/g, '$$$1');

    // --- Firebase URL redirect test scenarios ---
    const firebaseScenarios = [
      {
        input: 'https://console.firebase.google.com/u/0/',
        expected: 'https://console.firebase.google.com/u/99/',
        shouldMatch: true
      },
      {
        input: 'https://console.firebase.google.com/u/1/project/my-awesome-project/overview',
        expected: 'https://console.firebase.google.com/u/99/project/my-awesome-project/overview',
        shouldMatch: true
      },
      {
        input: 'https://console.firebase.google.com/u//project/my-awesome-project/overview',
        expected: 'https://console.firebase.google.com/u/99/project/my-awesome-project/overview',
        shouldMatch: true
      },
      {
        input: 'https://console.firebase.google.com/u/5/settings',
        expected: 'https://console.firebase.google.com/u/99/settings',
        shouldMatch: true
      },
      {
        input: 'https://firebase.google.com/',
        shouldMatch: false
      },
      {
        input: 'https://console.firebase.google.com/project/my-awesome-project',
        shouldMatch: false
      }
    ];

    firebaseScenarios.forEach(({ input, expected, shouldMatch }) => {
      const isMatch = firebaseRegex.test(input);
      expect(isMatch).toBe(shouldMatch);
      if (shouldMatch) {
        const redirected = input.replace(firebaseRegex, firebaseSub);
        expect(redirected).toBe(expected);
      }
    });

    // --- Play Console URL redirect test scenarios ---
    const playScenarios = [
      {
        input: 'https://play.google.com/console/u/0/developers',
        expected: 'https://play.google.com/console/u/88/developers',
        shouldMatch: true
      },
      {
        input: 'https://play.google.com/console/u/1/developers/987654321/app-list',
        expected: 'https://play.google.com/console/u/88/developers/987654321/app-list',
        shouldMatch: true
      },
      {
        input: 'https://play.google.com/console/u//developers/',
        expected: 'https://play.google.com/console/u/88/developers/',
        shouldMatch: true
      },
      {
        input: 'https://play.google.com/store',
        shouldMatch: false
      },
      {
        input: 'https://play.google.com/console/developers',
        shouldMatch: false
      }
    ];

    playScenarios.forEach(({ input, expected, shouldMatch }) => {
      const isMatch = playRegex.test(input);
      expect(isMatch).toBe(shouldMatch);
      if (shouldMatch) {
        const redirected = input.replace(playRegex, playSub);
        expect(redirected).toBe(expected);
      }
    });

    // --- Cloud Console redirect test scenarios ---
    expect(cloudRule.condition.requestDomains).toContain('console.cloud.google.com');
    const cloudParam = cloudRule.action.redirect.transform.queryTransform.addOrReplaceParams.find(p => p.key === 'authuser');
    expect(cloudParam).toBeDefined();
    expect(cloudParam.value).toBe('77');
  });
});

