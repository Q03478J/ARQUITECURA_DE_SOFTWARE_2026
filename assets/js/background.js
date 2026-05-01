/* =====================================================
   INTERACTIVE BACKGROUND v3 — CORONEL GUEVARA 2026
   ✅ Líneas MUY gruesas y luminosas
   ✅ Funciona en TODAS las páginas
   ✅ Botones se agrandan al hacer clic (ripple + scale)
   ✅ Supabase intacto — sólo visual
   ===================================================== */
(function () {
    'use strict';

    /* ── CONFIG ── */
    var CFG = {
        MAX_P  : 140,   DIVISOR : 7000,
        CD     : 170,   MD      : 280,
        LW_PP  : 2.4,   LW_M    : 3.5,
        LA_PP  : 0.75,  LA_M    : 0.95,
        PUSH_R : 240,   PUSH_F  : 110,
        SPOT_R : 460,   SPOT_A  : 0.18,
        CR1    : 44,    CR2     : 18,   CDOT : 7,   CA : 0.85,
        RIP_R  : 180,   RIP_SPD : 7,
    };

    /* ── CLASE ── */
    function BG() {
        this.canvas    = null;
        this.ctx       = null;
        this.P         = [];
        this.rips      = [];
        this.mx = -9999; this.my = -9999; this.spd = 0; this.px = 0; this.py = 0;
        this.isLight   = false;
        this.raf       = null;
        this._init();
    }

    BG.prototype._init = function () {
        var c = document.createElement('canvas');
        c.id = 'bg-canvas';
        c.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
        document.body.insertBefore(c, document.body.firstChild);
        this.canvas = c;
        this.ctx    = c.getContext('2d');
        this._resize();
        this._spawn();
        this._bind();
        this._patchButtons();
        this._loop();
    };

    BG.prototype._resize = function () {
        this.canvas.width  = this.W = window.innerWidth;
        this.canvas.height = this.H = window.innerHeight;
    };

    BG.prototype._spawn = function () {
        this.P = [];
        var n = Math.min(Math.floor(this.W * this.H / CFG.DIVISOR), CFG.MAX_P);
        for (var i = 0; i < n; i++) this.P.push(this._newP());
    };

    BG.prototype._newP = function () {
        return {
            x: Math.random() * this.W, y: Math.random() * this.H,
            ox: 0, oy: 0,
            vx: (Math.random() - 0.5) * 0.55, vy: (Math.random() - 0.5) * 0.55,
            sz: 1.2 + Math.random() * 2.8,
            ba: 0.38 + Math.random() * 0.42, a: 0.4,
            ph: Math.random() * Math.PI * 2, ps: 0.014 + Math.random() * 0.018,
            cy: Math.random() > 0.8,
        };
    };

    BG.prototype._lime = function (a) {
        var c = this.isLight ? '58,122,0' : '200,240,74';
        return 'rgba(' + c + ',' + Math.min(1, Math.max(0, a)) + ')';
    };
    BG.prototype._cyan = function (a) {
        var c = this.isLight ? '0,120,60' : '80,255,180';
        return 'rgba(' + c + ',' + Math.min(1, Math.max(0, a)) + ')';
    };
    BG.prototype._col = function (p, a) { return p.cy ? this._cyan(a) : this._lime(a); };

    BG.prototype._bind = function () {
        var self = this;
        window.addEventListener('resize', function () { self._resize(); self._spawn(); });

        window.addEventListener('mousemove', function (e) {
            var dx = e.clientX - self.px, dy = e.clientY - self.py;
            self.spd = Math.min(Math.sqrt(dx*dx+dy*dy), 50);
            self.px  = self.mx; self.py = self.my;
            self.mx  = e.clientX; self.my = e.clientY;
        });
        window.addEventListener('mouseleave', function () { self.mx = self.my = -9999; self.spd = 0; });
        window.addEventListener('click', function (e) {
            self.rips.push({ x: e.clientX, y: e.clientY, r: 0, maxR: CFG.RIP_R, a: 1, spd: CFG.RIP_SPD });
        });

        var obs = new MutationObserver(function () {
            self.isLight = document.documentElement.getAttribute('data-theme') === 'light';
        });
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        this.isLight = document.documentElement.getAttribute('data-theme') === 'light';
    };

    /* ─── BOTONES: SCALE + RIPPLE ─── */
    BG.prototype._patchButtons = function () {
        var self = this;

        /* Inyectar estilos globales UNA sola vez */
        if (!document.getElementById('bg-styles')) {
            var st = document.createElement('style');
            st.id  = 'bg-styles';
            st.textContent = [
                /* Ripple de tinta en botones */
                '@keyframes _btnRip { to { transform:scale(2.5); opacity:0; } }',

                /* Nav links hover luminoso */
                '.nav-link {',
                '  transition: color .2s ease, text-shadow .2s ease, transform .15s ease !important;',
                '}',
                '.nav-link:hover {',
                '  color: var(--color-primary) !important;',
                '  text-shadow: 0 0 14px rgba(200,240,74,.85), 0 0 36px rgba(200,240,74,.4) !important;',
                '  transform: translateY(-2px) !important;',
                '}',
                '[data-theme=light] .nav-link:hover {',
                '  text-shadow: 0 0 12px rgba(58,122,0,.6), 0 0 28px rgba(58,122,0,.25) !important;',
                '}',
                '.nav-link.active::after { transform: scaleX(1) !important; }',

                /* Btn-login pulso suave */
                '.btn-login { animation: _loginPulse 3s ease-in-out infinite !important; }',
                '@keyframes _loginPulse {',
                '  0%,100% { box-shadow: 0 0 0 0 rgba(200,240,74,0); }',
                '  50%     { box-shadow: 0 0 18px 5px rgba(200,240,74,.38); }',
                '}',
                '[data-theme=light] .btn-login { animation: _loginPulseL 3s ease-in-out infinite !important; }',
                '@keyframes _loginPulseL {',
                '  0%,100% { box-shadow: 0 0 0 0 rgba(58,122,0,0); }',
                '  50%     { box-shadow: 0 0 16px 4px rgba(58,122,0,.28); }',
                '}',
            ].join('\n');
            document.head.appendChild(st);
        }

        function patch(el) {
            if (!el || el._bgP) return;
            el._bgP = true;
            var cs = getComputedStyle(el);
            if (cs.position === 'static') el.style.position = 'relative';
            el.style.overflow = 'hidden';

            el.addEventListener('mousedown', function () {
                el.style.transition = 'transform .12s cubic-bezier(.4,0,.2,1), box-shadow .12s ease';
                el.style.transform  = 'scale(0.93)';
            });
            el.addEventListener('mouseup', function () {
                el.style.transform  = 'scale(1.08)';
                el.style.boxShadow  = '0 0 32px 8px rgba(200,240,74,.55)';
                setTimeout(function () { el.style.transform = 'scale(1)'; el.style.boxShadow = ''; }, 240);
            });
            el.addEventListener('mouseleave', function () {
                el.style.transform  = 'scale(1)';
                el.style.boxShadow  = '';
            });

            /* Ripple de tinta */
            el.addEventListener('click', function (e) {
                var rect = el.getBoundingClientRect();
                var ink  = document.createElement('span');
                var d    = Math.max(rect.width, rect.height) * 2.2;
                ink.style.cssText = [
                    'position:absolute',
                    'border-radius:50%',
                    'width:' + d + 'px',
                    'height:' + d + 'px',
                    'left:' + (e.clientX - rect.left - d / 2) + 'px',
                    'top:'  + (e.clientY - rect.top  - d / 2) + 'px',
                    'background:rgba(200,240,74,.30)',
                    'transform:scale(0)',
                    'animation:_btnRip .6s ease-out forwards',
                    'pointer-events:none',
                    'z-index:99',
                ].join(';');
                el.appendChild(ink);
                setTimeout(function () { ink.remove(); }, 650);
            });
        }

        /* Patch inmediato */
        document.querySelectorAll('button,.btn,.nav-link,.btn-login,.unit-card,.stat-card').forEach(patch);

        /* Patch para elementos añadidos por Supabase / JS */
        var mo = new MutationObserver(function (muts) {
            muts.forEach(function (m) {
                m.addedNodes.forEach(function (node) {
                    if (node.nodeType !== 1) return;
                    if (node.matches && node.matches('button,.btn,.nav-link,.btn-login')) patch(node);
                    if (node.querySelectorAll) node.querySelectorAll('button,.btn,.nav-link,.btn-login').forEach(patch);
                });
            });
        });
        mo.observe(document.body, { childList: true, subtree: true });
    };

    /* ─── LOOP ─── */
    BG.prototype._loop = function () {
        this._update();
        this._draw();
        var self = this;
        this.raf = requestAnimationFrame(function () { self._loop(); });
    };

    BG.prototype._update = function () {
        var mx = this.mx, my = this.my, sp = this.spd;
        for (var i = 0; i < this.P.length; i++) {
            var p = this.P[i];
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > this.W) p.vx *= -1;
            if (p.y < 0 || p.y > this.H) p.vy *= -1;
            p.x = Math.max(0, Math.min(this.W, p.x));
            p.y = Math.max(0, Math.min(this.H, p.y));
            p.ph += p.ps;
            p.a   = p.ba + Math.sin(p.ph) * 0.18;

            var dx = p.x - mx, dy = p.y - my;
            var dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < CFG.PUSH_R && dist > 0) {
                var f  = (1 - dist / CFG.PUSH_R);
                var ag = Math.atan2(dy, dx);
                var tg = CFG.PUSH_F * f * f * (1 + sp * 0.035);
                p.ox += (Math.cos(ag) * tg - p.ox) * 0.15;
                p.oy += (Math.sin(ag) * tg - p.oy) * 0.15;
                p.a   = Math.min(1, p.a + f * 0.55);
            } else { p.ox *= 0.945; p.oy *= 0.945; }
        }
        this.rips = this.rips.filter(function (r) {
            r.r += r.spd; r.spd *= 0.97; r.a *= 0.91;
            return r.a > 0.01 && r.r < r.maxR + 30;
        });
        this.spd *= 0.87;
    };

    BG.prototype._draw = function () {
        var ctx = this.ctx, W = this.W, H = this.H;
        var mx = this.mx, my = this.my, sp = this.spd;
        var HAS = mx > 0 && mx < W && my > 0 && my < H;
        ctx.clearRect(0, 0, W, H);

        /* SPOTLIGHT */
        if (HAS) {
            var sR = CFG.SPOT_R + sp * 5;
            var sg = ctx.createRadialGradient(mx, my, 0, mx, my, sR);
            sg.addColorStop(0,    this._lime(CFG.SPOT_A));
            sg.addColorStop(0.3,  this._lime(CFG.SPOT_A * 0.55));
            sg.addColorStop(0.65, this._lime(CFG.SPOT_A * 0.18));
            sg.addColorStop(1,    this._lime(0));
            ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);

            var hg = ctx.createRadialGradient(mx, my, 0, mx, my, 220);
            hg.addColorStop(0, this._cyan(0.10)); hg.addColorStop(1, this._cyan(0));
            ctx.fillStyle = hg; ctx.fillRect(0, 0, W, H);
        }

        /* PARTÍCULAS + LÍNEAS */
        for (var i = 0; i < this.P.length; i++) {
            var p  = this.P[i];
            var px = p.x + p.ox, py = p.y + p.oy;
            var dm = HAS ? Math.sqrt((px-mx)*(px-mx)+(py-my)*(py-my)) : 9999;
            var near = dm < CFG.MD;

            /* Líneas entre partículas */
            for (var j = i + 1; j < this.P.length; j++) {
                var q  = this.P[j];
                var qx = q.x + q.ox, qy = q.y + q.oy;
                var d  = Math.sqrt((px-qx)*(px-qx)+(py-qy)*(py-qy));
                if (d >= CFG.CD) continue;
                var t = 1 - d / CFG.CD;
                ctx.lineWidth = t * CFG.LW_PP;
                ctx.strokeStyle = this._lime(t * CFG.LA_PP);
                ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(qx,qy); ctx.stroke();
                /* Glow */
                ctx.lineWidth = t * CFG.LW_PP * 3;
                ctx.strokeStyle = this._lime(t * 0.28);
                ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(qx,qy); ctx.stroke();
            }

            /* Líneas al mouse */
            if (HAS && near) {
                var t2  = 1 - dm / CFG.MD;
                var bst = 1 + sp * 0.05;
                ctx.lineWidth = t2 * CFG.LW_M * bst;
                ctx.strokeStyle = this._lime(Math.min(CFG.LA_M, t2 * CFG.LA_M * bst));
                ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(mx,my); ctx.stroke();
                ctx.lineWidth = t2 * CFG.LW_M * 3.8 * bst;
                ctx.strokeStyle = this._lime(t2 * 0.32 * bst);
                ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(mx,my); ctx.stroke();
            }

            /* Glow partícula */
            var gR = p.sz * (near ? 10 : 5);
            var gg = ctx.createRadialGradient(px,py,0,px,py,gR);
            gg.addColorStop(0, this._col(p, near ? 0.65 : 0.28));
            gg.addColorStop(1, this._col(p, 0));
            ctx.beginPath(); ctx.arc(px,py,gR,0,Math.PI*2); ctx.fillStyle = gg; ctx.fill();

            /* Punto */
            ctx.beginPath();
            ctx.arc(px, py, near ? p.sz * 1.8 : p.sz, 0, Math.PI * 2);
            ctx.fillStyle = this._col(p, near ? Math.min(1, p.a + 0.4) : p.a);
            ctx.fill();
        }

        /* CURSOR GLOW */
        if (HAS) {
            /* Anillo exterior grueso */
            ctx.beginPath(); ctx.arc(mx,my,CFG.CR1+sp*1.5,0,Math.PI*2);
            ctx.strokeStyle = this._lime(CFG.CA * 0.75); ctx.lineWidth = 2.8; ctx.stroke();
            ctx.beginPath(); ctx.arc(mx,my,CFG.CR1+sp*1.5,0,Math.PI*2);
            ctx.strokeStyle = this._lime(0.25); ctx.lineWidth = 12; ctx.stroke();
            /* Anillo interior */
            ctx.beginPath(); ctx.arc(mx,my,CFG.CR2+sp*0.6,0,Math.PI*2);
            ctx.strokeStyle = this._lime(CFG.CA); ctx.lineWidth = 2.2; ctx.stroke();
            /* Punto con glow */
            var dotR = CFG.CDOT + sp * 0.25;
            var dg = ctx.createRadialGradient(mx,my,0,mx,my,dotR*5);
            dg.addColorStop(0, this._lime(1.0));
            dg.addColorStop(0.3, this._lime(0.8));
            dg.addColorStop(1, this._lime(0));
            ctx.beginPath(); ctx.arc(mx,my,dotR*5,0,Math.PI*2); ctx.fillStyle=dg; ctx.fill();
            ctx.beginPath(); ctx.arc(mx,my,dotR,0,Math.PI*2); ctx.fillStyle=this._lime(1); ctx.fill();
            /* Cruz */
            if (sp > 6) {
                var cL = 24 + sp * 0.7;
                ctx.save(); ctx.strokeStyle=this._lime(0.42); ctx.lineWidth=1.3;
                ctx.setLineDash([4,6]);
                ctx.beginPath();
                ctx.moveTo(mx-cL,my); ctx.lineTo(mx+cL,my);
                ctx.moveTo(mx,my-cL); ctx.lineTo(mx,my+cL);
                ctx.stroke(); ctx.setLineDash([]); ctx.restore();
            }
        }

        /* RIPPLES */
        for (var ri = 0; ri < this.rips.length; ri++) {
            var r = this.rips[ri];
            ctx.beginPath(); ctx.arc(r.x,r.y,r.r,0,Math.PI*2);
            ctx.strokeStyle = this._lime(r.a * 0.95);
            ctx.lineWidth   = 4 * (1 - r.r / r.maxR) + 0.5; ctx.stroke();
            ctx.beginPath(); ctx.arc(r.x,r.y,r.r,0,Math.PI*2);
            ctx.strokeStyle = this._lime(r.a * 0.3);
            ctx.lineWidth   = 14 * (1 - r.r / r.maxR); ctx.stroke();
            if (r.r > 15) {
                ctx.beginPath(); ctx.arc(r.x,r.y,r.r*0.55,0,Math.PI*2);
                ctx.strokeStyle = this._cyan(r.a * 0.7); ctx.lineWidth = 2; ctx.stroke();
            }
            if (r.r < 45) {
                var fg = ctx.createRadialGradient(r.x,r.y,0,r.x,r.y,50);
                fg.addColorStop(0, this._lime(r.a * 0.75));
                fg.addColorStop(1, this._lime(0));
                ctx.beginPath(); ctx.arc(r.x,r.y,50,0,Math.PI*2); ctx.fillStyle=fg; ctx.fill();
            }
        }
    };

    /* ── ARRANCAR ── */
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', function () { window._bg = new BG(); });
    else
        window._bg = new BG();

})();
