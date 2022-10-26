export default [
  {
    url: '/users/permissions',
    method: 'GET',
    response: (options) => ({
      code: 200,
      result: [
        'user:cloud:add',
        'user:cloud:delete',
        'user:cloud:setting',
        'user:cloud:start',
        'user:cloud:detail',
      ],
    }),
  },
];
