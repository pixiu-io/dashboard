import { formatTimestamp } from '@/utils/utils';

const formatterTime = (row, column, cellValue) => {
  if (cellValue === '' || cellValue === undefined) {
    return '';
  }
  const time = formatTimestamp(cellValue);
  return (
    <el-tooltip effect="light" placement="top" content={time}>
      <div class="pixiu-ellipsis-style">{time}</div>
    </el-tooltip>
  );
};
export { formatterTime };

const formatterIcon = (color, status) => {
  return (
    <div style="display: flex; align-items: center;">
      <pixiu-icon name="icon-circle-dot" size="12px" type="iconfont" color={color} />
      <div style="margin-left: 6px"> {status}</div>
    </div>
  );
};
export { formatterIcon };

const getContainerStatuses = (data, pending) => {
  let containers = [...(data.initContainerStatuses || []), ...(data.containerStatuses || [])];
  containers = containers.filter((s) => !s.ready);
  const waiting = containers.find((s) => s.state.waiting);
  const terminated = containers.find((s) => s.state.terminated);

  if (pending) {
    const init = (data.initContainerStatuses || []).filter((s) => s.ready).length;
    if (init === (data.initContainerStatuses || []).length) {
      return containers.length === 0
        ? 'Pending'
        : waiting
        ? waiting.state.waiting.reason
        : terminated
        ? terminated.state.terminated.reason
        : 'Pending';
    }
    return `Init:${init}/${data.initContainerStatuses ? data.initContainerStatuses.length : 0}`;
  }

  return containers.length === 0
    ? 'unknown'
    : waiting
    ? waiting.state.waiting.reason
    : terminated
    ? terminated.state.terminated.reason
    : 'unknown';
};

const formatterPodStatus = (row, column, cellValue) => {
  if (row.metadata.deletionTimestamp) {
    return formatterIcon('#c62828', 'Terminating');
  }
  let phase = cellValue.phase;
  switch (phase) {
    case 'Failed':
      if (cellValue.reason) {
        return formatterIcon('#c62828', cellValue.reason);
      }
      return formatterIcon('#c62828', getContainerStatuses(cellValue, false));
    case 'Pending':
      return formatterIcon('#f3d362', getContainerStatuses(cellValue, true));
    case 'Succeeded':
      return formatterIcon('#155ec0', getContainerStatuses(cellValue, false));
    case 'Running':
      if ((cellValue.conditions.filter((s) => s.status !== 'True') || []).length > 0) {
        return formatterIcon('#c62828', getContainerStatuses(cellValue, true));
      }
      return formatterIcon('#2ba552', phase);
    default:
      return formatterIcon('#c62828', phase);
  }
};
export { formatterPodStatus };

const formatterPodStatusBackup = (row, column, cellValue) => {
  let phase = cellValue.phase;
  if (phase == 'Failed') {
    phase = cellValue.reason;
  } else if (phase == 'Pending') {
    const containerStatuses = cellValue.containerStatuses;
    for (let i = 0; i < containerStatuses.length; i++) {
      if (containerStatuses[i].ready) {
        continue;
      }
      const waiting = containerStatuses[i].state.waiting;
      if (waiting) {
        return (
          <el-tooltip effect="light" placement="top" content={waiting.message}>
            <div class="pixiu-ellipsis-style">{phase}</div>
          </el-tooltip>
        );
      }
    }
    return <div class="color-yellow-word">{phase}</div>;
  }

  if (phase == 'Running') {
    const containerStatuses = cellValue.containerStatuses;
    for (let i = 0; i < containerStatuses.length; i++) {
      if (containerStatuses[i].ready) {
        continue;
      }
      const waiting = containerStatuses[i].state.waiting;
      if (waiting) {
        return (
          <el-tooltip effect="light" placement="top" content={waiting.message}>
            <div class="pixiu-ellipsis-style" style="color: #e6a23c;">
              {waiting.reason}
            </div>
          </el-tooltip>
        );
      }
    }

    return <div class="color-green-word">{phase}</div>;
  }
  return <div>{phase}</div>;
};

const formatterImage = (row, column, cellValue) => {
  let images = [];
  for (let item of cellValue) {
    images.push(item.image);
  }

  const displayContent = `
    <div>
      ${images.map((image) => `<div class="pixiu-table-formatter">${image}</div>`).join('')}
    </div>
  `;
  // 背景色：#d9ecff
  return (
    <el-tooltip effect="light" placement="top" content={displayContent.toString()} raw-content>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        {images.map((image) => (
          <div style="width:100%;background-color:#d9ecff;border-color:#d9ecff;border-radius:9999px">
            <div style="display:flex;align-items:center;padding: 0 10px">
              <pixiu-icon name="icon-docker" size="16px" type="iconfont" color="#409EFF" />
              <div style="margin-left: 6px; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;color:#409eff;font-size:12px">
                {image}
              </div>
            </div>
          </div>
        ))}
      </div>
    </el-tooltip>
  );
};
export { formatterImage };

const formatterLabelsBackup = (row, column, cellValue) => {
  if (!cellValue) {
    return <div>-</div>;
  }

  const labels = Object.entries(cellValue).map(([key, value]) => {
    return `${key}: ${value}`;
  });

  let labels1 = labels;
  if (labels1.length > 2) {
    labels1 = labels1.slice(0, 2);
    labels1.push('...');
  }

  const displayContent = `
    <div>
      ${labels.map((label) => `<div class="pixiu-table-formatter">${label}</div>`).join('')}
    </div>
  `;

  return (
    <el-tooltip effect="light" placement="top" content={displayContent.toString()} raw-content>
      <div>
        {labels1.map((label) => (
          <div class="pixiu-ellipsis-style">{label}</div>
        ))}
      </div>
    </el-tooltip>
  );
};

const formatterLabelsBackup2 = (row, column, cellValue) => {
  if (!cellValue) return <div>-</div>;
  const labels = Object.entries(cellValue).map(([key, value]) => {
    return `${key}: ${value}`;
  });

  let labels1 = labels;
  if (labels1.length > 2) {
    labels1 = labels1.slice(0, 2);
    labels1.push('...');
  }

  const displayContent = `
    <div>
      ${labels.map((label) => `<div class="pixiu-table-formatter">${label}</div>`).join('')}
    </div>
  `;

  return (
    <el-tooltip effect="light" placement="top" content={displayContent.toString()} raw-content>
      <div>
        {labels1.map((label) => (
          <el-tag round>
            <div class="pixiu-ellipsis-style">{label}</div>
          </el-tag>
        ))}
      </div>
    </el-tooltip>
  );
};
export { formatterLabelsBackup2 };

const formatterLabels = (row, column, cellValue) => {
  if (!cellValue) return <div>-</div>;
  const labels = Object.entries(cellValue).map(([key, value]) => {
    return `${key}: ${value}`;
  });
  const selectors = Object.entries(cellValue).map(([key, value]) => {
    return `${key}: ${value}`;
  });

  const displayContent = `
    <div>
      ${labels.map((label) => `<div class="pixiu-table-formatter">${label}</div>`).join('')}
    </div>
  `;
  const sc = selectors.join(',');

  return (
    <el-tooltip effect="light" placement="top" content={displayContent.toString()} raw-content>
      <div class="hidden-style">{sc}</div>
    </el-tooltip>
  );
};
export { formatterLabels };

const formatterRestartCount = (row, column, status) => {
  let count = 0;
  if (status.containerStatuses === undefined) {
    return <div>-</div>;
  }
  status.containerStatuses.forEach((item) => {
    count += item.restartCount;
  });
  return <div>{count} 次</div>;
};
export { formatterRestartCount };

const formatterReady = (row, column, cellValue) => {
  let availableReplicas = cellValue.availableReplicas;
  if (availableReplicas === undefined) {
    availableReplicas = 0;
  }
  return (
    <div>
      {availableReplicas}/{row.spec.replicas}
    </div>
  );
};
export { formatterReady };

const formatString = (row, column, cellValue) => {
  return (
    <el-tooltip effect="light" placement="top" content={cellValue}>
      <div class="hidden-style">{cellValue}</div>
    </el-tooltip>
  );
};

export { formatString };

const formatterAddress = (row, column, cellValue) => {
  if (
    cellValue === undefined ||
    cellValue.loadBalancer === undefined ||
    cellValue.loadBalancer.ingress === undefined ||
    cellValue.loadBalancer.ingress.length === 0
  ) {
    return <div class="pixiu-table-formatter">-</div>;
  }

  const ingress = cellValue.loadBalancer.ingress;
  return (
    <div>
      {ingress.map((ing) => (
        <div class="pixiu-table-formatter">{ing}</div>
      ))}
    </div>
  );
};
export { formatterAddress };

const formatterIngressRules = (row, column, cellValue) => {
  let ingress = [];
  for (let item of cellValue) {
    const host = item.host;
    for (let path of item.http.paths) {
      const ingressPath = path.path;
      const name = path.backend.service.name;
      const port = path.backend.service.port.number;
      if (ingressPath === undefined || ingressPath === '/') {
        ingress.push(`${host} -> ${name}:${port}`);
      } else {
        ingress.push(`${host}${ingressPath} -> ${name}:${port}`);
      }
    }
  }

  const displayContent = `
  <div>
    ${ingress.map((ing) => `<div class="pixiu-table-formatter">${ing}</div>`).join('')}
  </div>
`;

  return (
    <el-tooltip effect="light" placement="top" content={displayContent.toString()} raw-content>
      <div>
        {ingress.map((ing) => (
          <div class="pixiu-ellipsis-style">{ing}</div>
        ))}
      </div>
    </el-tooltip>
  );
};
export { formatterIngressRules };

const formatterPorts = (row, column, cellValue) => {
  let ports = [];
  for (let item of cellValue) {
    ports.push(`${item.port}/${item.protocol}`);
  }

  return formatString(row, column, ports.join(','));
};

export { formatterPorts };

const formatterNamespace = (row, column, cellValue) => {
  return (
    <el-tag type="primary" round>
      {cellValue}
    </el-tag>
  );
};
export { formatterNamespace };

const formatterNodeStatus = (row, column, cellValue) => {
  let status = '已停止';
  for (let condition of cellValue.conditions) {
    if (condition.type === "Ready") {
      if (condition.status === "True") {
        status = "运行中"
        break
      }
    }
  }
  if (status === "运行中") {
    if (row.spec.unschedulable) {
      status = "禁止调度"
    }
  }

  return parseStatus(status)
}
export { formatterNodeStatus };

const runningFormatter = (row, column, cellValue) => {
  let status = '运行中';
  let availableReplicas = cellValue.availableReplicas;
  if (availableReplicas === undefined) {
    availableReplicas = 0;
  }
  let replicas = row.spec.replicas

  if (availableReplicas !== replicas) {
    status = "更新中"
  } else {
    if (replicas === 0 && availableReplicas === 0) {
      status = "已停止"
    }
  }

  return (
    <div style="display: flex">
      <div>
        <pixiu-icon
          name={runningStatus[status].name}
          size="12px"
          type="iconfont"
          color={runningStatus[status].color}
        />
      </div>
      <div style="margin-left: 6px"> {status}</div>
    </div>
  );
};
export { runningFormatter };

const formatNodeRole = (row, column, cellValue) => {
  let roles = [];
  let ls = JSON.parse(JSON.stringify(cellValue.labels));
  for (let [label, v] of Object.entries(ls)) {
    if (label.indexOf('node-role.kubernetes.io') !== -1) {
      let parts = label.split('/');
      roles.push(parts[1]);
    }
  }

  return formatString('', '', roles.toString());
};
export { formatNodeRole };

const formatNodeIp = (row, column, cellValue) => {
  let address = '';
  for (let i of cellValue.addresses) {
    if (i.type === 'InternalIP') {
      address = i.address;
      break;
    }
  }
  return (
    <el-tooltip effect="light" placement="top" content={address} raw-content>
      <div>
        <div class="pixiu-ellipsis-style">{address}</div>
      </div>
    </el-tooltip>
  );
};
export { formatNodeIp };

const formatterContainersCPU = (row, column, cellValue) => {
  let result = [];
  for (let container of cellValue) {
    let req = '-';
    let limit = '-';
    const resources = container.resources;
    if (resources.requests !== undefined && resources.requests.cpu !== undefined) {
      req = resources.requests.cpu;
    }
    if (resources.limits !== undefined && resources.limits.cpu !== undefined) {
      limit = resources.limits.cpu;
    }
    result.push({ request: req, limit: limit });
  }

  return (
    <div>
      {result.map((item) => (
        <div style="display: block">
          <div>{item.request}</div>
          <div>{item.limit}</div>
        </div>
      ))}
    </div>
  );
};
export { formatterContainersCPU };

const formatterContainersMem = (row, column, cellValue) => {
  let result = [];
  for (let container of cellValue) {
    let req = '-';
    let limit = '-';
    const resources = container.resources;
    if (resources.requests !== undefined && resources.requests.memory !== undefined) {
      req = resources.requests.memory;
    }
    if (resources.limits !== undefined && resources.limits.memory !== undefined) {
      limit = resources.limits.memory;
    }
    result.push({ request: req, limit: limit });
  }

  return (
    <div>
      {result.map((item) => (
        <div style="display: block">
          <div>{item.request}</div>
          <div>{item.limit}</div>
        </div>
      ))}
    </div>
  );
};
export { formatterContainersMem };

const formatterContainersResource = (row, column, cellValue) => {
  let result = [];
  for (let container of cellValue) {
    let cpuReq = '无限制';
    let cpuLimit = '无限制';
    let memReq = '无限制';
    let memLimit = '无限制';
    const resources = container.resources;
    if (resources.requests !== undefined && resources.requests.cpu !== undefined) {
      cpuReq = resources.requests.cpu;
    }
    if (resources.limits !== undefined && resources.limits.cpu !== undefined) {
      cpuLimit = resources.limits.cpu;
    }
    if (resources.requests !== undefined && resources.requests.memory !== undefined) {
      memReq = resources.requests.memory;
    }
    if (resources.limits !== undefined && resources.limits.memory !== undefined) {
      memLimit = resources.limits.memory;
    }

    result.push({ cpuRequest: cpuReq, cpuLimit: cpuLimit, memRequest: memReq, memLimit: memLimit });
  }

  return (
    <div>
      {result.map((item) => (
        <div style="display: block">
          <div>
            CPU: {item.cpuRequest}/{item.cpuLimit}
          </div>
          <div>
            内存: {item.memRequest}/{item.memLimit}
          </div>
        </div>
      ))}
    </div>
  );
};
export { formatterContainersResource };

const formatterContainerImage = (row, column, cellValue) => {
  let images = [cellValue];
  const displayContent = `
    <div>
      ${images.map((image) => `<div class="pixiu-table-formatter">${image}</div>`).join('')}
    </div>
  `;
  return (
    <el-tooltip effect="light" placement="top" content={displayContent.toString()} raw-content>
      <div>
        <el-tag round>
          <div style="display: flex">
            <pixiu-icon name="icon-docker" size="16px" type="iconfont" color="#409EFF" />
            <div style="margin-left: 6px"> {cellValue}</div>
          </div>
        </el-tag>
      </div>
    </el-tooltip>
  );
};

export { formatterContainerImage };

const runningStatus = {
  运行中: {
    name: 'icon-circle-dot',
    color: '#28C65A', // 绿色
  },
  更新中: {
    name: 'icon-circle-dot',
    color: '#E0992C', // 黄色
  },
  已停止: {
    name: 'icon-circle-dot',
    color: '#86929D', // 黑色
  },
  已完成: {
    name: 'icon-circle-dot',
    color: '#808080', // 灰色
  },
  已暂停: {
    name: 'icon-circle-dot',
    color: '#808080', // 灰色
  },
  禁止调度: {
    name: 'icon-circle-dot',
    color: '#E0992C', // 黄色
  },
  未执行: {
    name: 'icon-circle-dot',
    color: '#E0992C', // 黄色
  },
};

const formatterNodeAuthType = (row, column, cellValue) => {
  let p = '免密';
  if (cellValue.type === 'key') {
    p = '密钥';
  }
  if (cellValue.type === 'password') {
    p = '密码';
  }
  return p;
};
export { formatterNodeAuthType };

const formatterNodeRole = (row, column, cellValue) => {
  return cellValue.join(',');
};
export { formatterNodeRole };

const formatterPlanStatus = (row, column, cellValue) => {
  return (
    <div>
      <div style="font-size: 12px; color: #29292b"> {cellValue}</div>
    </div>
  );
};
export { formatterPlanStatus };

const formatterAuditStatus = (row, column, cellValue) => {
  if (cellValue === 0) {
    return (
      <div>
        <el-tag type="danger">失败</el-tag>
      </div>
    );
  }
  if (cellValue === 1) {
    return (
      <div>
        <el-tag>成功</el-tag>
      </div>
    );
  }

  return (
    <div>
      <el-tag>状态异常</el-tag>
    </div>
  );
};
export { formatterAuditStatus };

const formatterClusterNode = (row, column, cellValue) => {
  const ready = cellValue.ready.length;
  const notReady = cellValue.not_ready.length;
  const total = ready + notReady;

  if (notReady === 0) {
    return (
      <div class="pixiu-table-formatter">
        <el-space>
          <div>
            {total} 台 (<span class="color-green-word">全部正常</span>)
          </div>
        </el-space>
      </div>
    );
  }
  return (
    <div class="pixiu-table-formatter">
      <el-space>
        <div>
          {total} 台 (<span class="color-green-word">正常 {ready} 台, </span>
          <span class="color-red-word">异常 {notReady} 台</span>)
        </div>
      </el-space>
    </div>
  );
};
export { formatterClusterNode };

const formatterJobStatus = (row, column, cellValue) => {
  if (!cellValue.conditions) {
    if (cellValue.startTime) {
      return parseStatus("运行中")
    }
    return parseStatus("未执行")
  }

  let status = '运行中';
  for (let condition of cellValue.conditions) {
    if (condition.type === "Complete") {
      if (condition.status === "True") {
        status = "已完成"
        }
      }
  }

  return parseStatus(status)
};
export { formatterJobStatus };

const formatterCronJobStatus = (row, column, cellValue) => {
  let status = '运行中';
  if (cellValue.suspend === true) {
    status = "已暂停"
  }

  return parseStatus(status)
};
export { formatterCronJobStatus };

const parseStatus = (s) => {
  return (
    <div style="display: flex">
      <div>
        <pixiu-icon
          name={runningStatus[s].name}
          size="12px"
          type="iconfont"
          color={runningStatus[s].color}
        />
      </div>
      <div style="margin-left: 6px"> {s}</div>
    </div>
  );
}

const formatterJobDuration = (row, column, cellValue) => {
  // 未开始
  if (!cellValue.startTime) {
    return ""
  }
  // 已开始但未结束
  if (!cellValue.completionTime) {
    // todo
    return "-"
  }

  return calculateTimeDuration(cellValue.startTime, cellValue.completionTime)
}
export { formatterJobDuration };


// 计算时间，直接得出最后的值，
// 5s => 5秒
// 65s => 1分5秒
const calculateTimeDuration = (startTime, endTime) => {
  const start = new Date(startTime)
  const end = new Date(endTime)

  const duration = end - start
  var seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  let result = []
  if (hours !== 0) {
      result.push(hours + "时")
  }
  if (minutes !== 0) {
      result.push(minutes + "分")
  }
  if (seconds !== 0) {
      result.push(seconds + "秒")
  }

  return result.join(" ")
}
