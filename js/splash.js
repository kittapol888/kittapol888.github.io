const splash = document.getElementById('splash-screen');
const splashContent = document.getElementById('splash-content');
let isSplashActive = true;
let isExploding = false; 
let isAssembling = true; // 🔥 [NEW] สถานะเริ่มแรก: สั่งให้เศษชิ้นส่วนวิ่งมารวมร่างกันก่อน

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
    // 🎯 1. คำนวณตำแหน่งเป้าหมายหลัก (จุดที่จะฟอร์มตัวโคจรรอบจุดศูนย์กลาง)
    const targetX = (Math.random() - .5) * 20;
    const targetY = (Math.random() - .5) * 20;
    const targetZ = (Math.random() - .5) * 20;
    const targetPosition = new THREE.Vector3(targetX, targetY, targetZ);

    // 🚀 2. คำนวณตำแหน่งเกิด (ดีดให้เศษชิ้นส่วนกระจัดกระจายไปไกลๆ นอกจอในตอนแรก)
    // คูณด้วย 30-50 เพื่อให้อยู่ลึกเข้าไปในอวกาศแล้วค่อยบินเข้ามา
    const spawnPosition = targetPosition.clone().normalize().multiplyScalar(35 + Math.random() * 25);

    // 💥 3. เวกเตอร์ทิศทางสำหรับการระเบิดออกตอนโดนคลิก
    const velocity = targetPosition.clone().normalize();
    const speed = 0.25 + Math.random() * 0.35; 
    velocity.multiplyScalar(speed);

    boxData.push({
        currentPosition: spawnPosition.clone(), // เริ่มต้นวัตถุที่พิกัดกระจายตัวรอบนอก
        targetPosition: targetPosition,        // พิกัดที่จะเข้ามารวมร่าง
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
    
    for(let i = 0; i < COUNT; i++) {
        const data = boxData[i];

        // 🔄 หมุนอิสระในตัวเองแต่ละกล่อง
        data.rotation.x += data.rotSpeed.x;
        data.rotation.y += data.rotSpeed.y;
        data.rotation.z += data.rotSpeed.z;

        if (isAssembling) {
            // 🔥 [MODE: รวมร่าง] ค่อยๆ ดูดเศษชิ้นส่วนจากนอกจอกลับเข้ามาหาพิกัดเป้าหมายด้วยความนุ่มนวล (Lerp 4% ต่อเฟรม)
            data.currentPosition.lerp(data.targetPosition, 0.04);
        } else if (isExploding) {
            // 💥 [MODE: ระเบิด] สั่งให้พุ่งกระจายออกจากศูนย์กลางรอบทิศทาง
            data.currentPosition.add(data.velocity);
        }

        dummy.position.copy(data.currentPosition);
        dummy.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
    }
    
    // 🌐 หมุนกลุ่มก้อนวัตถุทั้งหมดตามแนววงโคจรหลัก
    mesh.rotation.y = t * 0.0003; 
    mesh.instanceMatrix.needsUpdate = true;
    
    renderer.render(scene, camera);
    requestAnimationFrame(animateSplash);
}
requestAnimationFrame(animateSplash);

// เมื่อคลิกหน้าจอ: สลายตัวหนังสือ และระเบิดกล่องออกไป
splash.addEventListener('click', () => {
    if (isExploding) return; 
    
    isAssembling = false; // 🔥 สั่งปิดโหมดรวมร่างทันทีเพื่อให้วัตถุหลุดจากแรงดึงดูดเดิม
    isExploding = true;   // 💥 เปิดโหมดระเบิดพุ่งกระจาย
    
    splashContent.classList.add('blur-fade-out'); // สั่งให้ข้อความสลายตัวแบบดิจิทัล

    // ทิ้งช่วงเวลาให้เห็นเอฟเฟกต์การระเบิดและการจางหายอย่างสมูท 1.4 วินาที
    setTimeout(() => {
        splash.classList.add('fade-out');
        setTimeout(() => {
            isSplashActive = false; 
        }, 1500);
    }, 1400);
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
        const text = heroTitle.textContent; // ดึงคำว่า "Hi, I'm Kittapol"
        heroTitle.innerHTML = text.split('').map((char, index) => {
            if (char === ' ') return '<span>&nbsp;</span>';
            
            const isName = index >= 8; 
            const colorClass = isName ? 'color-name' : 'color-white';
            
            return `<span class="${colorClass}">${char}</span>`;
        }).join('');
    }
});