export default [
  {
    url: '/clouds',
    method: 'GET',
    response: (options) => {
      return {
        code: 200,
        result: {
          data: [
            {
              id: 22220832,
              resource_version: 0,
              gmt_create: '2022-10-26 07:44:08',
              gmt_modified: '2022-10-26 07:44:08',
              name: 'pix-73307084',
              alias_name: '',
              status: 4,
              cloud_type: 2,
              kube_version: '1.20.0',
              kube_config: null,
              node_number: 0,
              resources: '',
              description: 'fff',
            },
            {
              id: 22220833,
              resource_version: 0,
              gmt_create: '2022-10-26 08:10:35',
              gmt_modified: '2022-10-28 23:31:51',
              name: 'atm-35ea50e5',
              alias_name: 'test',
              status: 0,
              cloud_type: 1,
              kube_version: 'v1.23.6',
              kube_config: null,
              node_number: 1,
              resources: '',
              description: '',
            },
          ],
          total: 2,
        },
      };
    },
  },
  {
    url: '/clouds/:id',
    method: 'delete',
    response: () => {
      return {
        code: 400,
        message: '删除失败',
      };
    },
  },
];
