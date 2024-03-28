import { formatTimestamp } from '@/utils/utils';

const formatterTime = (row, column, cellValue) => {
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
    <div style="display: flex">
      <div>
        <pixiu-icon name="icon-circle-dot" size="12px" type="iconfont" color={color} />
      </div>
      <div style="margin-left: 6px"> {status}</div>
    </div>
  );
};

const formatterPodStatus = (row, column, cellValue) => {
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
        return formatterIcon('#0000FF', waiting.reason);
      }
    }
    return formatterIcon('#FFFF00', phase);
  }

  if (phase == 'Running') {
    const containerStatuses = cellValue.containerStatuses;
    for (let i = 0; i < containerStatuses.length; i++) {
      if (containerStatuses[i].ready) {
        continue;
      }
      const waiting = containerStatuses[i].state.waiting;
      if (waiting) {
        return formatterIcon('#FFA500', waiting.reason);
      }
    }
    return formatterIcon('#28C65A', phase);
  }

  return formatterIcon('#28C65A', phase);
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

  return (
    <el-tooltip effect="light" placement="top" content={displayContent.toString()} raw-content>
      <div>
        {images.map((image) => (
          <el-tag round>
            <div style="display: flex">
              <pixiu-icon name="icon-docker" size="16px" type="iconfont" color="#409EFF" />
              <div style="margin-left: 6px"> {image}</div>
            </div>
          </el-tag>
        ))}
      </div>
    </el-tooltip>
  );
};
export { formatterImage };

const formatterLabelsBackup = (row, column, cellValue) => {
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
          <div class="pixiu-ellipsis-style">{label}</div>
        ))}
      </div>
    </el-tooltip>
  );
};
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

const runningFormatter = (row, column, cellValue) => {
  const status = '运行中';
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

const runningStatus = {
  运行中: {
    name: 'icon-circle-dot',
    color: '#28C65A', // 绿色
  },
  集群异常: {
    name: 'icon-yichang',
    color: '#FF0000', // 红色
  },
  构建中: {
    icon: 'icon-dlf-shujuhugoujian',
    color: '#0000FF', // 蓝色
  },
  删除中: {
    icon: 'icon-shanchu',
    color: '#FF00FF', // 牡丹红
  },
  等待构建: {
    icon: 'icon-icon-',
    color: '#FFFF00', // 黄色
  },
};
