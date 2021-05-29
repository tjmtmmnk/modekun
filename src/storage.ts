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
