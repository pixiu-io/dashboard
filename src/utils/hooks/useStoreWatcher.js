import { ref, watch } from 'vue';

const useStoreWatcher = (store, stateName, callback) => {
  watch(
    () => store[stateName],
    (newValue, oldValue) => {
      callback(newValue, oldValue);
    },
    { deep: true },
  );
};

export default useStoreWatcher;
