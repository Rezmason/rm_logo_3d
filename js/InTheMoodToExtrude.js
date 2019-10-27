const makeCurve = (radius = 1, startRadians = 0, endRadians = 2, x = 0, y = 0, z = 0, rX = 0, rY = 0, rZ = 0, distortion = null) => {
  const segments = 20, steps = Math.max(1, Math.round(60 * (radius + 1) * Math.abs(endRadians - startRadians)));
  // const segments = 10, steps = Math.max(1, Math.round(10 * (radius + 1) * Math.abs(endRadians - startRadians)));
  const geom = new THREE.ExtrudeBufferGeometry(
    new THREE.Shape(
      [].concat(...
        Array(4).fill(null).map((_, index) => {
          const a = (index + 0.5) / 4 * 2 * Math.PI;
          return new THREE.Vector2( Math.cos( a ) * Math.SQRT1_2, Math.sin( a ) * Math.SQRT1_2 );
        }).map((p1, index, array) => {
          const p2 = array[(index + 1) % array.length];
          return Array(segments).fill(null).map((_, segIndex) => (new THREE.Vector3()).lerpVectors(p1, p2, segIndex / segments)).concat([p2]);
        })
        )
      ),
    {
      steps,
      bevelEnabled: false,
      extrudePath: new EllipseCurve3D(0,  0, radius, radius, startRadians * Math.PI,  endRadians * Math.PI)
    }
    );

  if (distortion != null) {
    // geom.addAttribute('color', new THREE.BufferAttribute( new Float32Array( geom.attributes.position.count * 3 ), 3 ));
    // const colors = geom.attributes.color;
    const positions = geom.attributes.position;

    const capSize = geom.attributes.position.count / 12 - steps * segments * 2;
    const offsets = [
    0,
    capSize,
    capSize,
    steps * (segments - 1),
    steps * segments,
    steps * segments,
    steps * segments,
    steps
    ];
    const indices = [0];
    for (let i = 1; i < offsets.length; i++) {
      indices[i] = indices[i - 1] + offsets[i] * 6;
    }
    const adjustVertex = (i, step) => {
      const t = step / steps;
      // colors.setXYZ(i, 1, t, 0);
      // colors.setXYZ(i, 1, 1, 1);
      positions.setZ(i, positions.getZ(i) + distortion(t));
    }

    const computeStep = index => {
      let step = Math.floor(index / 6 % steps);
      const fraction = index % 6;
      if (fraction == 2 || fraction == 4 || fraction == 5) step++;
      return step;
    }

    for (let i = indices[0]; i < indices[1]; i++) {
      adjustVertex(i, 0);
    }
    for (let i = indices[1]; i < indices[2]; i++) {
      adjustVertex(i, steps);
    }
    for (let i = indices[2]; i < indices[3]; i++) {
      adjustVertex(i, computeStep(i - indices[2]));
    }
    for (let i = indices[3]; i < indices[4]; i++) {
      adjustVertex(i, computeStep(i - indices[3]));
    }
    for (let i = indices[4]; i < indices[5]; i++) {
      adjustVertex(i, computeStep(i - indices[4]));
    }
    for (let i = indices[5]; i < indices[6]; i++) {
      adjustVertex(i, computeStep(i - indices[5]));
    }
    for (let i = indices[6]; i < indices[7]; i++) {
      adjustVertex(i, computeStep(i - indices[6]));
    }

  }

  geom.computeVertexNormals();

  const matrix = new THREE.Matrix4();
  matrix.makeRotationFromEuler(new THREE.Euler(Math.PI * rX, Math.PI * rY, Math.PI * rZ));
  matrix.setPosition(new THREE.Vector3(x, y, z));
  geom.applyMatrix(matrix);

  return geom;
};

const makeStraight = (length = 1, x = 0, y = 0, z = 0, rX = 0, rY = 0, rZ = 0, distortion = null) => {
  const segments = 1, steps = 1;
  const geom = new THREE.ExtrudeBufferGeometry(
    new THREE.Shape(
      [].concat(...
        Array(4).fill(null).map((_, index) => {
          const a = (index + 0.5) / 4 * 2 * Math.PI;
          return new THREE.Vector2( Math.cos( a ) * Math.SQRT1_2, Math.sin( a ) * Math.SQRT1_2 );
        }).map((p1, index, array) => {
          const p2 = array[(index + 1) % array.length];
          return Array(segments).fill(null).map((_, segIndex) => (new THREE.Vector3()).lerpVectors(p1, p2, segIndex / segments)).concat([p2]);
        })
        )
      ),
    {
      steps,
      bevelEnabled: false,
      extrudePath: new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3(0, 0, length))
    }
    );

  if (distortion != null) {
    // geom.addAttribute('color', new THREE.BufferAttribute( new Float32Array( geom.attributes.position.count * 3 ), 3 ));
    // const colors = geom.attributes.color;
    const positions = geom.attributes.position;

    const capSize = geom.attributes.position.count / 12 - steps * segments * 2;
    const offsets = [
    0,
    capSize,
    capSize,
    steps * (segments - 1),
    steps * segments,
    steps * segments,
    steps * segments,
    steps
    ];
    const indices = [0];
    for (let i = 1; i < offsets.length; i++) {
      indices[i] = indices[i - 1] + offsets[i] * 6;
    }
    const adjustVertex = (i, step) => {
      const t = step / steps;
      // colors.setXYZ(i, 1, t, 0);
      // colors.setXYZ(i, 1, 1, 1);
      positions.setX(i, positions.getX(i) + distortion(t));
    }

    const computeStep = index => {
      let step = Math.floor(index / 6 % steps);
      const fraction = index % 6;
      if (fraction == 2 || fraction == 4 || fraction == 5) step++;
      return step;
    }

    for (let i = indices[0]; i < indices[1]; i++) {
      adjustVertex(i, 0);
    }
    for (let i = indices[1]; i < indices[2]; i++) {
      adjustVertex(i, steps);
    }
    for (let i = indices[2]; i < indices[3]; i++) {
      adjustVertex(i, computeStep(i - indices[2]));
    }
    for (let i = indices[3]; i < indices[4]; i++) {
      adjustVertex(i, computeStep(i - indices[3]));
    }
    for (let i = indices[4]; i < indices[5]; i++) {
      adjustVertex(i, computeStep(i - indices[4]));
    }
    for (let i = indices[5]; i < indices[6]; i++) {
      adjustVertex(i, computeStep(i - indices[5]));
    }
    for (let i = indices[6]; i < indices[7]; i++) {
      adjustVertex(i, computeStep(i - indices[6]));
    }

  }

  geom.computeVertexNormals();

  const matrix = new THREE.Matrix4();
  matrix.makeRotationFromEuler(new THREE.Euler(Math.PI * rX, Math.PI * rY, Math.PI * rZ));
  matrix.setPosition(new THREE.Vector3(x, y, z));
  geom.applyMatrix(matrix);

  return geom;
};
