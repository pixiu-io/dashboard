import usePermissions from '@/stores/usePermission';

const permissionDirective = (el, binding) => {
  // const permissionsStore = usePermissions();
  // if (permissionsStore.permissions.indexOf(binding.value) < 0) {
  //   // el.parentNode.removeChild(el);
  //   el.setAttribute('disabled', true);
  //   el.classList.add('is-disabled');
  //   el.addEventListener('click', disableClickFn, true);
  // }
};

const disableClickFn = (event) => {
  event && event.stopImmediatePropagation();
};

export default permissionDirective;
