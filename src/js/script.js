/**
 * REINALDO.DEV - Cyber-Cafe Engine
 */

const CONFIG = {
    color: 0xd4a373, 
    nodes: 60,
    connectionDist: 3.8,
    cursorLerp: 0.12
};

class Portfolio {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.cursor = { el: document.getElementById('cursor'), x: 0, y: 0, targetX: 0, targetY: 0 };
        this.points = [];
        this.init();
    }

    init() {
        this.setupScene();
        this.createElements();
        this.setupEvents();
        this.animate();
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
        // Estilo Game: Partículas com brilho sutil
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(CONFIG.nodes * 3);
        this.velocities = [];

        for (let i = 0; i < CONFIG.nodes; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 25;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
            
            this.velocities.push(new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.01
            ));
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        
        // Material Estilo Code/Terminal
        this.particleMat = new THREE.PointsMaterial({
            color: CONFIG.color,
            size: 0.12,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.pointsMesh = new THREE.Points(geo, this.particleMat);
        this.scene.add(this.pointsMesh);

        // Linhas de Conexão (Network Tech)
        this.lineMat = new THREE.LineBasicMaterial({ 
            color: CONFIG.color, 
            transparent: true, 
            opacity: 0.15 
        });
    }

    updateAnims() {
        const positions = this.pointsMesh.geometry.attributes.position.array;
        const linePoints = [];

        for (let i = 0; i < CONFIG.nodes; i++) {
            // Movimentação
            positions[i * 3] += this.velocities[i].x;
            positions[i * 3 + 1] += this.velocities[i].y;
            positions[i * 3 + 2] += this.velocities[i].z;

            // Bounce (Efeito de Arena de Jogo)
            if (Math.abs(positions[i * 3]) > 15) this.velocities[i].x *= -1;
            if (Math.abs(positions[i * 3 + 1]) > 15) this.velocities[i].y *= -1;

            // Busca por conexões próximas
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
        
        // Efeito pulso "Heartbeat" de Game
        const pulse = 0.8 + Math.sin(Date.now() * 0.002) * 0.2;
        this.particleMat.opacity = pulse;

        this.handleCursor();
        this.renderer.render(this.scene, this.camera);
    }

    handleCursor() {
        this.cursor.x += (this.cursor.targetX - this.cursor.x) * CONFIG.cursorLerp;
        this.cursor.y += (this.cursor.targetY - this.cursor.y) * CONFIG.cursorLerp;
        this.cursor.el.style.transform = `translate3d(${this.cursor.x}px, ${this.cursor.y}px, 0)`;
    }

    startTyping(text) {
        const target = document.getElementById('textoDigitando');
        let i = 0;
        const type = () => {
            if (i < text.length) {
                target.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        };
        type();
    }

    setupEvents() {
        window.addEventListener('mousemove', e => {
            this.cursor.targetX = e.clientX;
            this.cursor.targetY = e.clientY;
        });
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}

new Portfolio();