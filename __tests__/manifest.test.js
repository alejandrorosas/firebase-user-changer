import fs from 'fs';
import path from 'path';

describe('manifest.json validation', () => {
  let manifest;

  beforeAll(() => {
    const manifestPath = path.resolve(process.cwd(), 'manifest.json');
    const content = fs.readFileSync(manifestPath, 'utf8');
    manifest = JSON.parse(content);
  });

  test('contains required core fields', () => {
    expect(manifest.manifest_version).toBeDefined();
    expect(manifest.name).toBeDefined();
    expect(manifest.version).toBeDefined();
  });

  test('referenced background service worker file exists if defined', () => {
    if (manifest.background && manifest.background.service_worker) {
      const swPath = path.resolve(process.cwd(), manifest.background.service_worker);
      expect(fs.existsSync(swPath)).toBe(true);
    }
  });

  test('referenced default popup file exists if defined', () => {
    if (manifest.action && manifest.action.default_popup) {
      const popupPath = path.resolve(process.cwd(), manifest.action.default_popup);
      expect(fs.existsSync(popupPath)).toBe(true);
    }
  });

  test('all referenced icon files exist if defined', () => {
    if (manifest.icons) {
      Object.values(manifest.icons).forEach(iconPath => {
        const fullIconPath = path.resolve(process.cwd(), iconPath);
        expect(fs.existsSync(fullIconPath)).toBe(true);
      });
    }
  });
});

