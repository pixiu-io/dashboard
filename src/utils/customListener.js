export default function customListener() {
  const orginalSetItem = localStorage.setItem;

  localStorage.setItem = function (key, value) {
    const setItemEvent = new Event('setItem');
    setItemEvent.oldValue = localStorage.getItem(key);
    setItemEvent.storageArea = localStorage;
    setItemEvent.key = key;
    setItemEvent.newValue = value;
    orginalSetItem.apply(this, arguments);
    window.dispatchEvent(setItemEvent);
  };
}
