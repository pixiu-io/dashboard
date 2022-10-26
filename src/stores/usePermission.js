import { defineStore } from 'pinia';
import { ref } from 'vue';
import axiosIntance from '../utils/http';

const usePermissions = defineStore(
  'permissions',
  () => {
    const permissions = ref([]);
    const getPermission = async () => {
      const res = await axiosIntance({
        method: 'get',
        url: '/users/permissions',
      });
      permissions.value = res.result;
    };
    return { permissions, getPermission };
  },
  {
    persist: {
      storage: localStorage,
    },
  },
);

export default usePermissions;
