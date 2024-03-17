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
export { formatterPodStatus };

const formatterImage = (row, column, cellValue) => {
  return (
    <div>
      {cellValue.map((item) => (
        <div>{item.image}</div>
      ))}
    </div>
  );
};
export { formatterImage };

const formatterLabels = (row, column, cellValue) => {
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
