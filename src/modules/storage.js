import { CONFIG, getTargetDate } from '../config.js';

/**
 * Storage manager for handling IndexedDB-backed app storage
 */
export class StorageManager {
  // In-memory caches to keep synchronous API while persisting to IndexedDB
  static _db = null;
  static _weeksCache = {};
  static _foldersCache = [];
  static _configCache = {};

  // Initialize IndexedDB and load caches. Call once at app start.
  static async init() {
    if (this._db) return true;
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('lifeWeeksDB', 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('weeks')) db.createObjectStore('weeks', { keyPath: 'week' });
        if (!db.objectStoreNames.contains('folders')) db.createObjectStore('folders', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('config')) db.createObjectStore('config', { keyPath: 'key' });
      };
      req.onsuccess = (e) => {
        this._db = e.target.result;
        // load caches
        Promise.all([this._loadAllWeeks(), this._loadAllFolders(), this._loadAllConfig()])
          .then(() => {
            const theme = localStorage.getItem('lifeWeeksTheme');
            if (theme && !this._configCache['lifeWeeksTheme']) {
              this._configCache['lifeWeeksTheme'] = theme;
              this._put('config', { key: 'lifeWeeksTheme', value: theme });
            }
            resolve(true);
          })
          .catch(() => resolve(true));
      };
      req.onerror = () => resolve(false);
    });
  }

  static _getTx(storeName, mode = 'readonly') {
    if (!this._db) throw new Error('DB not initialized');
    return this._db.transaction([storeName], mode).objectStore(storeName);
  }

  static _loadAllWeeks() {
    return new Promise((resolve) => {
      try {
        const store = this._getTx('weeks');
        const req = store.getAll();
        req.onsuccess = () => {
          const items = req.result || [];
          this._weeksCache = {};
          items.forEach((it) => {
            this._weeksCache[String(it.week)] = {
              highlights: it.highlights || '',
              attachments: Array.isArray(it.attachments) ? it.attachments : [],
              important: !!it.important
            };
          });
          resolve(true);
        };
        req.onerror = () => resolve(true);
      } catch {
        resolve(true);
      }
    });
  }

  static _loadAllFolders() {
    return new Promise((resolve) => {
      try {
        const store = this._getTx('folders');
        const req = store.getAll();
        req.onsuccess = () => {
          this._foldersCache = req.result || [];
          resolve(true);
        };
        req.onerror = () => resolve(true);
      } catch {
        resolve(true);
      }
    });
  }

  static _loadAllConfig() {
    return new Promise((resolve) => {
      try {
        const store = this._getTx('config');
        const req = store.getAll();
        req.onsuccess = () => {
          const items = req.result || [];
          this._configCache = {};
          items.forEach((it) => (this._configCache[it.key] = it.value));
          resolve(true);
        };
        req.onerror = () => resolve(true);
      } catch {
        resolve(true);
      }
    });
  }

  static _put(storeName, value) {
    if (!this._db) return Promise.resolve(false);
    return new Promise((resolve) => {
      try {
        const tx = this._db.transaction([storeName], 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(value);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  static _deleteKey(storeName, key) {
    if (!this._db) return Promise.resolve(false);
    return new Promise((resolve) => {
      try {
        const tx = this._db.transaction([storeName], 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  static getBirthDate() {
    try {
      const birthDateStr = this._configCache['birthDate'];
      return birthDateStr ? new Date(birthDateStr) : null;
    } catch {
      return null;
    }
  }

  static saveBirthDate(birthDate) {
    try {
      const iso = birthDate.toISOString();
      this._configCache['birthDate'] = iso;
      this._put('config', { key: 'birthDate', value: iso });
      return true;
    } catch {
      return false;
    }
  }

  static getTheme() {
    try {
      const theme = this._configCache['lifeWeeksTheme'];
      if (theme) return theme;
      return localStorage.getItem('lifeWeeksTheme');
    } catch {
      return null;
    }
  }

  static setTheme(theme) {
    try {
      this._configCache['lifeWeeksTheme'] = theme;
      this._put('config', { key: 'lifeWeeksTheme', value: theme });
      return true;
    } catch {
      return false;
    }
  }

  static getWeekData(weekNumber) {
    try {
      const key = String(weekNumber);
      const cached = this._weeksCache[key];
      if (cached) {
        return {
          highlights: cached.highlights || '',
          attachments: Array.isArray(cached.attachments) ? cached.attachments : [],
          important: !!cached.important
        };
      }
      // Fallback to legacy localStorage and migrate into cache
      try {
        const data = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '{}');
        const weekData = data[weekNumber];
        if (!weekData) return { highlights: '', attachments: [], important: false };
        const attachments = Array.isArray(weekData.attachments) ? weekData.attachments : [];
        const entry = { highlights: weekData.highlights || '', attachments, important: !!weekData.important };
        this._weeksCache[key] = entry;
        this._put('weeks', { week: Number(weekNumber), highlights: entry.highlights, attachments: attachments, important: !!entry.important });
        return entry;
      } catch {
        return { highlights: '', attachments: [], important: false };
      }
    } catch {
      return { highlights: '', attachments: [], important: false };
    }
  }

  static saveWeekData(weekNumber, highlights, attachments = [], important = false) {
    try {
      const key = String(weekNumber);
      const trimmedText = (highlights || '').trim();
      if (trimmedText === '' && (!attachments || attachments.length === 0)) {
        delete this._weeksCache[key];
        this._deleteKey('weeks', Number(weekNumber));
      } else {
        this._weeksCache[key] = { highlights: highlights, attachments: attachments, important: !!important };
        this._put('weeks', { week: Number(weekNumber), highlights: highlights, attachments: attachments, important: !!important });
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  static saveHighlights(weekNumber, highlights) {
    return this.saveWeekData(weekNumber, highlights, []);
  }

  static getAllHighlights() {
    try {
      // Build from cache
      const out = {};
      Object.keys(this._weeksCache).forEach((k) => {
        out[k] = {
          highlights: this._weeksCache[k].highlights || '',
          attachments: Array.isArray(this._weeksCache[k].attachments) ? this._weeksCache[k].attachments : [],
          important: !!this._weeksCache[k].important
        };
      });
      if (Object.keys(out).length > 0) return out;
      // Fallback to legacy localStorage
      try {
        return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '{}');
      } catch {
        return {};
      }
    } catch {
      return {};
    }
  }

  static hashFolderPassword(password) {
    try {
      return btoa(password);
    } catch {
      return null;
    }
  }
  static isFolderPasswordSet() {
    try {
      if (this._configCache[CONFIG.FOLDER_PASSWORD_KEY]) return true;
      try {
        return !!localStorage.getItem(CONFIG.FOLDER_PASSWORD_KEY);
      } catch {
        return false;
      }
    } catch {
      return false;
    }
  }

  static verifyFolderPassword(password) {
    try {
      const storedHash = this._configCache[CONFIG.FOLDER_PASSWORD_KEY] || localStorage.getItem(CONFIG.FOLDER_PASSWORD_KEY);
      return storedHash && storedHash === this.hashFolderPassword(password);
    } catch {
      return false;
    }
  }

  static saveFolderPassword(password) {
    try {
      const hash = this.hashFolderPassword(password);
      if (!hash) return false;
      this._configCache[CONFIG.FOLDER_PASSWORD_KEY] = hash;
      this._put('config', { key: CONFIG.FOLDER_PASSWORD_KEY, value: hash });
      return true;
    } catch {
      return false;
    }
  }

  static clearFolderPassword() {
    try {
      delete this._configCache[CONFIG.FOLDER_PASSWORD_KEY];
      this._deleteKey('config', CONFIG.FOLDER_PASSWORD_KEY);
      return true;
    } catch {
      return false;
    }
  }

  static clearFolderData() {
    try {
      this._foldersCache = [];
      if (this._db) {
        try {
          const tx = this._db.transaction(['folders'], 'readwrite');
          tx.objectStore('folders').clear();
        } catch {}
      }
      try {
        localStorage.removeItem(CONFIG.FOLDER_STORAGE_KEY);
      } catch {}
      return true;
    } catch {
      return false;
    }
  }

  static getFolderData() {
    try {
      if (Array.isArray(this._foldersCache) && this._foldersCache.length > 0) return JSON.parse(JSON.stringify(this._foldersCache));
      // Fallback to legacy localStorage and migrate into cache
      try {
        const storedData = JSON.parse(localStorage.getItem(CONFIG.FOLDER_STORAGE_KEY) || '[]');
        const arr = Array.isArray(storedData) ? storedData : [];
        this._foldersCache = arr;
        // persist per-folder to IndexedDB
        arr.forEach((f) => this._put('folders', f));
        return JSON.parse(JSON.stringify(arr));
      } catch {
        return [];
      }
    } catch {
      return [];
    }
  }

  static saveFolderData(folders) {
    try {
      const safeFolders = Array.isArray(folders) ? folders : [];
      this._foldersCache = safeFolders;
      // persist each folder to IndexedDB
      safeFolders.forEach((f) => {
        try {
          this._put('folders', f);
        } catch {}
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  static saveFolder(folder) {
    try {
      const folders = this.getFolderData();
      const existingIndex = folders.findIndex((item) => item.id === folder.id);
      const sanitizedAttachments = Array.isArray(folder.attachments)
        ? folder.attachments.map((attachment) => ({
            name: attachment.name,
            type: attachment.type,
            data: attachment.data,
            size: attachment.size
          }))
        : [];
      const folderToSave = {
        ...folder,
        attachments: sanitizedAttachments,
        updatedAt: new Date().toISOString()
      };
      if (existingIndex >= 0) {
        folders[existingIndex] = folderToSave;
      } else {
        folderToSave.createdAt = new Date().toISOString();
        folders.push(folderToSave);
      }
      // update cache and persist
      this._foldersCache = folders;
      try {
        this._put('folders', folderToSave);
      } catch {}
      return true;
    } catch {
      return false;
    }
  }

  static deleteFolder(folderId) {
    try {
      const folders = this.getFolderData().filter((item) => item.id !== folderId);
      this._foldersCache = folders;
      try {
        this._deleteKey('folders', folderId);
      } catch {}
      return true;
    } catch {
      return false;
    }
  }

  static getFolderById(folderId) {
    try {
      const found = (Array.isArray(this._foldersCache) ? this._foldersCache : this.getFolderData()).find((item) => item.id === folderId);
      return found || null;
    } catch {
      return null;
    }
  }

  static exportData() {
    try {
      const payload = {
        weeks: this.getAllHighlights(),
        folders: this.getFolderData(),
        config: this._configCache || {}
      };
      const dataStr = JSON.stringify(payload, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      return dataBlob;
    } catch {
      return null;
    }
  }

  static importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      // weeks
      if (data.weeks && typeof data.weeks === 'object') {
        Object.keys(data.weeks).forEach((k) => {
          const wk = data.weeks[k];
          try {
            this._weeksCache[String(k)] = { highlights: wk.highlights || '', attachments: wk.attachments || [], important: !!wk.important };
            this._put('weeks', { week: Number(k), highlights: wk.highlights || '', attachments: wk.attachments || [], important: !!wk.important });
          } catch {}
        });
      }
      // folders
      if (Array.isArray(data.folders)) {
        this._foldersCache = data.folders;
        data.folders.forEach((f) => this._put('folders', f));
      }
      // config
      if (data.config && typeof data.config === 'object') {
        Object.keys(data.config).forEach((k) => {
          try {
            this._configCache[k] = data.config[k];
            this._put('config', { key: k, value: data.config[k] });
          } catch {}
        });
      }
      return true;
    } catch {
      return false;
    }
  }

  static clearAllData() {
    try {
      this._weeksCache = {};
      this._foldersCache = [];
      this._configCache = {};
      if (this._db) {
        try {
          this._getTx('weeks', 'readwrite').clear();
          this._getTx('folders', 'readwrite').clear();
          this._getTx('config', 'readwrite').clear();
        } catch {}
      }
      try {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        localStorage.removeItem(CONFIG.FOLDER_STORAGE_KEY);
      } catch {}
      return true;
    } catch {
      return false;
    }
  }

  // Security & Password methods
  static isFolderSetupComplete() {
    try {
      if (this._configCache[CONFIG.FOLDER_SETUP_COMPLETE_KEY]) return this._configCache[CONFIG.FOLDER_SETUP_COMPLETE_KEY] === 'true';
      try {
        return !!localStorage.getItem(CONFIG.FOLDER_SETUP_COMPLETE_KEY);
      } catch {
        return false;
      }
    } catch {
      return false;
    }
  }

  static markFolderSetupComplete() {
    try {
      this._configCache[CONFIG.FOLDER_SETUP_COMPLETE_KEY] = 'true';
      this._put('config', { key: CONFIG.FOLDER_SETUP_COMPLETE_KEY, value: 'true' });
      return true;
    } catch {
      return false;
    }
  }

  static saveSecurityQuestions(question1Answer, question2Answer) {
    try {
      const questions = {
        q1: this.hashPassword(question1Answer.toLowerCase().trim()),
        q2: this.hashPassword(question2Answer.toLowerCase().trim())
      };
      this._configCache[CONFIG.FOLDER_SECURITY_QUESTIONS_KEY] = questions;
      this._put('config', { key: CONFIG.FOLDER_SECURITY_QUESTIONS_KEY, value: questions });
      return true;
    } catch {
      return false;
    }
  }

  static verifySecurityQuestions(question1Answer, question2Answer) {
    try {
      const stored = this._configCache[CONFIG.FOLDER_SECURITY_QUESTIONS_KEY] || JSON.parse(localStorage.getItem(CONFIG.FOLDER_SECURITY_QUESTIONS_KEY) || '{}');
      const q1Matches = stored.q1 === this.hashPassword(question1Answer.toLowerCase().trim());
      const q2Matches = stored.q2 === this.hashPassword(question2Answer.toLowerCase().trim());
      return q1Matches && q2Matches;
    } catch {
      return false;
    }
  }

  static hashPassword(password) {
    try {
      return btoa(password + 'security-salt-key');
    } catch {
      return null;
    }
  }

  static getPasswordAttempts() {
    try {
      const attemptVal = this._configCache[CONFIG.FOLDER_PASSWORD_ATTEMPTS_KEY] || localStorage.getItem(CONFIG.FOLDER_PASSWORD_ATTEMPTS_KEY);
      return attemptVal ? parseInt(attemptVal) : 0;
    } catch {
      return 0;
    }
  }

  static incrementPasswordAttempts() {
    try {
      const current = this.getPasswordAttempts();
      const next = String(current + 1);
      this._configCache[CONFIG.FOLDER_PASSWORD_ATTEMPTS_KEY] = next;
      this._put('config', { key: CONFIG.FOLDER_PASSWORD_ATTEMPTS_KEY, value: next });
      try {
        localStorage.setItem(CONFIG.FOLDER_PASSWORD_ATTEMPTS_KEY, next);
      } catch {}
      return current + 1;
    } catch {
      return 0;
    }
  }

  static resetPasswordAttempts() {
    try {
      delete this._configCache[CONFIG.FOLDER_PASSWORD_ATTEMPTS_KEY];
      this._deleteKey('config', CONFIG.FOLDER_PASSWORD_ATTEMPTS_KEY);
      return true;
    } catch {
      return false;
    }
  }

  static resetFolderAndPassword() {
    try {
      this.clearFolderPassword();
      this.clearFolderData();
      delete this._configCache[CONFIG.FOLDER_SETUP_COMPLETE_KEY];
      delete this._configCache[CONFIG.FOLDER_SECURITY_QUESTIONS_KEY];
      this._deleteKey('config', CONFIG.FOLDER_SETUP_COMPLETE_KEY);
      this._deleteKey('config', CONFIG.FOLDER_SECURITY_QUESTIONS_KEY);
      try {
        localStorage.removeItem(CONFIG.FOLDER_SETUP_COMPLETE_KEY);
        localStorage.removeItem(CONFIG.FOLDER_SECURITY_QUESTIONS_KEY);
      } catch {}
      this.resetPasswordAttempts();
      return true;
    } catch {
      return false;
    }
  }
}