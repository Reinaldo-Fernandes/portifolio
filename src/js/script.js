/**
 * REINALDO.DEV - Serenity Tech Engine
 */

const CONFIG = {
    color: 0xd4a373, 
    nodes: 60,
    connectionDist: 3.8
};

class Portfolio {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.points = [];
        this.init();
    }

    init() {
        this.setupScene();
        this.createElements();
        this.setupEvents();
        this.animate();
        // Chamada única para a digitação
        this.startTyping("System.out.println('Welcome to my world');");
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = 12;
    }

    createElements() {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(CONFIG.nodes * 3);
        this.velocities = [];

        for (let i = 0; i < CONFIG.nodes; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 25;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
            
            this.velocities.push(new THREE.Vector3(
                (Math.random() - 0.5) * 0.015,
                (Math.random() - 0.5) * 0.015,
                (Math.random() - 0.5) * 0.01
            ));
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        
        this.particleMat = new THREE.PointsMaterial({
            color: CONFIG.color,
            size: 0.12,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.pointsMesh = new THREE.Points(geo, this.particleMat);
        this.scene.add(this.pointsMesh);

        this.lineMat = new THREE.LineBasicMaterial({ 
            color: CONFIG.color, 
            transparent: true, 
            opacity: 0.12 
        });
    }

    updateAnims() {
        const positions = this.pointsMesh.geometry.attributes.position.array;
        const linePoints = [];

        for (let i = 0; i < CONFIG.nodes; i++) {
            positions[i * 3] += this.velocities[i].x;
            positions[i * 3 + 1] += this.velocities[i].y;
            positions[i * 3 + 2] += this.velocities[i].z;

            if (Math.abs(positions[i * 3]) > 15) this.velocities[i].x *= -1;
            if (Math.abs(positions[i * 3 + 1]) > 15) this.velocities[i].y *= -1;

            for (let j = i + 1; j < CONFIG.nodes; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

                if (dist < CONFIG.connectionDist) {
                    linePoints.push(positions[i*3], positions[i*3+1], positions[i*3+2]);
                    linePoints.push(positions[j*3], positions[j*3+1], positions[j*3+2]);
                }
            }
        }

        this.pointsMesh.geometry.attributes.position.needsUpdate = true;

        if (this.networkLines) this.scene.remove(this.networkLines);
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
        this.networkLines = new THREE.LineSegments(lineGeo, this.lineMat);
        this.scene.add(this.networkLines);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.updateAnims();
        
        const pulse = 0.6 + Math.sin(Date.now() * 0.0015) * 0.2;
        this.particleMat.opacity = pulse;

        this.renderer.render(this.scene, this.camera);
    }

    startTyping(text) {
        const target = document.getElementById('textoDigitando');
        if (!target) return;
        target.innerHTML = ""; // Limpa antes de começar
        let i = 0;
        const type = () => {
            if (i < text.length) {
                target.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 70);
            }
        };
        type();
    }

    setupEvents() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}

// Inicialização
new Portfolio();

// Animações de Scroll e Bento Boxes
document.addEventListener("DOMContentLoaded", () => {
    const boxes = document.querySelectorAll(".bento-box");
    boxes.forEach((box, index) => {
        box.style.opacity = 0;
        box.style.transform = "translateY(20px)";
        setTimeout(() => {
            box.style.transition = "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
            box.style.opacity = 1;
            box.style.transform = "translateY(0)";
        }, index * 100);
    });

    const fadeEls = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    fadeEls.forEach(el => observer.observe(el));
});