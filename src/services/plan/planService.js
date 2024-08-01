import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';
import { getHeadersWithToken } from '@/utils/utils';

export const createPlan = async (data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: '/pixiu/plans',
      data: data,
    }),
  );
  return [result, err];
};

export const getPlan = async (pid) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/plans/${pid}`,
    }),
  );
  return [result, err];
};

export const getPlanResources = async (pid) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/plans/${pid}/resources`,
    }),
  );
  return [result, err];
};

export const GetPlanList = async () => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: '/pixiu/plans',
    }),
  );
  return [result, err];
};

export const deletePlan = async (pid) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/plans/${pid}`,
    }),
  );
  return [result, err];
};

export const updatePlan = async (pid, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/pixiu/plans/${pid}`,
      data: data,
    }),
  );
  return [result, err];
};

export const createPlanNode = async (pid, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/plans/${pid}/nodes`,
      data: data,
    }),
  );
  return [result, err];
};

export const getPlanNodes = async (pid) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/plans/${pid}/nodes`,
    }),
  );
  return [result, err];
};

export const deletePlanNode = async (pid, nodeId) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/plans/${pid}/nodes/${nodeId}`,
    }),
  );
  return [result, err];
};

export const startPlanTask = async (pid) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/plans/${pid}/start`,
    }),
  );
  return [result, err];
};

export const getPlanTaskList = async (pid) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/plans/${pid}/tasks`,
    }),
  );
  return [result, err];
};

export const createPlanConfig = async (pid, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/plans/${pid}/configs`,
      data: data,
    }),
  );
  return [result, err];
};

export const getPlanConfig = async (pid) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/plans/${pid}/configs`,
    }),
  );
  return [result, err];
};

export const getPlanSupportOS = async () => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: '/pixiu/plans/distributions',
    }),
  );
  return [result, err];
};

export const watchPlanTasks = async (pid, signal) => {
  const baseUrl = http({ method: 'watch' });
  const headers = getHeadersWithToken();
  return fetch(`${baseUrl}/pixiu/plans/${pid}/tasks?watch=true`, {
    method: 'get',
    headers: headers,
    signal: signal,
  });
};

export const watchPlanTaskLog = async (pid, name, signal) => {
  const baseUrl = http({ method: 'watch' });
  const headers = getHeadersWithToken();
  return fetch(`${baseUrl}/pixiu/plans/${pid}/tasks/${name}/logs`, {
    method: 'get',
    headers: headers,
    signal: signal,
  });
};

export const planTasksStatus = async (pid) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/plans/${pid}/tasks`,
    }),
  );
  return [result, err];
};
