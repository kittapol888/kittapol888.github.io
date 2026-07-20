const splash = document.getElementById('splash-screen');
const splashContent = document.getElementById('splash-content');

let isSplashActive = true;
let isExploding = false; 
let isAssembling = true; 
let targetSpeedFactor = 1.0;  // ความเร็วเป้าหมาย (1.0 = ปกติ, 0.15 = สโลว์)
let currentSpeedFactor = 1.0; // ความเร็วปัจจุบันที่ระบบกำลังรันอยู่
let customTime = 0;           // ตัวนับเวลาสะสมสำหรับหมุนกลุ่มก้อนหลัก

// Setup ฉากหลัง 3D
const cyberCanvas = document.getElementById('splash-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 13;

const renderer = new THREE.WebGLRenderer({ canvas: cyberCanvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// โครงสร้างวัตถุ 1111 ชิ้น
const COUNT = 1111; 
const geo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const mat = new THREE.MeshNormalMaterial();
const mesh = new THREE.InstancedMesh(geo, mat, COUNT); 
scene.add(mesh);

const boxData = [];
const dummy = new THREE.Object3D(); 

for(let i = 0; i < COUNT; i++){
    const targetX = (Math.random() - .5) * 20;
    const targetY = (Math.random() - .5) * 20;
    const targetZ = (Math.random() - .5) * 20;
    const targetPosition = new THREE.Vector3(targetX, targetY, targetZ);

    const spawnPosition = targetPosition.clone().normalize().multiplyScalar(35 + Math.random() * 25);

    const velocity = targetPosition.clone().normalize();
    const speed = 0.25 + Math.random() * 0.35; 
    velocity.multiplyScalar(speed);

    boxData.push({
        currentPosition: spawnPosition.clone(),
        targetPosition: targetPosition,        
        rotation: new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        rotSpeed: new THREE.Vector3(
            (Math.random() - 0.5) * 0.04,
            (Math.random() - 0.5) * 0.04,
            (Math.random() - 0.5) * 0.04
        ),
        velocity: velocity
    });

    dummy.position.copy(boxData[i].currentPosition);
    dummy.rotation.set(boxData[i].rotation.x, boxData[i].rotation.y, boxData[i].rotation.z);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
}

// ฟังก์ชันแอนิเมชันลูปหลัก
function animateSplash(t){
    if (!isSplashActive) return; 
    
    // จูนความเร็ว: ค่อยๆ ชะลอหรือเร่งความเร็วแบบนุ่มนวล
    currentSpeedFactor += (targetSpeedFactor - currentSpeedFactor) * 0.08;
    
    for(let i = 0; i < COUNT; i++) {
        const data = boxData[i];

        data.rotation.x += data.rotSpeed.x * currentSpeedFactor;
        data.rotation.y += data.rotSpeed.y * currentSpeedFactor;
        data.rotation.z += data.rotSpeed.z * currentSpeedFactor;

        if (isAssembling) {
            data.currentPosition.lerp(data.targetPosition, 0.04 * currentSpeedFactor);
        } else if (isExploding) {
            data.currentPosition.add(data.velocity);
        }

        dummy.position.copy(data.currentPosition);
        dummy.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
    }
    
    customTime += 0.005 * currentSpeedFactor; 
    mesh.rotation.y = customTime; 
    
    mesh.instanceMatrix.needsUpdate = true;
    
    renderer.render(scene, camera);
    requestAnimationFrame(animateSplash);
}

// 🛑 [จุดที่หายไป] เรียกใช้ฟังก์ชันเพื่อเริ่มเล่นแอนิเมชัน 3D ทันทีที่โหลดหน้าเว็บ
requestAnimationFrame(animateSplash);

// เมื่อคลิกหน้าจอ: สลายตัวหนังสือ และระเบิดกล่องออกไป
splash.addEventListener('click', () => {
    if (isExploding) return; 
    
    isAssembling = false; 
    isExploding = true;   
    targetSpeedFactor = 1.0; // คืนค่าความเร็วปกติทันทีเพื่อให้กล่องระเบิดพุ่งออกไปอย่างรวดเร็ว
    splash.classList.remove('bg-focused'); // เคลียร์เอฟเฟกต์เบลอออก
    
    splashContent.classList.add('blur-fade-out'); 

    setTimeout(() => {
        splash.classList.add('fade-out');
        setTimeout(() => {
            isSplashActive = false; 
            splash.style.display = 'none'; // 🛑 ซ่อนแผงล่องหนออกไป เมาส์จะได้กดหน้าเว็บหลักได้
        }, 1500);
    }, 700);
});

// Responsive จอคอมพิวเตอร์
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener("DOMContentLoaded", () => {
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent; 
        heroTitle.innerHTML = text.split('').map((char, index) => {
            if (char === ' ') return '<span>&nbsp;</span>';
            
            const isName = index >= 8; 
            const colorClass = isName ? 'color-name' : 'color-white';
            
            return `<span class="${colorClass}">${char}</span>`;
        }).join('');
    }
});

// ==========================================================
// 🎮 กิมมิคสลับข้อความ + ดึงโฟกัสฉากหลังเบลอมืด + ระบบสโลว์โมชัน
// ==========================================================
const splashHint = document.querySelector('.splash-hint');

if (splashHint) {
    splashHint.addEventListener('mouseenter', () => {
        if (!isExploding) { 
            splashHint.textContent = "I WILL SHOW YOU SOMETHING AMAZING";
            splash.classList.add('bg-focused'); 
            targetSpeedFactor = 0.15; // ห้วงเวลาสโลว์โมชัน
        }
    });
    
    splashHint.addEventListener('mouseleave', () => {
        if (!isExploding) {
            splashHint.textContent = "CLICK IF YOU'RE INTERESTED";
            splash.classList.remove('bg-focused'); 
            targetSpeedFactor = 1.0;  // ดีดเวลากลับมาปกติ
        }
    });
}