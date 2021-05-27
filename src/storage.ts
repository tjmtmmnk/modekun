export const getItems = async (keys: string[]): Promise<{ [key: string]: any }> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys, (items) => {
      resolve(items);
    });
  });
};
