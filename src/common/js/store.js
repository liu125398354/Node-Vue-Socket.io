/**
 * Created by liunannan on 2017/11/27.
 */
export function saveToLocal(key, value) {
  let store = window.localStorage.__store__;
  if (!store) {
    store = {};
  } else {
    store = JSON.parse(store);
  }
  store[key] = value;
  window.localStorage.__store__ = JSON.stringify(store);
};

export function loadFromLocal(key) {
  let store = window.localStorage.__store__;
  if (!store) {
    return false;
  }
  store = JSON.parse(store);
  if (!store[key]) {
    return false;
  }
  let ret = store[key];
  return ret;
};

export function removeLocal(key) {
  let store = window.localStorage.__store__;
  store = JSON.parse(store);
  delete store[key];
  window.localStorage.__store__ = JSON.stringify(store);
};
