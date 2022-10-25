export default [
  {
    url: '/users/login',
    method: 'POST',
    response: (options) => ({
      code: 200,
      token: '12313',
    }),
  },
];
