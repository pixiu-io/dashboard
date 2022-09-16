import { defineStore } from "pinia";

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
});

export default usePermissions;
