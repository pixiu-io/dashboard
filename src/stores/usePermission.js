import { defineStore } from "pinia";
import axiosIntance from "../utils/http";

const usePermissions = defineStore("permissions", {
  state: () => {
    return {
      permissions: [
        "user:cloud:add",
        "user:cloud:delete",
        "user:cloud:setting",
        "user:cloud:start",
        "user:cloud:detail",
      ],
    };
  },
  getters: {},
  actions: {
    // 获取权限列表
    async getPermission() {
      console.log("获取权限。。。。");
      const res = await axiosIntance({
        method: "get",
        url: "/users/permissions",
      });

      // if (res.code == 200) {
      //   this.permissions = res.result;
      //   console.log(res.result);
      // }
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "permissions",
        storage: localStorage,
      },
    ],
  },
});

export default usePermissions;
