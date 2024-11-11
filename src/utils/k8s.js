const makeObjectMetadata = (data) => {
  if (data.enableMetadata) {
    if (data.labels.length !== 0) {
      let newLabels = {};
      for (let l of data.labels) {
        newLabels[l.key] = l.value;
      }
    }
    if (data.annotations.length !== 0) {
      let newAnnotations = {};
      for (let a of data.annotations) {
        newAnnotations[a.key] = a.value;
      }
    }

    return newLabels, newAnnotations;
  }
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
      newVolumes.push({});
    }
    if (v.volumeType === 'HostPath卷') {
      newVolumes.push({});
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
  tplSpec['volumes'] = newVolumes;

  let targetContainers = [];
  for (let fc of data.containers) {
    let targetContainer = {
      name: fc.name,
      image: fc.image,
      imagePullPolicy: fc.imagePullPolicy,
    };
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
          let volumes = [];
          let volumeMounts = [];

          for (let s of fc.storages) {
          }

          targetContainer['volumeMounts'] = volumeMounts;
        }
      }

      targetContainers.push(targetContainer);
    }
    tplSpec['containers'] = targetContainers;
  }
  return tplSpec;
};
export { makePodTemplate };
