import usePermissions from '@/stores/usePermission';

const permissionDirective = (el, binding) => {
  const permissionsStore = usePermissions();
  if (permissionsStore.permissions.indexOf(binding.value) < 0) {
    el.parentNode.removeChild(el);
  }
};
export default permissionDirective;
