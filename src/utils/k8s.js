const makeObjectMetadata = (data) => {
  let metadata = {
    name: data.name,
    namespace: data.namespace,
  };

  if (data.enableMetadata) {
    if (data.labels.length !== 0) {
      let newLabels = {};
      for (let l of data.labels) {
        newLabels[l.key] = l.value;
      }
      metadata['labels'] = newLabels;
    }
    if (data.annotations.length !== 0) {
      let newAnnotations = {};
      for (let a of data.annotations) {
        newAnnotations[a.key] = a.value;
      }
      metadata['annotations'] = newAnnotations;
    }
  }
  return metadata;
};
export { makeObjectMetadata };

const makePodTemplate = (data) => {
  let tplSpec = {
    restartPolicy: data.restartPolicy,
  };

  if (data.choiceNode) {
    let nodeSelects = {};
    for (let nodeSelectLabel of data.nodeSelectLabels) {
      nodeSelects[nodeSelectLabel.key] = nodeSelectLabel.value;
    }
    tplSpec['nodeSelector'] = nodeSelects;
  }

  if (data.hostNetwork) {
    tplSpec['hostNetwork'] = true;
  }

  let uniqVolumes = {};
  for (let fc of data.containers) {
    if (fc.choiceStorage) {
      for (let s of fc.storages) {
        if (s.name in uniqVolumes) {
          continue;
        }
        uniqVolumes[s.name] = s;
      }
    }
  }
  let newVolumes = [];
  for (let key in uniqVolumes) {
    let v = uniqVolumes[key];
    if (v.volumeType === '临时卷') {
      newVolumes.push({
        name: v.name,
        emptyDir: {
          medium: 'Memory',
        },
      });
    }
    if (v.volumeType === '持久卷') {
      newVolumes.push({
        name: v.name,
        persistentVolumeClaim: {
          claimName: v.mountSrc,
        },
      });
    }
    if (v.volumeType === 'HostPath卷') {
      newVolumes.push({
        name: v.name,
        hostPath: {
          path: v.mountSrc,
          type: 'FileOrCreate',
        },
      });
    }
    if (v.volumeType === '配置字典') {
      newVolumes.push({
        name: v.name,
        configMap: {
          defaultMode: 420,
          name: v.mountSrc,
        },
      });
    }
    if (v.volumeType === '保密字典') {
      newVolumes.push({
        name: v.name,
        secret: {
          defaultMode: 420,
          secretName: v.mountSrc,
        },
      });
    }
  }
  if (newVolumes.length !== 0) {
    tplSpec['volumes'] = newVolumes;
  }

  // 追加容器属性
  let targetContainers = [];
  for (let fc of data.containers) {
    let targetContainer = {
      name: fc.name,
      image: fc.image,
      imagePullPolicy: fc.imagePullPolicy,
    };
    // 启用容器高级选项
    if (fc.advance) {
      // 资源设置
      if (
        fc.cpuRequst !== '' ||
        fc.cpuLimit !== '' ||
        fc.memoryRequst !== '' ||
        fc.memoryLimit !== ''
      ) {
        let resources = {};
        if (fc.cpuLimit !== '' || fc.memoryLimit !== '') {
          resources['limits'] = {};
          if (fc.cpuLimit !== '') {
            resources['limits']['cpu'] = fc.cpuLimit;
          }
          if (fc.memoryLimit !== '') {
            resources['limits']['memory'] = fc.memoryLimit;
          }
        }

        if (fc.cpuRequst !== '' || fc.memoryRequst !== '') {
          resources['requests'] = {};
          if (fc.cpuRequst !== '') {
            resources['requests']['cpu'] = fc.cpuRequst;
          }
          if (fc.memoryRequst !== '') {
            resources['requests']['memory'] = fc.memoryRequst;
          }
        }
        targetContainer['resources'] = resources;
      }

      // 健康检查设置
      if (fc.choiceHealth) {
        // 存活检查
        if (fc.healths.liveness.enable) {
          let livenessProbe = {
            initialDelaySeconds: fc.healths.liveness.initialDelaySeconds,
            timeoutSeconds: fc.healths.liveness.timeoutSeconds,
            periodSeconds: fc.healths.liveness.periodSeconds,
            successThreshold: fc.healths.liveness.successThreshold,
            failureThreshold: fc.healths.liveness.failureThreshold,
          };

          // HTTP 请求
          if (fc.healths.liveness.checkType === 1) {
            livenessProbe['httpGet'] = {
              path: fc.healths.liveness.httpGet.path,
              port: parseInt(fc.healths.liveness.httpGet.port),
              scheme: fc.healths.liveness.httpGet.scheme,
            };
          }
          // 命令
          if (fc.healths.liveness.checkType === 2) {
            livenessProbe['exec'] = {
              command: fc.healths.liveness.cmd.split(','),
            };
          }
          // TCP 端口
          if (fc.healths.liveness.checkType === 3) {
            livenessProbe['tcpSocket'] = {
              port: parseInt(fc.healths.liveness.port),
            };
          }
          targetContainer['livenessProbe'] = livenessProbe;
        }
        // 就绪检查
        if (fc.healths.readiness.enable) {
          let readinessProbe = {
            initialDelaySeconds: fc.healths.readiness.initialDelaySeconds,
            timeoutSeconds: fc.healths.readiness.timeoutSeconds,
            periodSeconds: fc.healths.readiness.periodSeconds,
            successThreshold: fc.healths.readiness.successThreshold,
            failureThreshold: fc.healths.readiness.failureThreshold,
          };
          // HTTP 请求
          if (fc.healths.readiness.checkType === 1) {
            readinessProbe['httpGet'] = {
              path: fc.healths.readiness.httpGet.path,
              port: parseInt(fc.healths.readiness.httpGet.port),
              scheme: fc.healths.readiness.httpGet.scheme,
            };
          }
          // 命令
          if (fc.healths.readiness.checkType === 2) {
            readinessProbe['exec'] = {
              command: fc.healths.readiness.cmd.split(','),
            };
          }
          // TCP 端口
          if (fc.healths.readiness.checkType === 3) {
            readinessProbe['tcpSocket'] = {
              port: parseInt(fc.healths.readiness.port),
            };
          }
          targetContainer['readinessProbe'] = readinessProbe;
        }
        // 启动检查
        if (fc.healths.startup.enable) {
          let startupProbe = {
            initialDelaySeconds: fc.healths.startup.initialDelaySeconds,
            timeoutSeconds: fc.healths.startup.timeoutSeconds,
            periodSeconds: fc.healths.startup.periodSeconds,
            successThreshold: fc.healths.startup.successThreshold,
            failureThreshold: fc.healths.startup.failureThreshold,
          };
          // HTTP 请求
          if (fc.healths.startup.checkType === 1) {
            startupProbe['httpGet'] = {
              path: fc.healths.startup.httpGet.path,
              port: parseInt(fc.healths.startup.httpGet.port),
              scheme: fc.healths.startup.httpGet.scheme,
            };
          }
          // 命令
          if (fc.healths.startup.checkType === 2) {
            startupProbe['exec'] = {
              command: fc.healths.startup.cmd.split(','),
            };
          }
          // TCP 端口
          if (fc.healths.startup.checkType === 3) {
            startupProbe['tcpSocket'] = {
              port: parseInt(fc.healths.startup.port),
            };
          }

          targetContainer['startupProbe'] = startupProbe;
        }
      }

      if (fc.choicePort) {
        let pps = [];
        for (let p of fc.ports) {
          pps.push({
            name: p.name,
            protocol: p.protocol,
            containerPort: parseInt(p.containerPort),
          });
        }
        targetContainer['ports'] = pps;
      }

      if (fc.choiceEnv) {
        let es = [];
        for (let e of fc.envs) {
          es.push({ name: e.key, value: e.value });
        }
        targetContainer['env'] = es;
      }
      if (fc.choiceCmd) {
        if (fc.cmds.cmd !== '') {
          targetContainer['command'] = fc.cmds.cmd.split(',');
        }
        if (fc.cmds.args !== '') {
          targetContainer['args'] = fc.cmds.args.split(',');
        }
      }

      if (fc.choiceStorage) {
        if (fc.storages.length !== 0) {
          let volumeMounts = [];
          for (let s of fc.storages) {
            volumeMounts.push({
              name: s.name,
              mountPath: s.mountPath,
            });
          }
          if (volumeMounts.length !== 0) {
            targetContainer['volumeMounts'] = volumeMounts;
          }
        }
      }
    }
    targetContainers.push(targetContainer);
  }
  tplSpec['containers'] = targetContainers;

  return tplSpec;
};
export { makePodTemplate };
