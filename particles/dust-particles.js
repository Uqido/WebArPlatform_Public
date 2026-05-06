AFRAME.registerComponent("dust-particles", {
  init: function () {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 500; i++) {
      vertices.push(
        (Math.random() - 0.5) * 2,
        Math.random() * 2,
        (Math.random() - 0.5) * 2,
      );
    }
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );

    const material = new THREE.PointsMaterial({
      color: 0xff8c00,
      size: 0.02,
      transparent: true,
      opacity: 0.5,
    });

    const particles = new THREE.Points(geometry, material);
    this.el.setObject3D("particle-mesh", particles);
  },
  tick: function (time, timeDelta) {
    const mesh = this.el.getObject3D("particle-mesh");
    if (mesh) {
      mesh.rotation.y += 0.001;
      mesh.position.y += 0.0005;
      if (mesh.position.y > 1) mesh.position.y = 0;
    }
  },
});
