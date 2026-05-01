/* ===================================
   BACKGROUND INTERACTIVO — ESTILO IGLOO INC.
   Partículas + líneas + spotlight de mouse
   Archivo: assets/js/background.js
   =================================== */

class InteractiveBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: -9999, y: -9999, vx: 0, vy: 0 };
        this.lastMouse = { x: 0, y: 0 };
        this.animFrame = null;
        this.isLight = false;
        this.init();
    }

    init() {
        // Crear canvas y pegarlo al body como primer hijo
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'bg-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        document.body.insertBefore(this.canvas, document.body.firstChild);
        this.ctx = this.canvas.getContext('2d');

        this.resize();
        this.createParticles();
        this.bindEvents();
        this.loop();
    }

    // ---- Tamaño ----
    resize() {
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.W = this.canvas.width;
        this.H = this.canvas.height;
    }

    // ---- Partículas ----
    createParticles() {
        this.particles = [];
        const count = Math.min(Math.floor((this.W * this.H) / 14000), 90);
        for (let i = 0; i < count; i++) {
            this.particles.push(this.makeParticle());
        }
    }

    makeParticle(x, y) {
        return {
            x:    x ?? Math.random() * this.W,
            y:    y ?? Math.random() * this.H,
            ox:   0, oy: 0,           // offset por mouse
            vx:   (Math.random() - 0.5) * 0.35,
            vy:   (Math.random() - 0.5) * 0.35,
            size: Math.random() * 1.6 + 0.4,
            alpha: Math.random() * 0.5 + 0.2,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.012 + Math.random() * 0.018,
        };
    }

    // ---- Eventos ----
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.vx = e.clientX - this.lastMouse.x;
            this.mouse.vy = e.clientY - this.lastMouse.y;
            this.lastMouse.x = this.mouse.x;
            this.lastMouse.y = this.mouse.y;
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            this.mouse.x = -9999;
            this.mouse.y = -9999;
        });

        // Detectar cambio de tema
        const observer = new MutationObserver(() => {
            this.isLight = document.documentElement.getAttribute('data-theme') === 'light';
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        this.isLight = document.documentElement.getAttribute('data-theme') === 'light';
    }

    // ---- Colores según tema ----
    get accentColor() {
        return this.isLight ? '58,122,0' : '200,240,74';
    }

    get particleColor() {
        return this.isLight ? '58,122,0' : '200,240,74';
    }

    get lineColor() {
        return this.isLight ? '58,122,0' : '200,240,74';
    }

    // ---- Loop principal ----
    loop() {
        this.update();
        this.draw();
        this.animFrame = requestAnimationFrame(() => this.loop());
    }

    update() {
        const mx = this.mouse.x;
        const my = this.mouse.y;
        const RADIUS     = 180;   // radio de influencia del mouse
        const PUSH       = 60;    // fuerza máxima de empuje
        const RETURN     = 0.06;  // velocidad de retorno
        const CONNECT_D  = 130;   // distancia máxima para trazar líneas

        for (const p of this.particles) {
            // Pulso de opacidad
            p.pulse += p.pulseSpeed;
            p.alpha = 0.18 + Math.sin(p.pulse) * 0.12;

            // Movimiento base
            p.x += p.vx;
            p.y += p.vy;

            // Rebote en bordes
            if (p.x < 0 || p.x > this.W) p.vx *= -1;
            if (p.y < 0 || p.y > this.H) p.vy *= -1;
            p.x = Math.max(0, Math.min(this.W, p.x));
            p.y = Math.max(0, Math.min(this.H, p.y));

            // Influencia del mouse
            const dx = p.x - mx;
            const dy = p.y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < RADIUS && dist > 0) {
                const force  = (1 - dist / RADIUS);
                const angle  = Math.atan2(dy, dx);
                const target = PUSH * force * force;
                p.ox += (Math.cos(angle) * target - p.ox) * 0.12;
                p.oy += (Math.sin(angle) * target - p.oy) * 0.12;
            } else {
                // Retorno suave al centro
                p.ox += (0 - p.ox) * RETURN;
                p.oy += (0 - p.oy) * RETURN;
            }
        }
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.W, this.H);

        const mx = this.mouse.x;
        const my = this.mouse.y;
        const CONNECT_D = 130;
        const MOUSE_D   = 200;

        // ---- SPOTLIGHT del mouse ----
        if (mx > 0 && mx < this.W) {
            const spotlight = ctx.createRadialGradient(mx, my, 0, mx, my, 340);
            const ac = this.accentColor;
            spotlight.addColorStop(0,   `rgba(${ac}, 0.055)`);
            spotlight.addColorStop(0.4, `rgba(${ac}, 0.022)`);
            spotlight.addColorStop(1,   `rgba(${ac}, 0)`);
            ctx.fillStyle = spotlight;
            ctx.fillRect(0, 0, this.W, this.H);
        }

        // ---- PARTÍCULAS y LÍNEAS ----
        const pc = this.particleColor;
        const lc = this.lineColor;

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            const rx = p.x + p.ox;
            const ry = p.y + p.oy;

            // Líneas hacia partículas cercanas
            for (let j = i + 1; j < this.particles.length; j++) {
                const q  = this.particles[j];
                const qx = q.x + q.ox;
                const qy = q.y + q.oy;
                const dx = rx - qx;
                const dy = ry - qy;
                const d  = Math.sqrt(dx * dx + dy * dy);

                if (d < CONNECT_D) {
                    const lineAlpha = (1 - d / CONNECT_D) * 0.18;
                    ctx.beginPath();
                    ctx.moveTo(rx, ry);
                    ctx.lineTo(qx, qy);
                    ctx.strokeStyle = `rgba(${lc}, ${lineAlpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }

            // Líneas hacia el mouse
            if (mx > 0) {
                const dxm = rx - mx;
                const dym = ry - my;
                const dm  = Math.sqrt(dxm * dxm + dym * dym);
                if (dm < MOUSE_D) {
                    const mAlpha = (1 - dm / MOUSE_D) * 0.55;
                    ctx.beginPath();
                    ctx.moveTo(rx, ry);
                    ctx.lineTo(mx, my);
                    ctx.strokeStyle = `rgba(${lc}, ${mAlpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            // Punto de partícula
            ctx.beginPath();
            ctx.arc(rx, ry, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${pc}, ${p.alpha})`;
            ctx.fill();
        }

        // ---- CURSOR GLOW ----
        if (mx > 0 && mx < this.W && my > 0 && my < this.H) {
            const ac = this.accentColor;
            // Anillo exterior
            ctx.beginPath();
            ctx.arc(mx, my, 28, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${ac}, 0.25)`;
            ctx.lineWidth = 1;
            ctx.stroke();
            // Punto central
            ctx.beginPath();
            ctx.arc(mx, my, 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${ac}, 0.7)`;
            ctx.fill();
        }
    }

    destroy() {
        cancelAnimationFrame(this.animFrame);
        if (this.canvas) this.canvas.remove();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window._iglooBG = new InteractiveBackground();
});
