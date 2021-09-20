export const getCurrentTab = async (): Promise<chrome.tabs.Tab> => {
  return new Promise((resolve) => {
    const queryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(queryOptions, (tabs) => {
      resolve(tabs[0]);
    });
  });
};
