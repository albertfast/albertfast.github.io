/* ============================================================
   ORVLI — Floating 3D objects (dark theme)
   Real, solid geometry drifting in the deep-space background.
   Neon-edged glass, emissive wireframes, dark metal — they match
   the cyan/violet/pink accents of the site. No starfield: these
   are objects with mass and edges, slowly turning in the void.
   ============================================================ */
import * as THREE from 'three';

(function () {
  'use strict';

  const mount = document.getElementById('orvli-canvas');
  if (!mount) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const isMobile = window.innerWidth < 720;

  // ---------------- Renderer ----------------
  const renderer = new THREE.WebGLRenderer({
    antialias: !isMobile,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  mount.appendChild(renderer.domElement);

  // ---------------- Scene & camera ----------------
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070d, 0.022);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 12);

  // ---------------- Procedural environment (dark, neon-lit) ----------------
  const pmrem = new THREE.PMREMGenerator(renderer);
  function buildEnv() {
    const s = new THREE.Scene();
    s.background = new THREE.Color(0x05070d);
    // Neon "light cards" the glass can refract — site's accent colors.
    const cards = [
      { c: 0x7af0ff, x: 6, y: 5, z: -8, w: 12, h: 12 },
      { c: 0x8b7bff, x: -8, y: 3, z: -6, w: 10, h: 14 },
      { c: 0xff7ad9, x: 0, y: -6, z: 4, w: 14, h: 6 },
    ];
    cards.forEach(cd => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(cd.w, cd.h),
        new THREE.MeshBasicMaterial({ color: cd.c })
      );
      m.position.set(cd.x, cd.y, cd.z);
      if (cd.z > 0) m.rotation.x = Math.PI / 2;
      s.add(m);
    });
    return pmrem.fromScene(s, 0.04).texture;
  }
  const envMap = buildEnv();
  scene.environment = envMap;

  // ---------------- Lighting ----------------
  scene.add(new THREE.AmbientLight(0xffffff, 0.18));
  const key = new THREE.DirectionalLight(0x7af0ff, 1.3);
  key.position.set(6, 8, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff7ad9, 0.9);
  rim.position.set(-8, 2, -5);
  scene.add(rim);
  const fill = new THREE.PointLight(0x8b7bff, 1.2, 30);
  fill.position.set(0, 0, 5);
  scene.add(fill);

  // ---------------- Materials ----------------
  // Desktop uses real transmission glass (heavy but gorgeous). On mobile we
  // fall back to a much cheaper transparent standard material that still
  // reads as glowing crystal — transmission render passes are too costly
  // for many phones and can fail to appear at all on iOS Safari.
  let glassMat;
  if (isMobile) {
    glassMat = new THREE.MeshStandardMaterial({
      color: 0x9aa6ff,
      metalness: 0.3,
      roughness: 0.15,
      transparent: true,
      opacity: 0.32,
      envMapIntensity: 1.6,
      emissive: new THREE.Color(0x2a1f6e),
      emissiveIntensity: 0.4
    });
  } else {
    glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.05,
      transmission: 1,
      thickness: 1.6,
      ior: 1.45,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      attenuationColor: new THREE.Color(0x8b7bff),
      attenuationDistance: 5,
      envMapIntensity: 1.4
    });
  }

  // Dark chrome metal — the heavy counterpart.
  const darkMetal = new THREE.MeshPhysicalMaterial({
    color: 0x0a0c14,
    metalness: 1,
    roughness: 0.32,
    envMapIntensity: 1.3
  });

  // ---------------- Objects ----------------
  const objects = [];

  function makeObject({ geo, mat, scale = 1, pos = [0, 0, 0], rotSpeed = 0.1, drift = 1, phase = 0, edgeColor = 0x7af0ff, edgeOpacity = 0.5 }) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.scale.setScalar(scale);
    const group = new THREE.Group();
    group.add(mesh);
    group.position.set(...pos);

    // Glowing neon edges so each object reads clearly against the void.
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, 25),
      new THREE.LineBasicMaterial({ color: edgeColor, transparent: true, opacity: edgeOpacity })
    );
    edges.scale.setScalar(scale);
    mesh.add(edges);

    scene.add(group);
    objects.push({ group, mesh, rotSpeed, drift, phase, baseY: pos[1], baseX: pos[0] });
    return group;
  }

  // — Hero: glass icosahedron (the signature crystal), center-right.
  makeObject({
    geo: new THREE.IcosahedronGeometry(1.7, 0),
    mat: glassMat,
    pos: [5.2, 0.6, 0],
    rotSpeed: 0.12, drift: 1.2, phase: 0,
    edgeColor: 0x7af0ff, edgeOpacity: 0.55
  });

  // — Glass octahedron shard, upper-left.
  makeObject({
    geo: new THREE.OctahedronGeometry(0.8, 0),
    mat: glassMat,
    pos: [-6.0, 2.4, -0.5],
    rotSpeed: 0.22, drift: 0.9, phase: 1.5,
    edgeColor: 0xff7ad9, edgeOpacity: 0.5
  });

  // — Dark metal torus, lower-left, gives weight.
  makeObject({
    geo: new THREE.TorusGeometry(0.7, 0.22, 20, 64),
    mat: darkMetal,
    pos: [-5.2, -2.2, 0.8],
    rotSpeed: 0.16, drift: 1.1, phase: 3.0,
    edgeColor: 0x8b7bff, edgeOpacity: 0.35
  });

  // — Tall glass prism (hex cylinder), right-lower.
  makeObject({
    geo: new THREE.CylinderGeometry(0.3, 0.3, 2.2, 6),
    mat: glassMat,
    pos: [6.6, -1.6, -1.2],
    rotSpeed: 0.08, drift: 0.8, phase: 4.2,
    edgeColor: 0x7af0ff, edgeOpacity: 0.45
  });

  // — Glowing wireframe dodecahedron, far top-right — architectural accent.
  makeObject({
    geo: new THREE.DodecahedronGeometry(0.95, 0),
    mat: new THREE.MeshBasicMaterial({ color: 0x8b7bff, wireframe: true, transparent: true, opacity: 0.4 }),
    pos: [6.8, 2.8, -2],
    rotSpeed: 0.05, drift: 0.6, phase: 2.0,
    edgeColor: 0x8b7bff, edgeOpacity: 0.0 // already wireframe
  });

  // — Small dark knot, foreground detail.
  makeObject({
    geo: new THREE.TorusKnotGeometry(0.38, 0.12, 90, 16),
    mat: darkMetal,
    pos: [4.2, 3.0, 1.8],
    rotSpeed: 0.3, drift: 0.7, phase: 5.5,
    edgeColor: 0xff7ad9, edgeOpacity: 0.3
  });

  // Mobile: keep 3 objects (hero + 2 accents) — enough presence without
  // the heavy transmission cost or crowding a narrow screen.
  if (isMobile) {
    objects.slice(3).forEach(o => scene.remove(o.group));
    objects.splice(3);
  }

  // ---------------- Interaction ----------------
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  if (!isCoarse) {
    window.addEventListener('pointermove', (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  // ---------------- Resize ----------------
  function onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  // ---------------- Visibility pause ----------------
  let running = true;
  document.addEventListener('visibilitychange', () => { running = !document.hidden; });

  // ---------------- WebGL context loss (common on iOS Safari) ----------------
  // If the GPU drops the context (memory pressure, background tab), stop the
  // loop cleanly so the page never freezes. The CSS aurora stays as fallback.
  renderer.domElement.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    running = false;
  }, false);

  // ---------------- Animate ----------------
  const clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);
    if (!running) return;
    const t = clock.getElapsedTime();

    pointer.x += (pointer.tx - pointer.x) * 0.045;
    pointer.y += (pointer.ty - pointer.y) * 0.045;

    objects.forEach((o) => {
      o.mesh.rotation.x = t * o.rotSpeed + o.phase;
      o.mesh.rotation.y = t * o.rotSpeed * 0.8 + o.phase * 0.7;
      o.group.position.y = o.baseY + Math.sin(t * 0.5 + o.phase) * 0.45 * o.drift;
      o.group.position.x = o.baseX + Math.cos(t * 0.35 + o.phase) * 0.3 * o.drift;
    });

    camera.position.x += (pointer.x * 1.1 - camera.position.x) * 0.04;
    camera.position.y += (-pointer.y * 0.7 - camera.position.y + scrollY * 0.0008) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  if (prefersReduced) {
    renderer.render(scene, camera);
    return;
  }
  tick();
})();
