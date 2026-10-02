// LapCircuit POS counter: one sale riding a conveyor through five stations.
// Procedural three.js, no models or images. Techniques (instanced conveyor
// slats, canvas-painted screens, room-environment chrome) follow the
// "Agentic Factory" template by eugeneshilow; the scene itself is original.
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type PosSceneOptions = {
  /** Resolved CSS font-family for text painted on the in-scene screens. */
  font: string;
  lite: boolean;
  reduceMotion: boolean;
  allowRotate: boolean;
  onStep: (index: number) => void;
  onHover: (index: number | null, x: number, y: number) => void;
  /** Screen positions (px) of the marker above each station; null when off screen. */
  onMarkers: (points: Array<{ x: number; y: number } | null>) => void;
};

export type PosSceneApi = {
  focus: (index: number) => void;
  dispose: () => void;
};

const BLUE = 0x2e90ff;
const DWELL = 1.7; // seconds the ticket rests at each station
const SPEED = 0.07; // belt speed, path fraction per second
const STATION_SCALE = 1.3;
// Local height of the tallest part of each station, for its floating marker.
const STATION_TOP = [1.75, 0.95, 1.05, 2.25, 1.95];

export function initPosScene(container: HTMLElement, opts: PosSceneOptions): PosSceneApi {
  const width = () => container.clientWidth || 1;
  const height = () => container.clientHeight || 1;
  const cleanups: Array<() => void> = [];
  const listen = (target: EventTarget, type: string, fn: (e: any) => void) => {
    target.addEventListener(type, fn);
    cleanups.push(() => target.removeEventListener(type, fn));
  };

  // Throws if WebGL is unavailable; the caller shows the static fallback.
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: opts.lite ? "low-power" : "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.lite ? 1.5 : 2));
  renderer.setSize(width(), height());
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  renderer.shadowMap.enabled = !opts.lite;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.style.display = "block";
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.touchAction = "pan-y";
  container.appendChild(renderer.domElement);
  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, width() / height(), 0.1, 150);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room, 0.04);
  scene.environment = env.texture;
  scene.environmentIntensity = 0.85;
  room.dispose();
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0xdbe7ff, 0x0a0f18, 1.8));
  const key = new THREE.DirectionalLight(0xf4f7ff, 4);
  key.position.set(-5, 12, 8);
  if (!opts.lite) {
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left: -9, right: 9, top: 7, bottom: -7, near: 1, far: 34 });
    key.shadow.normalBias = 0.03;
    key.shadow.radius = 4;
  }
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xcfe0ff, 1.2);
  fill.position.set(6, 4, 9);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0x5aabff, 2.4);
  rim.position.set(2, 7, -10);
  scene.add(rim);

  const std = (color: number, metalness: number, roughness: number, extra: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra });
  // Hardware is near-black on a lighter brushed steel counter, like real POS gear.
  const M = {
    base: std(0x151b25, 0.8, 0.36),
    counter: std(0x3a4658, 0.72, 0.4),
    edge: std(0x7d8898, 0.88, 0.22),
    chrome: std(0xd0d8e2, 0.95, 0.14),
    device: std(0x0d1219, 0.25, 0.5),
    deviceTop: std(0x1b2330, 0.4, 0.42),
    paper: std(0xf2f5f9, 0, 0.8),
    light: std(BLUE, 0.2, 0.3, { emissive: BLUE, emissiveIntensity: 1.6 }),
    slat: std(0x4d5a6d, 0.7, 0.35),
    boxA: std(0x2d4263, 0.3, 0.5),
    boxB: std(0x3c5b85, 0.3, 0.45),
    boxC: std(0x5a7fb0, 0.3, 0.42),
  };

  const geos = new Map<string, THREE.BufferGeometry>();
  const roundBox = (w: number, h: number, d: number, r: number) => {
    const k = `b${w},${h},${d},${r}`;
    if (!geos.has(k)) {
      geos.set(k, r ? new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 3, h / 3, d / 3)) : new THREE.BoxGeometry(w, h, d));
    }
    return geos.get(k)!;
  };
  const box = (p: THREE.Object3D, w: number, h: number, d: number, x: number, y: number, z: number, m: THREE.Material, r = 0.04) => {
    const o = new THREE.Mesh(roundBox(w, h, d, r), m);
    o.position.set(x, y, z);
    o.castShadow = !opts.lite;
    o.receiveShadow = !opts.lite;
    p.add(o);
    return o;
  };
  const cyl = (p: THREE.Object3D, r: number, h: number, x: number, y: number, z: number, m: THREE.Material, seg = 20) => {
    const k = `c${r},${h},${seg}`;
    if (!geos.has(k)) geos.set(k, new THREE.CylinderGeometry(r, r, h, seg));
    const o = new THREE.Mesh(geos.get(k)!, m);
    o.position.set(x, y, z);
    o.castShadow = !opts.lite;
    p.add(o);
    return o;
  };

  // ── canvas-painted screens ────────────────────────────────────────────
  const textures: THREE.Texture[] = [];
  const paint = (w: number, h: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = maxAniso;
    textures.push(texture);
    return { ctx, texture };
  };
  const text = (ctx: CanvasRenderingContext2D, s: string, x: number, y: number, size: number, color: string, weight = 500) => {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px ${opts.font}`;
    ctx.fillText(s, x, y);
  };
  const bar = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, r = 3) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === "function") {
      (ctx as any).roundRect(x, y, w, h, r);
    } else {
      ctx.rect(x, y, w, h);
    }
    ctx.fill();
  };
  const screenMesh = (p: THREE.Object3D, w: number, h: number, x: number, y: number, z: number, tex: THREE.Texture) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
    mesh.position.set(x, y, z);
    p.add(mesh);
    return mesh;
  };

  // ── counter plate ─────────────────────────────────────────────────────
  const machine = new THREE.Group();
  scene.add(machine);
  box(machine, 12.8, 0.36, 7.4, 0, -0.1, 0, M.base, 0.16);
  box(machine, 12.6, 0.05, 7.22, 0, 0.1, 0, M.edge, 0.1);
  box(machine, 12.46, 0.08, 7.08, 0, 0.16, 0, M.counter, 0.09);
  box(machine, 12.1, 0.025, 0.035, 0, -0.16, 3.705, M.light, 0.01);
  for (const x of [-5.7, 5.7]) for (const z of [-3.1, 3.1]) cyl(machine, 0.34, 0.22, x, -0.36, z, M.device);

  // Soft contact shadow, used on every device (shadow maps are desktop only).
  const shadowTex = paint(128, 128);
  const sg = shadowTex.ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
  sg.addColorStop(0, "rgba(0,0,0,.75)");
  sg.addColorStop(1, "rgba(0,0,0,0)");
  shadowTex.ctx.fillStyle = sg;
  shadowTex.ctx.fillRect(0, 0, 128, 128);
  const contact = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 11),
    new THREE.MeshBasicMaterial({ map: shadowTex.texture, transparent: true, depthWrite: false, opacity: 0.7 }),
  );
  contact.rotation.x = -Math.PI / 2;
  contact.position.y = -0.47;
  scene.add(contact);

  // ── stations ──────────────────────────────────────────────────────────
  type Station = { group: THREE.Group; deck: THREE.MeshStandardMaterial; front: THREE.Vector3; top: THREE.Vector3 };
  const layout: Array<[number, number, number]> = [
    [-4.25, 1.3, 0.55], // billing
    [-3.55, -2.25, 0.15], // payment
    [0, -2.35, 0], // receipt
    [3.55, -2.25, -0.15], // stock
    [4.25, 1.3, -0.55], // reports
  ];
  const stations: Station[] = layout.map(([x, z, ry], i) => {
    const group = new THREE.Group();
    group.position.set(x, 0.2, z);
    group.rotation.y = ry;
    group.scale.setScalar(STATION_SCALE);
    machine.add(group);
    const deck = M.light.clone();
    deck.emissiveIntensity = 0.3;
    box(group, 2.0, 0.1, 1.7, 0, 0.05, 0, M.device, 0.09);
    box(group, 1.94, 0.03, 1.64, 0, 0.12, 0, deck, 0.08);
    box(group, 1.98, 0.14, 1.68, 0, 0.2, 0, M.deviceTop, 0.09);
    const front = new THREE.Vector3(0, 0, 1.25 * STATION_SCALE)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), ry)
      .add(group.position);
    const top = new THREE.Vector3(x, 0.2 + STATION_TOP[i] * STATION_SCALE + 0.45, z);
    return { group, deck, front, top };
  });

  // 01 Billing: touch terminal + handheld scanner with a beam.
  const billing = stations[0].group;
  cyl(billing, 0.09, 0.7, -0.15, 0.62, -0.2, M.chrome);
  box(billing, 0.7, 0.08, 0.5, -0.15, 0.3, -0.2, M.device, 0.03);
  const terminal = new THREE.Group();
  terminal.position.set(-0.15, 1.14, -0.12);
  terminal.rotation.x = -0.35;
  billing.add(terminal);
  box(terminal, 1.4, 0.94, 0.08, 0, 0, 0, M.device, 0.04);
  const termTex = paint(1024, 672);
  const drawTerminal = (active: number) => {
    const c = termTex.ctx;
    c.save();
    c.scale(2, 2);
    c.fillStyle = "#0B1320";
    c.fillRect(0, 0, 512, 336);
    bar(c, 20, 18, 472, 34, "#15223a", 6);
    text(c, "New bill", 34, 42, 18, "#EEF2F8", 600);
    for (let i = 0; i < 4; i++) {
      const y = 70 + i * 50;
      const lit = i === active;
      bar(c, 20, y, 472, 38, lit ? "rgba(46,144,255,.28)" : "#111b2c", 6);
      bar(c, 36, y + 14, [210, 160, 240, 180][i], 9, lit ? "#5AABFF" : "#3b4a60");
      bar(c, 400, y + 14, 74, 9, lit ? "#5AABFF" : "#3b4a60");
    }
    bar(c, 20, 276, 472, 42, "#2E90FF", 8);
    text(c, "Total", 36, 304, 19, "#05070A", 700);
    c.restore();
    termTex.texture.needsUpdate = true;
  };
  drawTerminal(-1);
  screenMesh(terminal, 1.3, 0.84, 0, 0, 0.042, termTex.texture);
  const scanner = new THREE.Group();
  scanner.position.set(0.68, 0.36, 0.25);
  billing.add(scanner);
  box(scanner, 0.28, 0.1, 0.34, 0, 0, 0, M.device, 0.03);
  const scanHead = box(scanner, 0.2, 0.44, 0.16, 0, 0.26, -0.05, M.device, 0.05);
  scanHead.rotation.x = 0.35;
  box(scanner, 0.14, 0.04, 0.02, 0, 0.44, 0.03, M.light, 0.01);
  const beamMat = new THREE.MeshBasicMaterial({ color: 0x5aabff, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  const beam = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.9), beamMat);
  beam.position.set(0, 0.34, 0.42);
  beam.rotation.x = -1.05;
  scanner.add(beam);

  // 02 Payment: cash drawer that slides open.
  const payment = stations[1].group;
  box(payment, 1.6, 0.46, 1.25, 0, 0.5, -0.05, M.device, 0.06);
  box(payment, 1.5, 0.03, 1.1, 0, 0.74, -0.05, M.edge, 0.02);
  const drawer = new THREE.Group();
  drawer.position.set(0, 0.46, 0.58);
  payment.add(drawer);
  box(drawer, 1.48, 0.3, 0.1, 0, 0, 0, M.deviceTop, 0.03);
  box(drawer, 0.46, 0.04, 0.03, 0, 0.05, 0.06, M.chrome, 0.01);
  cyl(drawer, 0.045, 0.04, 0.55, 0.05, 0.06, M.chrome, 12).rotation.x = Math.PI / 2;
  box(drawer, 1.38, 0.2, 0.9, 0, -0.02, -0.47, M.base, 0.02);
  for (let i = 0; i < 4; i++) box(drawer, 0.3, 0.14, 0.34, -0.5 + i * 0.33, 0.02, -0.55, M.boxB, 0.02);

  // 03 Receipt: thermal printer feeding paper.
  const receipt = stations[2].group;
  box(receipt, 1.1, 0.62, 1.0, 0, 0.58, 0, M.device, 0.12);
  box(receipt, 1.0, 0.06, 0.62, 0, 0.9, -0.12, M.deviceTop, 0.03);
  box(receipt, 0.72, 0.03, 0.04, 0, 0.88, 0.3, M.chrome, 0.01);
  box(receipt, 0.16, 0.05, 0.04, 0.34, 0.66, 0.51, M.light, 0.01);
  const receiptTex = paint(512, 1024);
  {
    const c = receiptTex.ctx;
    c.save();
    c.scale(2, 2);
    c.fillStyle = "#F2F5F9";
    c.fillRect(0, 0, 256, 512);
    text(c, "YOUR SHOP NAME", 30, 50, 21, "#1b2230", 700);
    c.strokeStyle = "#8A94A3";
    c.setLineDash([5, 6]);
    c.beginPath();
    c.moveTo(20, 76);
    c.lineTo(236, 76);
    c.stroke();
    for (let i = 0; i < 6; i++) {
      bar(c, 24, 100 + i * 30, [150, 110, 170, 120, 140, 100][i], 8, "#8A94A3");
      bar(c, 190, 100 + i * 30, 40, 8, "#8A94A3");
    }
    bar(c, 24, 300, 208, 12, "#1b2230");
    for (let i = 0; i < 40; i++) bar(c, 24 + i * 5.2, 340, 1 + (i % 3), 70, "#1b2230", 0);
    text(c, "Thank you", 76, 462, 20, "#4a5462", 500);
    c.restore();
  }
  receiptTex.texture.needsUpdate = true;
  const paper = new THREE.Group();
  paper.position.set(0, 0.9, 0.3);
  receipt.add(paper);
  const paperMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.62, 1.2),
    new THREE.MeshStandardMaterial({ map: receiptTex.texture, roughness: 0.85, side: THREE.DoubleSide }),
  );
  paperMesh.geometry.translate(0, 0.6, 0);
  paperMesh.rotation.x = -0.25;
  paper.add(paperMesh);
  paper.scale.y = 0.05;

  // 04 Stock: shelf rack; one box leaves the shelf when the sale lands.
  const stock = stations[3].group;
  for (const x of [-0.78, 0.78]) box(stock, 0.07, 1.9, 0.07, x, 1.2, -0.3, M.chrome, 0.01);
  for (const y of [0.55, 1.15, 1.75]) box(stock, 1.64, 0.05, 0.62, 0, y, -0.3, M.edge, 0.01);
  const boxMats = [M.boxA, M.boxB, M.boxC];
  for (const [y, n] of [
    [0.55, 4],
    [1.15, 3],
    [1.75, 4],
  ] as const) {
    for (let i = 0; i < n; i++) {
      if (y === 1.15 && i === 1) continue;
      box(stock, 0.3, 0.36, 0.42, -0.55 + i * 0.37, y + 0.2, -0.3, boxMats[(i + n) % 3], 0.03);
    }
  }
  const movingBox = box(stock, 0.3, 0.36, 0.42, -0.18, 1.35, -0.3, M.boxC, 0.03);
  const movingBoxHome = movingBox.position.clone();

  // 05 Reports: monitor with bars that rise for the day's figures.
  const reports = stations[4].group;
  cyl(reports, 0.08, 0.72, 0, 0.62, -0.25, M.chrome);
  box(reports, 0.6, 0.06, 0.4, 0, 0.3, -0.25, M.device, 0.02);
  const monitor = new THREE.Group();
  monitor.position.set(0, 1.37, -0.2);
  reports.add(monitor);
  box(monitor, 1.62, 1.02, 0.08, 0, 0, 0, M.device, 0.04);
  const repTex = paint(1024, 640);
  const barHeights = [0.42, 0.58, 0.36, 0.7, 0.52, 0.8, 0.62];
  const drawReport = (growth: number) => {
    const c = repTex.ctx;
    c.save();
    c.scale(2, 2);
    c.fillStyle = "#0B1320";
    c.fillRect(0, 0, 512, 320);
    text(c, "Today", 24, 40, 20, "#EEF2F8", 600);
    text(c, "Sales", 110, 40, 16, "#8A94A3", 500);
    c.strokeStyle = "#1c2940";
    c.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      c.beginPath();
      c.moveTo(24, 90 + i * 55);
      c.lineTo(488, 90 + i * 55);
      c.stroke();
    }
    barHeights.forEach((h, i) => {
      const last = i === barHeights.length - 1;
      const bh = 200 * h * (last ? growth : 1);
      bar(c, 40 + i * 64, 262 - bh, 40, bh, last ? "#2E90FF" : "#34496a", 4);
    });
    c.restore();
    repTex.texture.needsUpdate = true;
  };
  drawReport(0.15);
  screenMesh(monitor, 1.52, 0.92, 0, 0, 0.042, repTex.texture);

  // ── conveyor loop ─────────────────────────────────────────────────────
  const path = new THREE.CatmullRomCurve3(
    [
      [-2.45, 1.7],
      [-2.55, -0.2],
      [-1.3, -0.95],
      [1.3, -0.95],
      [2.55, -0.2],
      [2.45, 1.7],
      [0, 2.35],
    ].map(([x, z]) => new THREE.Vector3(x, 0.62, z)),
    true,
    "catmullrom",
    0.3,
  );
  const belt = new THREE.Group();
  machine.add(belt);
  const beltFrame = new THREE.Mesh(new THREE.TubeGeometry(path, 120, 0.33, 8, true), M.device);
  beltFrame.scale.y = 0.3;
  beltFrame.position.y = 0.4;
  belt.add(beltFrame);
  const slatCount = opts.lite ? 70 : 120;
  const slats = new THREE.InstancedMesh(roundBox(0.13, 0.06, 0.58, 0.012), M.slat, slatCount);
  slats.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  belt.add(slats);
  const dummy = new THREE.Object3D();
  const pv = new THREE.Vector3();
  const tv = new THREE.Vector3();
  const placeSlats = (offset: number) => {
    for (let i = 0; i < slatCount; i++) {
      const u = (((i / slatCount + offset) % 1) + 1) % 1;
      path.getPointAt(u, pv);
      path.getTangentAt(u, tv);
      dummy.position.copy(pv);
      dummy.rotation.set(0, -Math.atan2(tv.z, tv.x), 0);
      dummy.updateMatrix();
      slats.setMatrixAt(i, dummy.matrix);
    }
    slats.instanceMatrix.needsUpdate = true;
  };
  for (const side of [-1, 1]) {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 140; i++) {
      path.getPointAt(i / 140, pv);
      path.getTangentAt(i / 140, tv);
      pts.push(pv.clone().add(new THREE.Vector3(-tv.z * 0.34 * side, 0.08, tv.x * 0.34 * side)));
    }
    belt.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 140, 0.024, 6, true), M.chrome));
  }

  // The sale ticket.
  const ticket = new THREE.Group();
  machine.add(ticket);
  box(ticket, 0.5, 0.7, 0.04, 0, 0, 0, M.paper, 0.02);
  const ticketTex = paint(512, 704);
  {
    const c = ticketTex.ctx;
    c.save();
    c.scale(2, 2);
    c.fillStyle = "#F2F5F9";
    c.fillRect(0, 0, 256, 352);
    bar(c, 0, 0, 256, 70, "#2E90FF", 0);
    text(c, "Sale", 22, 48, 30, "#05070A", 700);
    for (let i = 0; i < 5; i++) bar(c, 22, 100 + i * 34, [180, 130, 200, 150, 110][i], 10, "#8A94A3");
    bar(c, 22, 290, 212, 14, "#1b2230");
    c.restore();
  }
  ticketTex.texture.needsUpdate = true;
  for (const side of [1, -1]) {
    const face = screenMesh(ticket, 0.46, 0.66, 0, 0, 0.022 * side, ticketTex.texture);
    if (side < 0) face.rotation.y = Math.PI;
  }

  // Ports: where the ticket stops in front of each station.
  const portU = stations.map((s) => {
    let best = 0;
    let dist = Infinity;
    for (let i = 0; i < 400; i++) {
      const p = path.getPointAt(i / 400);
      const d = (p.x - s.front.x) ** 2 + (p.z - s.front.z) ** 2;
      if (d < dist) {
        dist = d;
        best = i / 400;
      }
    }
    return best;
  });
  // Schedule: dwell at a port, then travel to the next one (wrapping round).
  const legs = portU.map((u, i) => {
    const next = portU[(i + 1) % portU.length];
    const span = (((next - u) % 1) + 1) % 1;
    return { from: u, span, travel: span / SPEED };
  });
  const cycle = legs.reduce((sum, l) => sum + DWELL + l.travel, 0);
  const legStart: number[] = [];
  legs.reduce((t, l) => {
    legStart.push(t);
    return t + DWELL + l.travel;
  }, 0);

  // ── camera: fit the counter and its station markers tightly to the frame ─
  // Real points only (plate corners, marker anchors): a bounding box would
  // reserve room for its empty corners and leave the machine small.
  const fitPoints: THREE.Vector3[] = [];
  for (const x of [-6.4, 6.4]) for (const z of [-3.7, 3.7]) for (const y of [-0.28, 0.2]) fitPoints.push(new THREE.Vector3(x, y, z));
  stations.forEach((s) => fitPoints.push(s.top.clone()));
  const SWAY = opts.lite ? 0.16 : 0.2;
  const viewDir = new THREE.Vector3(0, 0.72, 0.7).normalize();
  const polar = Math.acos(viewDir.y);
  const target = new THREE.Vector3(0, 0.7, 0);
  let radius = 18;
  const spherical = new THREE.Spherical();
  const probe = new THREE.Vector3();
  const place = (r: number, theta: number) => {
    spherical.set(r, polar, theta);
    camera.position.setFromSpherical(spherical).add(target);
    camera.lookAt(target);
    camera.updateMatrixWorld();
  };
  const fits = (r: number) => {
    // Check the widest swing of the idle sway, not just the straight-on view.
    for (const theta of [0, SWAY, -SWAY]) {
      place(r, theta);
      for (const p of fitPoints) {
        probe.copy(p).project(camera);
        // Markers hang above their anchor, so keep more room at the top.
        if (Math.abs(probe.x) > 0.96 || probe.y > 0.84 || probe.y < -0.95) return false;
      }
    }
    return true;
  };
  const solveRadius = () => {
    let lo = 4;
    let hi = 80;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (fits(mid)) hi = mid;
      else lo = mid;
    }
    const aspect = Math.max(0.6, Math.min(2.5, width() / height()));
    if (hi >= 45 || isNaN(hi)) {
      return Math.max(17, Math.min(32, 22.5 / Math.min(1.35, aspect)));
    }
    return Math.max(16, Math.min(34, hi));
  };
  const frameCamera = () => {
    const w = width();
    const h = height();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    target.set(0, 0.65, 0);
    radius = solveRadius();
    place(radius, 0);
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const p of fitPoints) {
      probe.copy(p).project(camera);
      minX = Math.min(minX, probe.x);
      maxX = Math.max(maxX, probe.x);
      minY = Math.min(minY, probe.y);
      maxY = Math.max(maxY, probe.y);
    }
    if (isFinite(minX) && isFinite(maxX) && isFinite(minY) && isFinite(maxY)) {
      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * radius;
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
      const shiftY = ((maxY + minY) / 2) * halfH * 0.85;
      const shiftX = ((maxX + minX) / 2) * halfH * camera.aspect;
      if (Math.abs(shiftY) < 6 && Math.abs(shiftX) < 8) {
        target.addScaledVector(up, shiftY).addScaledVector(right, shiftX);
      }
    }
    radius = solveRadius();
    place(radius, 0);
  };
  frameCamera();

  let controls: OrbitControls | null = null;
  let lastInput = -1e9;
  if (opts.allowRotate && !opts.reduceMotion) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(target);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.rotateSpeed = 0.5;
    controls.minPolarAngle = 0.5;
    controls.maxPolarAngle = 1.1;
    controls.minAzimuthAngle = -0.8;
    controls.maxAzimuthAngle = 0.8;
    // Only real drags count as input; "change" also fires for damping and the sway.
    controls.addEventListener("start", () => (lastInput = performance.now()));
    controls.addEventListener("end", () => (lastInput = performance.now()));
    renderer.domElement.style.touchAction = "pan-y";
    renderer.domElement.style.cursor = "grab";
  }

  // ── state ─────────────────────────────────────────────────────────────
  let clock = 0; // position in the schedule
  let travelled = 0; // unwrapped belt distance, drives the slats
  let active = -1;
  let arrivedAt = 0;
  let departedAt = 0;
  let visible = true;
  let lost = false;
  let running = true;
  // Reduced motion renders only when something changed.
  let dirty = true;
  let lastTerminal = -2;
  let lastReport = -1;

  const locate = (t: number) => {
    const tt = ((t % cycle) + cycle) % cycle;
    for (let i = legs.length - 1; i >= 0; i--) {
      if (tt >= legStart[i]) {
        const into = tt - legStart[i];
        if (into < DWELL) return { station: i, u: legs[i].from, moving: false };
        const f = (into - DWELL) / legs[i].travel;
        return { station: i, u: (legs[i].from + legs[i].span * f) % 1, moving: true };
      }
    }
    return { station: 0, u: legs[0].from, moving: false };
  };

  const setActive = (i: number, now: number) => {
    if (i === active) return;
    active = i;
    arrivedAt = now;
    dirty = true;
    stations.forEach((s, j) => (s.deck.emissiveIntensity = j === i ? 1.8 : 0.3));
    opts.onStep(i);
  };

  // ── picking ───────────────────────────────────────────────────────────
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  stations.forEach((s, i) => s.group.traverse((o) => (o.userData.station = i)));
  const hit = (e: PointerEvent) => {
    const r = renderer.domElement.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(
      stations.map((s) => s.group),
      true,
    );
    return hits.length ? (hits[0].object.userData.station as number) : null;
  };
  let downX = 0;
  let downY = 0;
  listen(renderer.domElement, "pointerdown", (e: PointerEvent) => {
    downX = e.clientX;
    downY = e.clientY;
  });
  listen(renderer.domElement, "pointermove", (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || e.buttons) return;
    const s = hit(e);
    renderer.domElement.style.cursor = s !== null ? "pointer" : controls ? "grab" : "default";
    const r = renderer.domElement.getBoundingClientRect();
    opts.onHover(s, e.clientX - r.left, e.clientY - r.top);
  });
  listen(renderer.domElement, "pointerleave", () => opts.onHover(null, 0, 0));
  listen(renderer.domElement, "pointerup", (e: PointerEvent) => {
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return;
    const s = hit(e);
    if (s !== null) api.focus(s);
  });

  // ── lifecycle ─────────────────────────────────────────────────────────
  const observer =
    typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(
          ([entry]) => {
            visible = entry ? entry.isIntersecting : true;
            if (visible) dirty = true;
          },
          { threshold: 0 },
        )
      : null;
  if (observer) observer.observe(container);

  listen(document, "visibilitychange", () => {
    visible = !document.hidden;
    if (visible) dirty = true;
  });
  listen(renderer.domElement, "webglcontextlost", (e: Event) => {
    e.preventDefault();
    lost = true;
  });
  listen(renderer.domElement, "webglcontextrestored", () => (lost = false));
  const resizeObserver = new ResizeObserver(() => {
    const w = width();
    const h = height();
    if (w > 0 && h > 0) {
      renderer.setSize(w, h, false);
      frameCamera();
      controls?.target.copy(target);
      dirty = true;
    }
  });
  resizeObserver.observe(container);

  const markers: Array<{ x: number; y: number } | null> = stations.map(() => null);
  const markerPoint = new THREE.Vector3();
  const desired = new THREE.Vector3();
  let last = performance.now();
  let raf = 0;
  let drawTick = 0;

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!visible || lost || !running) return;

    const playing = !opts.reduceMotion;
    if (!playing && !dirty) return;
    dirty = false;
    const before = locate(clock);
    if (playing) clock += dt;
    const where = locate(clock);
    if (where.moving) travelled += playing ? SPEED * dt : 0;
    setActive(where.station, now);
    if (!before.moving && where.moving) departedAt = now;

    path.getPointAt(where.u, pv);
    ticket.position.set(pv.x, pv.y + 0.5, pv.z);
    // Always turn the ticket's face towards the camera so it reads on every leg.
    ticket.rotation.set(-0.12, Math.atan2(camera.position.x - pv.x, camera.position.z - pv.z), 0);
    placeSlats(travelled);

    // Station effects, keyed to arrival and departure. Reduced motion shows end states.
    const since = playing ? (now - arrivedAt) / 1000 : 99;
    const gone = playing ? (now - departedAt) / 1000 : 99;
    const atStation = !where.moving;
    const ease = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
    beamMat.opacity = active === 0 && atStation && playing ? 0.35 + 0.25 * Math.sin(now / 45) : 0;
    drawTick += dt;
    if (drawTick > 0.1 || !playing) {
      drawTick = 0;
      const row = active === 0 && (atStation || !playing) ? Math.min(3, Math.floor(since * 2.4)) : -1;
      if (row !== lastTerminal) drawTerminal((lastTerminal = row));
      const growth = active === 4 ? Math.round((0.15 + 0.85 * ease(since / 1.2)) * 40) / 40 : 0.15;
      if (growth !== lastReport) drawReport((lastReport = growth));
    }
    drawer.position.z =
      0.58 + (active === 1 ? 0.5 * (atStation ? ease(since / 0.5) : 1 - ease(gone / 0.5)) : 0);
    paper.scale.y = active === 2 ? 0.05 + 0.95 * ease(since / 1.4) : Math.max(0.05, paper.scale.y - dt * 1.5);
    if (active === 3) {
      const k = ease(since / 1.1);
      movingBox.position.set(movingBoxHome.x, movingBoxHome.y + 0.5 * k, movingBoxHome.z + 0.9 * k);
      movingBox.visible = k < 0.98;
    } else {
      movingBox.visible = true;
      movingBox.position.copy(movingBoxHome);
    }
    if (playing) stations[active].deck.emissiveIntensity = 1.4 + 0.4 * Math.sin(now / 260);

    // Camera: user control on desktop, a slow sway when idle.
    if (controls) {
      if (playing && now - lastInput > 4000) {
        spherical.set(radius, polar, Math.sin(now / 5200) * SWAY);
        desired.setFromSpherical(spherical).add(target);
        camera.position.lerp(desired, 0.015);
      }
      controls.update();
    } else if (playing) {
      spherical.set(radius, polar, Math.sin(now / 5200) * SWAY);
      camera.position.setFromSpherical(spherical).add(target);
      camera.lookAt(target);
    }

    renderer.render(scene, camera);

    // Marker above every station, so each device is named on screen.
    stations.forEach((s, i) => {
      markerPoint.copy(s.top).project(camera);
      markers[i] =
        markerPoint.z < 1 ? { x: ((markerPoint.x + 1) / 2) * width(), y: ((1 - markerPoint.y) / 2) * height() } : null;
    });
    opts.onMarkers(markers);
  };
  placeSlats(0);
  raf = requestAnimationFrame(frame);

  const api: PosSceneApi = {
    focus(index: number) {
      if (index < 0 || index >= legs.length) return;
      clock = legStart[index];
      active = -1;
      setActive(index, performance.now());
      if (opts.reduceMotion) paper.scale.y = index === 2 ? 1 : 0.05;
    },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      resizeObserver.disconnect();
      cleanups.forEach((fn) => fn());
      controls?.dispose();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((m) => m.dispose());
      });
      geos.forEach((g) => g.dispose());
      textures.forEach((t) => t.dispose());
      env.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
  return api;
}
