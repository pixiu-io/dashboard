import { pinia, usePermissions } from "@/store";

const permissionsStore = usePermissions(pinia);

const permissionDirective = (el, binding) => {
  console.log(el);
  if (permissionsStore.permissions.indexOf(binding.value) < 0) {
    el.parentNode.removeChild(el);
  }
};
export default permissionDirective;
