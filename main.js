import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// ==========================================
// SUAS MEMÓRIAS (Nomes ajustados para a sua lista)
// ==========================================
const memories = [
  { 
    photo: 'IMG-20261108-WA0062.jpg', 
    title: 'Onde tudo começou 💫', 
    text: '2024, no primeiro ano do ensino médio. Foi ali que o universo cruzou os nossos caminhos pela primeira vez. Eu ainda não sabia, mas a minha vida estava prestes a mudar para sempre.' 
  },
  { 
    photo: 'IMG-20261108-WA0069.jpg', 
    title: 'Dois anos de silêncio 🌙', 
    text: 'Eu vim para Goiânia e o destino nos afastou por dois anos. O tempo passou, a distância existiu, mas o nosso laço nunca se rompeu. Algumas conexões são maiores que o espaço.' 
  },
  { 
    photo: 'IMG-20261108-WA0070.jpg', 
    title: '17 de setembro: O Reencontro 💌', 
    text: 'Nesse dia, você me mandou mensagem dizendo que gostava de mim desde 2024. Eu respondi que também sentia o mesmo. No mesmo dia, escolhemos ficar juntos. E aqui estamos, até hoje.' 
  },
  { 
    photo: 'IMG-20261108-WA0071.jpg', 
    title: 'Perto através das fotos 📸', 
    text: 'Mesmo quando a distância física insiste em nos separar, você está sempre perto de mim. Cada foto sua que eu olho é como um pedacinho de você iluminando o meu céu.' 
  },
  { 
    photo: 'IMG-20261108-WA0074.jpg', 
    title: 'O seu sorriso é o meu norte 🧭', 
    text: 'Navegando por essa imensidão, eu busco o seu sorriso. Não importa em qual planeta eu esteja, é nele que eu encontro a minha direção e o meu porto seguro.' 
  },
  { 
    photo: 'IMG-20261108-WA0078.jpg', 
    title: 'Uma galáxia inteira de amor 🌌', 
    text: 'Eu criei a nossa Galáxia do Amor porque a distância entre Goiânia e você não é nada comparada ao tamanho do que eu sinto. Você é a estrela mais brilhante daqui.' 
  },
  { 
    photo: 'IMG-20261108-WA0080.jpg', 
    title: 'Meu lugar favorito é você 🏡', 
    text: 'As fotos são a forma que encontrei de te manter colada em mim. Quando a saudade bate, eu viajo no tempo e no espaço, e te encontro em cada memória que construímos.' 
  },
  { 
    photo: 'IMG-20261108-WA0082.jpg', 
    title: 'A distância é só um detalhe 💞', 
    text: 'Os quilômetros que nos separam não são capazes de apagar o que a gente vive. Você está perto de mim através das fotos, das mensagens, do pensamento e do coração.' 
  },
  { 
    photo: 'IMG-20261108-WA0084.jpg', 
    title: 'O nosso tempo é o agora ⏳', 
    text: 'Dois anos sem falar serviram para provar que o nosso destino estava apenas esperando o momento certo. E o momento certo é agora, é hoje, é sempre que eu penso em você.' 
  },
  { 
    photo: 'IMG-20261108-WA0086.jpg', 
    title: 'Você é a minha Galáxia 💖', 
    text: 'Eu não posso estar do seu lado fisicamente todos os dias agora, mas criei esse universo todo só para te lembrar: você é o meu mundo, a minha galáxia, o meu amor. Eu te amo!' 
  }
];

// ==========================================
// CENA E CONTROLES
// ==========================================
const canvas = document.getElementById('scene');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0018, 0.0015);
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 5000);
camera.position.set(0, 30, 220);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 1.2, 0.6, 0.85));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.4;
controls.zoomSpeed = 0.6;
controls.minDistance = 60;
controls.maxDistance = 600;
controls.enablePan = false;

// ==========================================
// LUZES
// ==========================================
scene.add(new THREE.AmbientLight(0x8a6bff, 0.6));
const sun = new THREE.PointLight(0xffb3f0, 4, 1200);
sun.position.set(0, 0, 0);
scene.add(sun);

// ==========================================
// NÚCLEO E GALÁXIA
// ==========================================
const core = new THREE.Mesh(new THREE.SphereGeometry(15, 64, 64), new THREE.MeshBasicMaterial({ color: 0xffb3f0 }));
scene.add(core);
const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: createGlowTexture(), color: 0xff6ec4, transparent: true, blending: THREE.AdditiveBlending, opacity: 0.9 }));
glow.scale.set(120, 120, 1);
scene.add(glow);

const spiralCount = 14000;
const spiralGeo = new THREE.BufferGeometry();
const positions = new Float32Array(spiralCount * 3);
const colors = new Float32Array(spiralCount * 3);
const c1 = new THREE.Color(0xff6ec4), c2 = new THREE.Color(0x7873f5), c3 = new THREE.Color(0x4adede);
for (let i = 0; i < spiralCount; i++) {
  const arm = i % 4, angleOffset = (arm / 4) * Math.PI * 2;
  const radius = Math.pow(Math.random(), 0.6) * 160 + 8, spin = radius * 0.035;
  const spread = 12 + radius * 0.15, angle = angleOffset + spin + (Math.random() - 0.5) * 0.6;
  positions[i*3] = Math.cos(angle) * radius + (Math.random() - 0.5) * spread;
  positions[i*3+1] = (Math.random() - 0.5) * (8 + radius * 0.08);
  positions[i*3+2] = Math.sin(angle) * radius + (Math.random() - 0.5) * spread;
  const color = Math.random() < 0.33 ? c1.clone() : Math.random() < 0.5 ? c2.clone() : c3.clone();
  color.lerp(new THREE.Color(0xffffff), Math.random() * 0.3);
  colors[i*3] = color.r; colors[i*3+1] = color.g; colors[i*3+2] = color.b;
}
spiralGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
spiralGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
const spiral = new THREE.Points(spiralGeo, new THREE.PointsMaterial({ size: 1.6, vertexColors: true, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, map: createCircleTexture() }));
scene.add(spiral);

// ==========================================
// ESTRELAS DE FUNDO
// ==========================================
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(3000 * 3);
for (let i = 0; i < 3000; i++) {
  const r = 800 + Math.random() * 1200, theta = Math.random() * Math.PI * 2, phi = Math.acos(2 * Math.random() - 1);
  starPos[i*3] = r * Math.sin(phi) * Math.cos(theta); starPos[i*3+1] = r * Math.cos(phi); starPos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 2, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, map: createCircleTexture() })));

// ==========================================
// PLANETAS E FOTOS (CRIADOS DINAMICAMENTE)
// ==========================================
const clickable = [];
const planetColors = [0xff6ec4, 0x7873f5, 0x4adede];
const textureLoader = new THREE.TextureLoader();

memories.forEach((mem, i) => {
  const angle = (i / memories.length) * Math.PI * 2;
  const distance = 80 + (i * 10); 
  
  const pColor = planetColors[i % planetColors.length];
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(6, 32, 32),
    new THREE.MeshStandardMaterial({ color: pColor, emissive: pColor, emissiveIntensity: 0.5, roughness: 0.4, metalness: 0.3 })
  );
  planet.position.set(Math.cos(angle) * distance, (Math.random() - 0.5) * 30, Math.sin(angle) * distance);
  planet.userData = { memory: mem, baseY: planet.position.y, phase: Math.random() * Math.PI * 2 };
  scene.add(planet);
  clickable.push(planet);

  textureLoader.load(mem.photo, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    const orb = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 16),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
    );
    const oAngle = angle + 0.2;
    orb.position.set(Math.cos(oAngle) * (distance + 20), (Math.random() - 0.5) * 40, Math.sin(oAngle) * (distance + 20));
    orb.userData = { memory: mem, baseY: orb.position.y, phase: Math.random() * Math.PI * 2 };
    scene.add(orb);
    clickable.push(orb);
  });
});

// ==========================================
// TÍTULO 3D
// ==========================================
const canvasText = document.createElement('canvas');
canvasText.width = 1024; canvasText.height = 256;
const ctx = canvasText.getContext('2d');
ctx.font = 'bold 110px Georgia'; const grad = ctx.createLinearGradient(0, 0, 1024, 0);
grad.addColorStop(0, '#ff6ec4'); grad.addColorStop(0.5, '#7873f5'); grad.addColorStop(1, '#4adede');
ctx.fillStyle = grad; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
ctx.shadowColor = '#ff6ec4'; ctx.shadowBlur = 40; ctx.fillText('Galáxia do Amor', 512, 128);
const titleSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvasText), transparent: true, depthWrite: false }));
titleSprite.scale.set(160, 40, 1); titleSprite.position.set(0, 45, 0); scene.add(titleSprite);

// ==========================================
// TEXTURAS AUXILIARES
// ==========================================
function createGlowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  const rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.3, 'rgba(255,180,240,0.7)'); rg.addColorStop(1, 'rgba(255,110,196,0)');
  g.fillStyle = rg; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
}
function createCircleTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = rg; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c);
}

// ==========================================
// INTERAÇÃO E ANIMAÇÃO
// ==========================================
const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2();
const memoryPanel = document.getElementById('memoryPanel');
const memoryPhoto = document.getElementById('memoryPhoto');
const memoryTitle = document.getElementById('memoryTitle');
const memoryText = document.getElementById('memoryText');

renderer.domElement.addEventListener('click', (e) => {
  pointer.x = (e.clientX / innerWidth) * 2 - 1; pointer.y = -(e.clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(clickable, false);
  if (hits.length > 0 && hits[0].object.userData.memory) {
    const mem = hits[0].object.userData.memory;
    memoryPhoto.src = mem.photo; memoryTitle.textContent = mem.title; memoryText.textContent = mem.text;
    memoryPanel.classList.remove('hidden');
  }
});
document.getElementById('closeMemory').addEventListener('click', () => memoryPanel.classList.add('hidden'));
document.getElementById('startBtn').addEventListener('click', () => {
  const intro = document.getElementById('intro');
  intro.style.opacity = '0'; setTimeout(() => intro.style.display = 'none', 1500);
});

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  spiral.rotation.y = t * 0.05; core.rotation.y = t * 0.1;
  const pulse = 1 + Math.sin(t * 2) * 0.05; core.scale.set(pulse, pulse, pulse);
  glow.scale.setScalar(120 + Math.sin(t * 1.5) * 15);
  clickable.forEach((obj) => { if (obj.userData.baseY !== undefined) obj.position.y = obj.userData.baseY + Math.sin(t + obj.userData.phase) * 3; });
  titleSprite.position.y = 45 + Math.sin(t) * 2;
  controls.update(); composer.render();
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight);
});
