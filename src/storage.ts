export const getItems = async (
  keys: string[]
): Promise<{ [key: string]: any }> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(keys, (items) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(items);
      }
    });
  });
};

export const setItem = async (item: { [key: string]: any }): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(item, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
};

export const set = async <T>(key: string, item: T): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(
      {
        [key]: JSON.stringify(item),
      },
      () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      }
    );
  });
};

export const get = async <T>(key: string): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, (item) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        if (!item[key]) {
          return resolve(undefined);
        }
        const v = JSON.parse(item[key]);
        resolve(v);
      }
    });
  });
};
