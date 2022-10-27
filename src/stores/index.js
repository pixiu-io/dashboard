import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const setupPinia = (app) => {
  app.use(pinia);
};

export default setupPinia;
