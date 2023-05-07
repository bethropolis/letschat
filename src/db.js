
export function DB(type = "", key = "", data = null) {
  const localStorageObj = localStorage;
  let storedData;
  if (type === "get") {
    storedData = JSON.parse(localStorageObj.getItem(key) || "false");
    return data ? storedData[data] : storedData;
  }

  if (type === "set") {
    localStorageObj.setItem(key, JSON.stringify(data));
    return;
  }

  if (type === "update") {
    data = typeof data === "string" ? JSON.parse(data) : data;

    storedData = JSON.parse(localStorageObj.getItem(key) || "{}");
    const updatedData = { ...storedData, ...data };
    localStorageObj.setItem(key, JSON.stringify(updatedData));
    return;
  }

  if (type === "remove") {
    storedData = JSON.parse(localStorageObj.getItem(key) || "{}");
    delete storedData[data];
    localStorageObj.removeItem(key);
    return;
  }

  if (type === "clear") {
    localStorageObj.clear();
    return;
  }
}
