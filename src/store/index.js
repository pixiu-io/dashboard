import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";
import usePermissions from "./usePermission";
const pinia = createPinia();
pinia.use(createPersistedState);

export { pinia, usePermissions };
