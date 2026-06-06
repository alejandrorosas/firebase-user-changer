// jest.setup.js
import { jest } from '@jest/globals';

const listeners = [];

const chromeMock = {
  storage: {
    local: {
      get: jest.fn((keys, callback) => {
        // Return default empty object or configure in tests
        const result = {};
        if (callback) {
          callback(result);
        }
        return Promise.resolve(result);
      }),
      set: jest.fn((data, callback) => {
        if (callback) {
          callback();
        }
        return Promise.resolve();
      })
    },
    onChanged: {
      addListener: jest.fn((callback) => {
        listeners.push(callback);
      }),
      removeListener: jest.fn((callback) => {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      })
    }
  },
  declarativeNetRequest: {
    updateDynamicRules: jest.fn(() => Promise.resolve())
  }
};

global.chrome = chromeMock;

// Expose a helper to trigger storage changes in tests
global.__triggerStorageChange = (changes, namespace = 'local') => {
  listeners.forEach(listener => listener(changes, namespace));
};

// Expose clear helpers
global.__clearStorageListeners = () => {
  listeners.length = 0;
};
