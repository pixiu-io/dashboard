import permissionDirective from './permission';

const setupDirective = (app) => {
  app.directive('permissions', permissionDirective);
};

export default setupDirective;
