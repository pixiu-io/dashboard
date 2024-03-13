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

const formatterPodStatus2 = (row, column, status) => {
  let s = <span class="color-green-word">Running</span>;
  if (status.phase === 'Running') {
    status.conditions.forEach((item) => {
      if (item.status !== 'True') {
        let res = '';
        status.containerStatuses.forEach((c) => {
          if (!c.ready) {
            if (c.state.waiting) {
              res = (
                <div>
                  <div>{c.state.waiting.reason}</div>
                </div>
              );
            }
            if (c.state.terminated) {
              res = (
                <div>
                  <div>{c.state.waiting.reason}</div>
                  <div style="font-size: 11px">{c.state.terminated.reason}</div>
                </div>
              );
            }
          }
        });
        return (s = <span>{res}</span>);
      }
    });
  } else if (status.phase === 'Succeeded') {
    let res = '';
    status.containerStatuses.forEach((c) => {
      if (!c.ready) {
        if (c.state.terminated) {
          res = (
            <div>
              <div>{c.state.waiting.reason}</div>
              <div style="font-size: 11px">{c.state.waiting.message}</div>
              <div style="font-size: 11px">{c.state.terminated.reason}</div>
            </div>
          );
        }
      }
    });
    return (s = <span style="color: #E6A23C">${res}</span>);
  } else {
    let res = status.phase;
    status.containerStatuses.forEach((c) => {
      if (!c.ready) {
        if (c.state.waiting) {
          res = (
            <div>
              <div>{c.state.waiting.reason}</div>
              <div style="font-size: 11px">{c.state.waiting.message}</div>
            </div>
          );
        }
        if (c.state.terminated) {
          res = (
            <div>
              <div>{c.state.waiting.reason}</div>
              <div style="font-size: 11px">{c.state.waiting.message}</div>
              <div style="font-size: 10px">{c.state.terminated.reason}</div>
            </div>
          );
        }
      }
    });
    return (s = <div style="color: red">{res}</div>);
  }
  return s;
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