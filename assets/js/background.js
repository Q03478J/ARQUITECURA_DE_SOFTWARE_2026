/* ===================================
   BACKGROUND INTERACTIVO v2 — IGLOO STYLE
   Más grueso · Más luminoso · Ripple en clic
   assets/js/background.js
   =================================== */
class InteractiveBackground {
    constructor() {
        this.canvas     = null;
        this.ctx        = null;
        this.particles  = [];
        this.mouse      = { x: -9999, y: -9999 };
        this.mouseSpeed = 0;
        this.ripples    = [];
        this.animFrame  = null;
        this.isLight    = false;
        this.tick       = 0;
        this.init();
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'bg-canvas';
        Object.assign(this.canvas.style, {
            position: 'fixed', top: '0', left: '0',
            width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: '0',
        });
        document.body.insertBefore(this.canvas, document.body.firstChild);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.loop();
    }

    resize() {
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.W = this.canvas.width;
        this.H = this.canvas.height;
    }

    createParticles() {
        this.particles = [];
        const count = Math.min(Math.floor((this.W * this.H) / 8000), 130);
        for (let i = 0; i < count; i++) this.particles.push(this.makeParticle());
    }

    makeParticle() {
        return {
            x: Math.random() * this.W,
            y: Math.random() * this.H,
            ox: 0, oy: 0,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size:       1 + Math.random() * 3,
            baseAlpha:  0.35 + Math.random() * 0.45,
            alpha:      0.4,
            pulse:      Math.random() * Math.PI * 2,
            pulseSpeed: 0.015 + Math.random() * 0.02,
            hue:        Math.random() > 0.85 ? 'cyan' : 'lime',
        };
    }

    bindEvents() {
        window.addEventListener('resize', () => { this.resize(); this.createParticles(); });

        window.addEventListener('mousemove', (e) => {
            const dx = e.clientX - this.mouse.x;
            const dy = e.clientY - this.mouse.y;
            this.mouseSpeed = Math.min(Math.sqrt(dx*dx + dy*dy), 40);
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            this.mouse.x = -9999; this.mouse.y = -9999; this.mouseSpeed = 0;
        });

        // CLIC → onda de expansión
        window.addEventListener('click', (e) => {
            this.ripples.push({ x: e.clientX, y: e.clientY, r: 0, maxR: 160, alpha: 0.9, speed: 6 });
        });

        const obs = new MutationObserver(() => {
            this.isLight = document.documentElement.getAttribute('data-theme') === 'light';
        });
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        this.isLight = document.documentElement.getAttribute('data-theme') === 'light';
    }

    get C()     { return this.isLight ? {r:58,g:122,b:0}    : {r:200,g:240,b:74};  }
    get Ccyan() { return this.isLight ? {r:0,g:140,b:80}     : {r:100,g:255,b:180}; }
    rgb(c, a)   { return `rgba(${c.r},${c.g},${c.b},${a})`; }
    lime(a)     { return this.rgb(this.C, a);     }
    cyan(a)     { return this.rgb(this.Ccyan, a); }

    loop() {
        this.tick++;
        this.update();
        this.draw();
        this.animFrame = requestAnimationFrame(() => this.loop());
    }

    update() {
        const mx = this.mouse.x, my = this.mouse.y;
        const RADIUS = 220, PUSH = 100, RETURN = 0.055;

        for (const p of this.particles) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > this.W) p.vx *= -1;
            if (p.y < 0 || p.y > this.H) p.vy *= -1;
            p.x = Math.max(0, Math.min(this.W, p.x));
            p.y = Math.max(0, Math.min(this.H, p.y));

            p.pulse += p.pulseSpeed;
            p.alpha  = p.baseAlpha + Math.sin(p.pulse) * 0.2;

            const dx = p.x - mx, dy = p.y - my;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < RADIUS && dist > 0) {
                const force  = (1 - dist / RADIUS);
                const angle  = Math.atan2(dy, dx);
                const boost  = 1 + this.mouseSpeed * 0.04;
                const target = PUSH * force * force * boost;
                p.ox += (Math.cos(angle) * target - p.ox) * 0.14;
                p.oy += (Math.sin(angle) * target - p.oy) * 0.14;
                p.alpha = Math.min(1, p.alpha + force * 0.5);
            } else {
                p.ox += (0 - p.ox) * RETURN;
                p.oy += (0 - p.oy) * RETURN;
            }
        }

        this.ripples = this.ripples.filter(r => {
            r.r += r.speed; r.speed *= 0.97; r.alpha *= 0.90;
            return r.alpha > 0.01 && r.r < r.maxR + 20;
        });

        this.mouseSpeed *= 0.88;
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.W, this.H);

        const mx = this.mouse.x, my = this.mouse.y;
        const hasMouse = mx > 0 && mx < this.W && my > 0 && my < this.H;

        /* SPOTLIGHT grande */
        if (hasMouse) {
            const spotR = 420 + this.mouseSpeed * 4;
            const spot  = ctx.createRadialGradient(mx, my, 0, mx, my, spotR);
            spot.addColorStop(0,    this.lime(0.14));
            spot.addColorStop(0.25, this.lime(0.08));
            spot.addColorStop(0.6,  this.lime(0.03));
            spot.addColorStop(1,    this.lime(0));
            ctx.fillStyle = spot;
            ctx.fillRect(0, 0, this.W, this.H);

            const halo = ctx.createRadialGradient(mx, my, 0, mx, my, 200);
            halo.addColorStop(0,   this.cyan(0.07));
            halo.addColorStop(1,   this.cyan(0));
            ctx.fillStyle = halo;
            ctx.fillRect(0, 0, this.W, this.H);
        }

        /* PARTÍCULAS + LÍNEAS */
        const CONNECT_D = 160, MOUSE_D = 260;

        for (let i = 0; i < this.particles.length; i++) {
            const p  = this.particles[i];
            const rx = p.x + p.ox, ry = p.y + p.oy;
            const nearMouse = hasMouse && Math.hypot(rx - mx, ry - my) < MOUSE_D;

            // Líneas entre partículas — más gruesas y brillantes
            for (let j = i + 1; j < this.particles.length; j++) {
                const q  = this.particles[j];
                const qx = q.x + q.ox, qy = q.y + q.oy;
                const d  = Math.hypot(rx - qx, ry - qy);
                if (d < CONNECT_D) {
                    const t = 1 - d / CONNECT_D;
                    ctx.beginPath();
                    ctx.moveTo(rx, ry);
                    ctx.lineTo(qx, qy);
                    ctx.strokeStyle = this.lime(t * 0.55);
                    ctx.lineWidth   = t * 1.8;
                    ctx.stroke();
                }
            }

            // Líneas al mouse — muy gruesas y brillantes
            if (hasMouse) {
                const dm = Math.hypot(rx - mx, ry - my);
                if (dm < MOUSE_D) {
                    const t     = 1 - dm / MOUSE_D;
                    const boost = 1 + this.mouseSpeed * 0.05;
                    ctx.beginPath();
                    ctx.moveTo(rx, ry);
                    ctx.lineTo(mx, my);
                    ctx.strokeStyle = this.lime(Math.min(0.95, t * 0.9 * boost));
                    ctx.lineWidth   = t * 2.5 * boost;
                    ctx.stroke();
                }
            }

            // Glow de partícula
            if (p.size > 1.5 || nearMouse) {
                const glowR = p.size * (nearMouse ? 8 : 4);
                const gc    = p.hue === 'cyan' ? this.Ccyan : this.C;
                const glow  = ctx.createRadialGradient(rx, ry, 0, rx, ry, glowR);
                glow.addColorStop(0, `rgba(${gc.r},${gc.g},${gc.b},${nearMouse ? 0.5 : 0.22})`);
                glow.addColorStop(1, `rgba(${gc.r},${gc.g},${gc.b},0)`);
                ctx.beginPath();
                ctx.arc(rx, ry, glowR, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();
            }

            // Punto sólido
            ctx.beginPath();
            ctx.arc(rx, ry, nearMouse ? p.size * 1.6 : p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.hue === 'cyan' ? this.cyan(p.alpha) : this.lime(p.alpha);
            ctx.fill();
        }

        /* CURSOR GLOW — grande y brillante */
        if (hasMouse) {
            const spd = this.mouseSpeed;

            // Anillo exterior
            ctx.beginPath();
            ctx.arc(mx, my, 40 + spd * 1.2, 0, Math.PI * 2);
            ctx.strokeStyle = this.lime(0.55 + spd * 0.01);
            ctx.lineWidth   = 1.5;
            ctx.stroke();

            // Anillo interior
            ctx.beginPath();
            ctx.arc(mx, my, 16 + spd * 0.5, 0, Math.PI * 2);
            ctx.strokeStyle = this.lime(0.8);
            ctx.lineWidth   = 2;
            ctx.stroke();

            // Glow del punto central
            const ptR  = 6 + spd * 0.2;
            const ptG  = ctx.createRadialGradient(mx, my, 0, mx, my, ptR * 4);
            ptG.addColorStop(0,   this.lime(1.0));
            ptG.addColorStop(0.3, this.lime(0.7));
            ptG.addColorStop(1,   this.lime(0));
            ctx.beginPath();
            ctx.arc(mx, my, ptR * 4, 0, Math.PI * 2);
            ctx.fillStyle = ptG;
            ctx.fill();

            // Punto sólido central
            ctx.beginPath();
            ctx.arc(mx, my, ptR, 0, Math.PI * 2);
            ctx.fillStyle = this.lime(1.0);
            ctx.fill();

            // Cruz cuando el mouse se mueve rápido
            if (spd > 5) {
                const cLen = 20 + spd;
                ctx.save();
                ctx.strokeStyle = this.lime(0.35);
                ctx.lineWidth   = 1;
                ctx.setLineDash([3, 5]);
                ctx.beginPath();
                ctx.moveTo(mx - cLen, my); ctx.lineTo(mx + cLen, my);
                ctx.moveTo(mx, my - cLen); ctx.lineTo(mx, my + cLen);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.restore();
            }
        }

        /* RIPPLES de clic */
        for (const rip of this.ripples) {
            ctx.beginPath();
            ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
            ctx.strokeStyle = this.lime(rip.alpha * 0.9);
            ctx.lineWidth   = 2.5 * (1 - rip.r / rip.maxR) + 0.5;
            ctx.stroke();

            if (rip.r > 12) {
                ctx.beginPath();
                ctx.arc(rip.x, rip.y, rip.r * 0.55, 0, Math.PI * 2);
                ctx.strokeStyle = this.cyan(rip.alpha * 0.5);
                ctx.lineWidth   = 1.5;
                ctx.stroke();
            }

            if (rip.r < 30) {
                const flash = ctx.createRadialGradient(rip.x, rip.y, 0, rip.x, rip.y, 30);
                flash.addColorStop(0, this.lime(rip.alpha * 0.6));
                flash.addColorStop(1, this.lime(0));
                ctx.beginPath();
                ctx.arc(rip.x, rip.y, 30, 0, Math.PI * 2);
                ctx.fillStyle = flash;
                ctx.fill();
            }
        }
    }

    destroy() {
        cancelAnimationFrame(this.animFrame);
        if (this.canvas) this.canvas.remove();
    }
}

/* Inicializar en cualquier estado del DOM */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { window._iglooBG = new InteractiveBackground(); });
} else {
    window._iglooBG = new InteractiveBackground();
}
