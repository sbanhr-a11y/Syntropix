/*!
 * Syntropix - Human Capability System 3D visual
 * Entropy to Syntropy. Assess, Diagnose, Develop, Practice, Coach, Apply, Measure.
 * Needs three.js r128 loaded first (cdnjs: ajax/libs/three.js/r128/three.min.js).
 * Usage: add an empty div with the attribute data-syntropix-hcs, then load this file.
 */
(function () {
  'use strict';

  var STAGES = ['Assess', 'Diagnose', 'Develop', 'Practice', 'Coach', 'Apply', 'Measure'];

  var CSS = [
    '.sx-hcs{--sx-gold:#d6b67a;--sx-green:#2f9e74;--sx-sage:#8fb8a2;--sx-ink:#e9ede9;position:relative;width:100%;max-width:640px;margin-inline:auto;color:var(--sx-ink);container-type:inline-size;-webkit-user-select:none;user-select:none;font-family:inherit}',
    '.sx-hcs .sx-stage{position:relative;width:100%;aspect-ratio:1/1}',
    '.sx-hcs .sx-stage::before{content:"";position:absolute;inset:10%;border-radius:50%;pointer-events:none;background:radial-gradient(closest-side,rgba(47,158,116,.12),rgba(47,158,116,.035) 60%,transparent 100%)}',
    '.sx-hcs canvas{position:absolute;inset:0;width:100%;height:100%;display:block}',
    '.sx-hcs .sx-labels{position:absolute;inset:0;pointer-events:none}',
    '.sx-hcs .sx-pill{position:absolute;left:0;top:0;display:flex;align-items:center;gap:.7em;padding:.62em 1.05em .62em .78em;border-radius:999px;white-space:nowrap;',
    'background:rgba(8,11,10,.86);border:1px solid rgba(214,182,122,.14);font-size:clamp(7.5px,1.75cqi,11.5px);font-weight:600;letter-spacing:.22em;text-transform:uppercase;',
    'color:rgba(233,237,233,.5);transition:color .5s,border-color .5s,box-shadow .5s,background .5s;will-change:transform}',
    '.sx-hcs .sx-pill i{width:.72em;height:.72em;border-radius:50%;background:#39433f;flex:none;transition:background .5s,box-shadow .5s}',
    '.sx-hcs .sx-pill.is-done{color:rgba(233,237,233,.74)}',
    '.sx-hcs .sx-pill.is-done i{background:var(--sx-green)}',
    '.sx-hcs .sx-pill.is-on{color:#fff;border-color:rgba(214,182,122,.55);background:rgba(14,22,18,.92);box-shadow:0 0 0 4px rgba(214,182,122,.05),0 0 28px rgba(47,158,116,.22)}',
    '.sx-hcs .sx-pill.is-on i{background:var(--sx-gold);box-shadow:0 0 10px rgba(214,182,122,.9)}',
    '.sx-hcs .sx-foot{display:flex;flex-direction:column;align-items:center;gap:.9em;margin-top:-1.5%;text-align:center}',
    '.sx-hcs .sx-title{margin:0;color:var(--sx-gold);font-size:clamp(9px,2cqi,12.5px);font-weight:700;letter-spacing:.36em;text-transform:uppercase;padding-left:.36em}',
    '.sx-hcs .sx-meter{display:flex;align-items:center;gap:1em;font-size:clamp(7.5px,1.55cqi,10px);letter-spacing:.22em;text-transform:uppercase;color:rgba(233,237,233,.42)}',
    '.sx-hcs .sx-meter i{position:relative;display:block;width:clamp(70px,26cqi,170px);height:2px;border-radius:2px;background:rgba(255,255,255,.08);overflow:hidden}',
    '.sx-hcs .sx-meter b{position:absolute;inset:0;transform-origin:left center;transform:scaleX(0);background:linear-gradient(90deg,#6e675a,var(--sx-green) 55%,var(--sx-gold))}',
    '.sx-hcs.sx-nogl .sx-stage::after{content:"Evidence \\2192  action \\2192  development";position:absolute;inset:0;display:grid;place-items:center;color:rgba(233,237,233,.7);font-size:clamp(14px,4cqi,24px)}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('sx-hcs-css')) return;
    var s = document.createElement('style');
    s.id = 'sx-hcs-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------------- shaders ---------------- */

  var BODY_VS = [
    'uniform float uTime; uniform float uP; uniform float uPR; uniform float uSize; uniform float uScan;',
    'attribute vec3 aChaos; attribute vec3 aNrm; attribute float aSeed; attribute float aDelay;',
    'varying vec3 vCol; varying float vA;',
    'const float PI = 3.14159265;',
    'void main(){',
    '  float k = smoothstep(aDelay*0.55, aDelay*0.55+0.45, uP);',
    '  float e = k*k*(3.0-2.0*k);',
    '  float dir = aSeed > 0.5 ? 1.0 : -1.0;',
    '  float ac = atan(aChaos.z, aChaos.x) + uTime*(0.05+0.09*fract(aSeed*17.0))*dir;',
    '  float rc = length(aChaos.xz);',
    '  float at = atan(position.z, position.x);',
    '  float rt = length(position.xz);',
    '  float d = mod(at-ac+PI, 2.0*PI) - PI + dir*2.0*PI;',
    '  float ang = ac + d*e;',
    '  float r = mix(rc, rt, e);',
    '  vec3 p = vec3(cos(ang)*r, mix(aChaos.y, position.y, e), sin(ang)*r);',
    '  float j = 1.0 - e;',
    '  p += j*0.11*vec3(sin(uTime*0.9+aSeed*40.0), sin(uTime*0.7+aSeed*23.0), cos(uTime*0.8+aSeed*31.0));',
    '  p += aNrm*0.012*sin(uTime*1.4+position.y*2.0)*e;',
    '  vec4 mv = modelViewMatrix*vec4(p, 1.0);',
    '  vec3 n = normalize(normalMatrix*aNrm);',
    '  float rim = 1.0 - abs(dot(n, normalize(-mv.xyz)));',
    '  rim = rim*rim;',
    '  float h = clamp((position.y+1.25)/2.95, 0.0, 1.0);',
    '  vec3 ord = mix(vec3(0.15,0.58,0.42), vec3(0.62,0.81,0.71), h);',
    '  if (fract(aSeed*13.7) > 0.91) ord = vec3(0.90,0.75,0.48);',
    '  float sy = (position.y-uScan)*6.0;',
    '  float s = exp(-sy*sy);',
    '  float fl = 0.55 + 0.45*sin(uTime*2.6+aSeed*80.0);',
    '  vec3 cha = mix(vec3(0.44,0.41,0.36), vec3(0.68,0.54,0.33), step(0.8, fract(aSeed*5.3)))*fl;',
    '  float fade = smoothstep(-1.25, -0.45, position.y);',
    '  vCol = mix(cha, ord*(0.7+0.9*rim) + s*vec3(1.0,0.86,0.56), e);',
    '  vA = mix(0.42, fade*(0.28+0.72*rim) + s*0.55*fade, e);',
    '  float sz = mix(1.0+0.7*fract(aSeed*3.1), 0.9+0.7*rim, e);',
    '  gl_PointSize = uSize*sz*uPR*(9.0/-mv.z);',
    '  gl_Position = projectionMatrix*mv;',
    '}'
  ].join('\n');

  var DOT_FS = [
    'varying vec3 vCol; varying float vA;',
    'void main(){',
    '  float d = length(gl_PointCoord-0.5);',
    '  if (d > 0.5) discard;',
    '  gl_FragColor = vec4(vCol, smoothstep(0.5, 0.05, d)*vA);',
    '}'
  ].join('\n');

  var LINE_VS = [
    'attribute float aSeed; uniform float uTime; uniform float uO; varying float vA;',
    'void main(){',
    '  vA = uO*(0.3+0.7*(0.5+0.5*sin(uTime*1.7+aSeed*60.0)))*smoothstep(-1.2,-0.4,position.y);',
    '  gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);',
    '}'
  ].join('\n');

  var LINE_FS = [
    'uniform vec3 uCol; varying float vA;',
    'void main(){ gl_FragColor = vec4(uCol, vA); }'
  ].join('\n');

  var FLOW_VS = [
    'attribute float aSeed; uniform float uTime; uniform float uO; uniform float uPR; uniform float uSize;',
    'varying vec3 vCol; varying float vA;',
    'void main(){',
    '  float sp = 0.22 + 0.26*fract(aSeed*9.7);',
    '  float y = -1.15 + mod(aSeed*7.0 + uTime*sp, 2.8);',
    '  float ph = aSeed*40.0;',
    '  float rr = (0.04 + 0.2*fract(aSeed*3.3))*mix(1.0, 0.45, smoothstep(0.55, 0.75, y));',
    '  vec3 p = vec3(sin(y*2.3+ph)*rr, y, cos(y*1.7+ph)*rr*0.6 + 0.02);',
    '  vA = uO*smoothstep(-1.15,-0.6,y)*(1.0-smoothstep(1.3,1.6,y));',
    '  vCol = mix(vec3(0.3,0.85,0.6), vec3(0.95,0.8,0.5), smoothstep(0.2, 1.3, y));',
    '  vec4 mv = modelViewMatrix*vec4(p,1.0);',
    '  gl_PointSize = uSize*uPR*(9.0/-mv.z);',
    '  gl_Position = projectionMatrix*mv;',
    '}'
  ].join('\n');

  var ARC_VS = [
    'attribute float aU; varying float vU;',
    'void main(){ vU = aU; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }'
  ].join('\n');

  var ARC_FS = [
    'uniform float uHead; uniform float uArc; varying float vU;',
    'void main(){',
    '  float dt = uHead - vU;',
    '  float a = dt < 0.0 ? 0.0 : (0.10 + 0.75*exp(-dt*9.0))*uArc;',
    '  vec3 c = mix(vec3(0.35,0.72,0.56), vec3(0.95,0.8,0.52), exp(-dt*14.0));',
    '  gl_FragColor = vec4(c, a);',
    '}'
  ].join('\n');

  var FX_VS = [
    'attribute float aSize; attribute vec3 aCol; attribute float aAlpha; uniform float uPR;',
    'varying vec3 vCol; varying float vA;',
    'void main(){',
    '  vec4 mv = modelViewMatrix*vec4(position,1.0);',
    '  vA = aAlpha*mix(0.25, 1.0, smoothstep(-10.3, -8.4, mv.z));',
    '  vCol = aCol;',
    '  gl_PointSize = aSize*uPR*(9.0/-mv.z);',
    '  gl_Position = projectionMatrix*mv;',
    '}'
  ].join('\n');

  var FX_FS = [
    'varying vec3 vCol; varying float vA;',
    'void main(){',
    '  float d = length(gl_PointCoord-0.5)*2.0;',
    '  if (d > 1.0) discard;',
    '  float core = smoothstep(0.42, 0.0, d);',
    '  float glow = pow(1.0-d, 3.0);',
    '  gl_FragColor = vec4(vCol*(1.0+core*0.7), (core*0.95+glow*0.55)*vA);',
    '}'
  ].join('\n');

  var HALO_FS = [
    'uniform float uO; uniform vec3 uCol;',
    'void main(){',
    '  float d = length(gl_PointCoord-0.5)*2.0;',
    '  if (d > 1.0) discard;',
    '  float a = exp(-d*d*7.0)*0.8 + exp(-d*d*60.0)*0.6;',
    '  gl_FragColor = vec4(uCol, a*uO);',
    '}'
  ].join('\n');

  var HALO_VS = [
    'uniform float uPR; uniform float uSize;',
    'void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); gl_PointSize = uSize*uPR; gl_Position = projectionMatrix*mv; }'
  ].join('\n');

  /* ---------------- geometry: human bust as points ---------------- */

  function rnd() { return Math.random(); }

  function sph() {
    var x, y, z, l;
    do { x = rnd() * 2 - 1; y = rnd() * 2 - 1; z = rnd() * 2 - 1; l = x * x + y * y + z * z; } while (l > 1 || l < 1e-4);
    l = Math.sqrt(l);
    return [x / l, y / l, z / l];
  }

  function table(P, y) {
    if (y <= P[0][0]) return P[0][1];
    for (var i = 0; i < P.length - 1; i++) {
      if (y <= P[i + 1][0]) {
        var t = (y - P[i][0]) / (P[i + 1][0] - P[i][0]);
        t = t * t * (3 - 2 * t);
        return P[i][1] + (P[i + 1][1] - P[i][1]) * t;
      }
    }
    return P[P.length - 1][1];
  }

  /* signed-distance human bust, smoothly blended primitives */
  function sEll(px, py, pz, cx, cy, cz, rx, ry, rz) {
    var x = px - cx, y = py - cy, z = pz - cz;
    var k0 = Math.sqrt(x * x / (rx * rx) + y * y / (ry * ry) + z * z / (rz * rz));
    var k1 = Math.sqrt(x * x / (rx * rx * rx * rx) + y * y / (ry * ry * ry * ry) + z * z / (rz * rz * rz * rz));
    return k1 < 1e-6 ? -Math.min(rx, ry, rz) : k0 * (k0 - 1) / k1;
  }
  function sCap(px, py, pz, ax, ay, az, bx, by, bz, r) {
    var pax = px - ax, pay = py - ay, paz = pz - az, bax = bx - ax, bay = by - ay, baz = bz - az;
    var h = Math.max(0, Math.min(1, (pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz)));
    var dx = pax - bax * h, dy = pay - bay * h, dz = paz - baz * h;
    return Math.sqrt(dx * dx + dy * dy + dz * dz) - r;
  }
  function smin(a, b, k) { var h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; }
  function smax(a, b, k) { return -smin(-a, -b, k); }

  function sdf(x, y, z) {
    var ax = Math.abs(x);
    /* head + face */
    var hd = sEll(x, y, z, 0, 1.34, 0.0, 0.3, 0.37, 0.325);
    hd = smin(hd, sEll(x, y, z, 0, 1.13, 0.07, 0.21, 0.175, 0.22), 0.12);
    hd = smin(hd, sEll(x, y, z, 0, 1.25, 0.315, 0.04, 0.085, 0.06), 0.05);
    hd = smin(hd, sEll(ax, y, z, 0.285, 1.29, -0.01, 0.045, 0.085, 0.055), 0.04);
    hd = smax(hd, -sEll(ax, y, z, 0.11, 1.355, 0.305, 0.065, 0.04, 0.05), 0.04);
    /* neck + trapezius */
    var d = smin(hd, sCap(x, y, z, 0, 0.72, -0.03, 0, 1.12, -0.01, 0.12), 0.08);
    d = smin(d, sCap(x, y, z, -0.6, 0.55, -0.05, 0.6, 0.55, -0.05, 0.15), 0.22);
    /* chest, abdomen, pecs */
    var t = sEll(x, y, z, 0, 0.14, 0, 0.64, 0.56, 0.3);
    t = smin(t, sEll(x, y, z, 0, -0.75, -0.01, 0.55, 0.8, 0.27), 0.3);
    t = smin(t, sEll(ax, y, z, 0.26, 0.24, 0.13, 0.25, 0.17, 0.15), 0.12);
    d = smin(d, t, 0.2);
    /* shoulders + arms */
    d = smin(d, sEll(ax, y, z, 0.72, 0.42, -0.01, 0.2, 0.24, 0.2), 0.14);
    d = smin(d, sCap(ax, y, z, 0.79, 0.36, -0.02, 0.86, -1.5, -0.04, 0.135), 0.1);
    return d;
  }

  function buildBody(N) {
    var tgt = new Float32Array(N * 3), nrm = new Float32Array(N * 3), cha = new Float32Array(N * 3);
    var seed = new Float32Array(N), del = new Float32Array(N);
    var i = 0, e = 0.002, guard = 0;
    while (i < N && guard < N * 60) {
      guard++;
      var x = (rnd() * 2 - 1) * 1.08, y = -1.32 + rnd() * 3.08, z = (rnd() * 2 - 1) * 0.5;
      var d = sdf(x, y, z);
      if (Math.abs(d) > 0.05) continue;
      var gx = 0, gy = 0, gz = 0, ok = false;
      for (var it = 0; it < 6; it++) {
        d = sdf(x, y, z);
        gx = sdf(x + e, y, z) - sdf(x - e, y, z);
        gy = sdf(x, y + e, z) - sdf(x, y - e, z);
        gz = sdf(x, y, z + e) - sdf(x, y, z - e);
        var gl = Math.sqrt(gx * gx + gy * gy + gz * gz) || 1;
        gx /= gl; gy /= gl; gz /= gl;
        x -= gx * d; y -= gy * d; z -= gz * d;
        if (Math.abs(d) < 0.0015) { ok = true; break; }
      }
      if (!ok || y < -1.3) continue;
      var jj = rnd() * 0.022;
      tgt[i * 3] = x - gx * jj; tgt[i * 3 + 1] = y - gy * jj; tgt[i * 3 + 2] = z - gz * jj;
      nrm[i * 3] = gx; nrm[i * 3 + 1] = gy; nrm[i * 3 + 2] = gz;
      i++;
    }
    N = i;
    for (var q = 0; q < N; q++) {
      var s = sph(), r = 1.75 * Math.cbrt(rnd());
      cha[q * 3] = s[0] * r; cha[q * 3 + 1] = 0.2 + s[1] * r * 0.95; cha[q * 3 + 2] = s[2] * r * 0.8;
      seed[q] = rnd();
      var hy = Math.min(1, Math.max(0, (tgt[q * 3 + 1] + 1.25) / 2.95));
      del[q] = 0.62 * (1 - hy) + 0.38 * rnd();
    }
    return { tgt: tgt, nrm: nrm, cha: cha, seed: seed, del: del, n: N };
  }

  function buildLinks(tgt, N, M) {
    var step = Math.max(1, Math.floor(N / M)), idx = [];
    for (var i = 0; i < N; i += step) idx.push(i);
    var pos = [], sd = [];
    for (var a = 0; a < idx.length; a++) {
      var ia = idx[a] * 3, found = 0;
      for (var b = a + 1; b < idx.length && found < 2; b++) {
        var ib = idx[b] * 3;
        var dx = tgt[ia] - tgt[ib], dy = tgt[ia + 1] - tgt[ib + 1], dz = tgt[ia + 2] - tgt[ib + 2];
        var dd = dx * dx + dy * dy + dz * dz;
        if (dd < 0.03 && dd > 0.004) {
          pos.push(tgt[ia], tgt[ia + 1], tgt[ia + 2], tgt[ib], tgt[ib + 1], tgt[ib + 2]);
          var s = rnd(); sd.push(s, s); found++;
        }
      }
    }
    return { pos: new Float32Array(pos), seed: new Float32Array(sd) };
  }

  function ease(t) { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); }
  function easeIO(t) { t = Math.min(1, Math.max(0, t)); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  /* ---------------- timeline ---------------- */
  var NS = STAGES.length, DW0 = 1.4, STEP = 2.3, HOLD = 3.4, RET = 2.6;
  var TRAVEL = STEP * (NS - 1), CYCLE = DW0 + TRAVEL + HOLD + RET;

  function timeline(c) {
    var u, p, scan = -9, arc = 1, phase;
    if (c < DW0) { u = 0; p = 0; phase = 0; }
    else if (c < DW0 + TRAVEL) {
      var s = (c - DW0) / STEP, i = Math.floor(s), f = easeIO((s - i) / 0.66);
      u = (i + f) / NS; p = (i + f) / (NS - 1); phase = 1;
    } else if (c < DW0 + TRAVEL + HOLD) {
      u = (NS - 1) / NS; p = 1; phase = 2;
      scan = -1.4 + ((c - DW0 - TRAVEL) / HOLD) * 3.4;
    } else {
      var g = ease((c - DW0 - TRAVEL - HOLD) / RET);
      u = (NS - 1 + g) / NS; p = 1 - g; arc = 1 - g; phase = 3;
    }
    return { u: u, p: p, scan: scan, arc: arc, phase: phase };
  }

  /* ---------------- mount ---------------- */

  function mount(root) {
    if (root.__sxhcs) return root.__sxhcs;
    injectCSS();
    var T = window.THREE;
    root.classList.add('sx-hcs');
    root.setAttribute('role', 'img');
    root.setAttribute('aria-label', 'Human Capability System: a human figure moves from scattered entropy to ordered syntropy as the loop advances through Assess, Diagnose, Develop, Practice, Coach, Apply and Measure.');
    root.innerHTML = '<div class="sx-stage"><canvas aria-hidden="true"></canvas><div class="sx-labels" aria-hidden="true"></div></div>' +
      '<div class="sx-foot"><p class="sx-title">Human Capability System</p>' +
      '<div class="sx-meter" aria-hidden="true"><span>Entropy</span><i><b></b></i><span>Syntropy</span></div></div>';

    var stage = root.querySelector('.sx-stage'), canvas = root.querySelector('canvas');
    var labelsEl = root.querySelector('.sx-labels'), bar = root.querySelector('.sx-meter b');

    if (!T) { root.classList.add('sx-nogl'); return null; }
    var renderer;
    try { renderer = new T.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'high-performance' }); }
    catch (e) { root.classList.add('sx-nogl'); return null; }
    renderer.setClearColor(0x000000, 0);

    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var small = (root.clientWidth || 600) < 480;
    var N = small ? 8000 : 15000;
    var CY = 0.15, R = 1.95, A0 = 125 * Math.PI / 180;

    var scene = new T.Scene();
    var camera = new T.PerspectiveCamera(32, 1, 0.1, 60);
    camera.position.set(0, CY, 9); camera.lookAt(0, CY, 0);

    /* body */
    var B = buildBody(N); N = B.n;
    var body = new T.Group(); body.position.y = -0.03; scene.add(body);
    var bg = new T.BufferGeometry();
    bg.setAttribute('position', new T.BufferAttribute(B.tgt, 3));
    bg.setAttribute('aChaos', new T.BufferAttribute(B.cha, 3));
    bg.setAttribute('aNrm', new T.BufferAttribute(B.nrm, 3));
    bg.setAttribute('aSeed', new T.BufferAttribute(B.seed, 1));
    bg.setAttribute('aDelay', new T.BufferAttribute(B.del, 1));
    var bodyMat = new T.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uP: { value: 0 }, uPR: { value: 1 }, uSize: { value: 2.4 }, uScan: { value: -9 } },
      vertexShader: BODY_VS, fragmentShader: DOT_FS, transparent: true, depthWrite: false, blending: T.AdditiveBlending
    });
    var bodyPts = new T.Points(bg, bodyMat); bodyPts.frustumCulled = false; body.add(bodyPts);

    /* neural links (appear when ordered) */
    var L = buildLinks(B.tgt, N, small ? 900 : 1500);
    var lg = new T.BufferGeometry();
    lg.setAttribute('position', new T.BufferAttribute(L.pos, 3));
    lg.setAttribute('aSeed', new T.BufferAttribute(L.seed, 1));
    var linkMat = new T.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uO: { value: 0 }, uCol: { value: new T.Color(0x3fbf8c) } },
      vertexShader: LINE_VS, fragmentShader: LINE_FS, transparent: true, depthWrite: false, blending: T.AdditiveBlending
    });
    var links = new T.LineSegments(lg, linkMat); links.frustumCulled = false; body.add(links);

    /* inner rising energy */
    var FN = small ? 140 : 240, fs = new Float32Array(FN);
    for (var f = 0; f < FN; f++) fs[f] = rnd();
    var fg = new T.BufferGeometry();
    fg.setAttribute('position', new T.BufferAttribute(new Float32Array(FN * 3), 3));
    fg.setAttribute('aSeed', new T.BufferAttribute(fs, 1));
    var flowMat = new T.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uO: { value: 0 }, uPR: { value: 1 }, uSize: { value: 3 } },
      vertexShader: FLOW_VS, fragmentShader: DOT_FS, transparent: true, depthWrite: false, blending: T.AdditiveBlending
    });
    var flow = new T.Points(fg, flowMat); flow.frustumCulled = false; body.add(flow);

    /* heart nucleus */
    var hg = new T.BufferGeometry();
    hg.setAttribute('position', new T.BufferAttribute(new Float32Array([0, 0.2, 0.12]), 3));
    var haloMat = new T.ShaderMaterial({
      uniforms: { uO: { value: 0 }, uPR: { value: 1 }, uSize: { value: 150 }, uCol: { value: new T.Color(0.55, 0.78, 0.6) } },
      vertexShader: HALO_VS, fragmentShader: HALO_FS, transparent: true, depthWrite: false, blending: T.AdditiveBlending
    });
    var halo = new T.Points(hg, haloMat); halo.frustumCulled = false; scene.add(halo);

    /* stage ring */
    function ringPt(u) { var a = A0 - u * Math.PI * 2; return [R * Math.cos(a), CY + R * Math.sin(a), 0]; }
    var RS = 420, rp = new Float32Array((RS + 1) * 3), ru = new Float32Array(RS + 1);
    for (var k = 0; k <= RS; k++) { var pt = ringPt(k / RS); rp.set(pt, k * 3); ru[k] = k / RS; }
    var ringG = new T.BufferGeometry(); ringG.setAttribute('position', new T.BufferAttribute(rp, 3));
    scene.add(new T.Line(ringG, new T.LineBasicMaterial({ color: 0xd6b67a, transparent: true, opacity: 0.15, depthWrite: false })));
    var arcG = new T.BufferGeometry();
    arcG.setAttribute('position', new T.BufferAttribute(rp, 3));
    arcG.setAttribute('aU', new T.BufferAttribute(ru, 1));
    var arcMat = new T.ShaderMaterial({
      uniforms: { uHead: { value: 0 }, uArc: { value: 1 } }, vertexShader: ARC_VS, fragmentShader: ARC_FS,
      transparent: true, depthWrite: false, blending: T.AdditiveBlending
    });
    scene.add(new T.Line(arcG, arcMat));

    /* atom orbits around the heart */
    var NUC = new T.Vector3(0, 0.2, 0);
    var ORB = [
      { r: 1.32, tau: 1.30, rho: 0, w: 0.55, col: [0.25, 0.80, 0.57] },
      { r: 1.52, tau: 1.24, rho: 1.05, w: -0.42, col: [0.64, 0.82, 0.72] },
      { r: 1.52, tau: 1.24, rho: -1.05, w: 0.36, col: [0.92, 0.77, 0.50] }
    ];
    var circ = [];
    for (var c = 0; c < 160; c++) { var aa = c / 160 * Math.PI * 2; circ.push(Math.cos(aa), 0, Math.sin(aa)); }
    var circArr = new Float32Array(circ);
    ORB.forEach(function (o) {
      o.obj = new T.Object3D(); o.obj.position.copy(NUC);
      var g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(circArr, 3));
      var line = new T.LineLoop(g, new T.LineBasicMaterial({ color: 0x8fb8a2, transparent: true, opacity: 0.075, depthWrite: false }));
      line.scale.setScalar(o.r);
      o.obj.add(line); scene.add(o.obj);
    });

    /* dynamic dots: stage nodes + electrons with trails */
    var E = [{ kind: 'lead', K: 30, size: 17, col: [0.95, 0.80, 0.52], step: 0.0042 }];
    [[0.031, 0.0], [-0.024, 0.37], [0.019, 0.71]].forEach(function (s) { E.push({ kind: 'ring', sp: s[0], off: s[1], K: 12, size: 9, col: [0.64, 0.82, 0.72], step: 0.0045 }); });
    ORB.forEach(function (o, n) { E.push({ kind: 'orb', o: o, ph: n * 2.1, K: 18, size: 11, col: o.col, step: 0.05 }); });
    var M = NS;
    E.forEach(function (e) { e.start = M; M += e.K; });
    var fxPos = new Float32Array(M * 3), fxSize = new Float32Array(M), fxCol = new Float32Array(M * 3), fxA = new Float32Array(M);
    var fxG = new T.BufferGeometry();
    var aPos = new T.BufferAttribute(fxPos, 3), aSize = new T.BufferAttribute(fxSize, 1), aCol = new T.BufferAttribute(fxCol, 3), aA = new T.BufferAttribute(fxA, 1);
    [aPos, aSize, aCol, aA].forEach(function (a) { a.setUsage(T.DynamicDrawUsage); });
    fxG.setAttribute('position', aPos); fxG.setAttribute('aSize', aSize); fxG.setAttribute('aCol', aCol); fxG.setAttribute('aAlpha', aA);
    var fxMat = new T.ShaderMaterial({
      uniforms: { uPR: { value: 1 } }, vertexShader: FX_VS, fragmentShader: FX_FS,
      transparent: true, depthWrite: false, blending: T.AdditiveBlending
    });
    var fx = new T.Points(fxG, fxMat); fx.frustumCulled = false; scene.add(fx);

    var nodes = STAGES.map(function (_, n) { return ringPt(n / NS); });

    /* labels */
    var pills = STAGES.map(function (name) {
      var el = document.createElement('div');
      el.className = 'sx-pill';
      el.innerHTML = '<i></i><span>' + name + '</span>';
      labelsEl.appendChild(el);
      return el;
    });
    var pillState = STAGES.map(function () { return ''; });

    /* sizing */
    var W = 1, H = 1, SC = 1, PR = 1;
    function resize() {
      W = stage.clientWidth || 1; H = stage.clientHeight || 1;
      PR = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(PR); renderer.setSize(W, H, false);
      camera.aspect = W / H; camera.updateProjectionMatrix();
      SC = W / 600;
      bodyMat.uniforms.uPR.value = PR; bodyMat.uniforms.uSize.value = Math.max(1.5, Math.min(3.0, 2.5 * SC));
      flowMat.uniforms.uPR.value = PR; flowMat.uniforms.uSize.value = 3.2 * SC;
      haloMat.uniforms.uPR.value = PR; haloMat.uniforms.uSize.value = 170 * SC;
      fxMat.uniforms.uPR.value = PR;
      if (!running) render(lastT);
    }

    /* pointer parallax */
    var mx = 0, my = 0, cx = 0, cyy = 0;
    function onMove(ev) {
      var r = stage.getBoundingClientRect();
      mx = Math.max(-1, Math.min(1, (ev.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      my = Math.max(-1, Math.min(1, (ev.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
    }
    if (!reduce) window.addEventListener('pointermove', onMove, { passive: true });

    var v3 = new T.Vector3(), tmp = new T.Vector3();
    var lastP = -1, lastT = 0;

    function setDot(j, p, size, col, a) {
      fxPos[j * 3] = p[0]; fxPos[j * 3 + 1] = p[1]; fxPos[j * 3 + 2] = p[2];
      fxSize[j] = size * SC; fxCol[j * 3] = col[0]; fxCol[j * 3 + 1] = col[1]; fxCol[j * 3 + 2] = col[2]; fxA[j] = a;
    }

    function render(t) {
      var st = reduce ? { u: (NS - 1) / NS, p: 1, scan: -9, arc: 1, phase: 2 } : timeline(t % CYCLE);
      var uN = st.u * NS;

      /* camera parallax */
      cx += (mx * 0.42 - cx) * 0.04; cyy += (-my * 0.28 - cyy) * 0.04;
      camera.position.set(cx, CY + cyy, 9); camera.lookAt(0, CY, 0);

      /* body */
      body.rotation.y = reduce ? 0.35 : Math.sin(t * 0.21) * 0.45;
      body.rotation.x = reduce ? 0 : Math.sin(t * 0.13) * 0.035;
      bodyMat.uniforms.uTime.value = t; bodyMat.uniforms.uP.value = st.p; bodyMat.uniforms.uScan.value = st.scan;
      var ord = Math.pow(Math.max(0, (st.p - 0.75) / 0.25), 1.5);
      linkMat.uniforms.uTime.value = t; linkMat.uniforms.uO.value = ord * 0.16;
      flowMat.uniforms.uTime.value = t; flowMat.uniforms.uO.value = Math.pow(st.p, 3) * 0.9;
      haloMat.uniforms.uO.value = (0.08 + 0.55 * st.p) * (0.82 + 0.18 * Math.sin(t * 2.1));
      haloMat.uniforms.uCol.value.setRGB(0.42 + 0.4 * st.p, 0.62 + 0.15 * st.p, 0.5 - 0.02 * st.p);

      /* ring arc */
      arcMat.uniforms.uHead.value = st.u; arcMat.uniforms.uArc.value = st.arc;

      /* stage nodes */
      for (var n = 0; n < NS; n++) {
        var done = n <= uN + 0.02 && st.phase !== 3 || (st.phase === 3 && st.arc > 0.5 && n <= uN);
        var on = Math.abs(uN - n) < 0.12 && st.phase !== 3;
        var pulse = on ? 1 + 0.25 * Math.sin(t * 5) : 1;
        setDot(n, nodes[n], on ? 16 * pulse : (done ? 8 : 6), on ? [0.95, 0.8, 0.52] : (done ? [0.25, 0.75, 0.55] : [0.55, 0.5, 0.42]), on ? 1 : (done ? 0.8 : 0.45));
        var cls = on ? 'is-on' : (done ? 'is-done' : '');
        if (reduce) cls = 'is-done';
        if (cls !== pillState[n]) { pills[n].className = 'sx-pill ' + cls; pillState[n] = cls; }
      }

      /* electrons */
      ORB.forEach(function (o) { o.obj.rotation.set(o.tau, 0, o.rho + t * 0.035, 'ZXY'); o.obj.updateMatrixWorld(); });
      E.forEach(function (e) {
        for (var q = 0; q < e.K; q++) {
          var p, fall = Math.pow(1 - q / e.K, 1.6);
          if (e.kind === 'lead') {
            var uu = st.u - q * e.step;
            p = ringPt(uu);
            setDot(e.start + q, p, e.size * (q === 0 ? 1 : 0.55 * fall + 0.15), e.col, (q === 0 ? 1 : 0.7 * fall) * (0.35 + 0.65 * st.arc));
          } else if (e.kind === 'ring') {
            p = ringPt(t * e.sp + e.off - q * e.step * (e.sp < 0 ? -1 : 1));
            setDot(e.start + q, p, e.size * (q === 0 ? 1 : 0.5 * fall + 0.1), e.col, q === 0 ? 0.75 : 0.45 * fall);
          } else {
            var ph = t * e.o.w + e.ph - q * e.step * (e.o.w < 0 ? -1 : 1);
            v3.set(Math.cos(ph) * e.o.r, 0, Math.sin(ph) * e.o.r).applyMatrix4(e.o.obj.matrixWorld);
            setDot(e.start + q, [v3.x, v3.y, v3.z], e.size * (q === 0 ? 1 : 0.5 * fall + 0.1), e.col, q === 0 ? 0.95 : 0.55 * fall);
          }
        }
      });
      aPos.needsUpdate = aSize.needsUpdate = aCol.needsUpdate = aA.needsUpdate = true;

      renderer.render(scene, camera);

      /* labels follow projected nodes */
      for (var m = 0; m < NS; m++) {
        tmp.set(nodes[m][0], nodes[m][1], nodes[m][2]).project(camera);
        var x = (tmp.x * 0.5 + 0.5) * W, y = (-tmp.y * 0.5 + 0.5) * H;
        pills[m].style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) translate(-50%,-50%)';
      }
      if (Math.abs(st.p - lastP) > 0.004) { bar.style.transform = 'scaleX(' + st.p.toFixed(3) + ')'; lastP = st.p; }
    }

    /* loop */
    var running = false, visible = true, raf = 0, clock = 0, prev = 0;
    function tick(now) {
      if (!running) return;
      var dt = prev ? Math.min(0.05, (now - prev) / 1000) : 0.016;
      prev = now; clock += dt; lastT = clock;
      render(clock);
      raf = requestAnimationFrame(tick);
    }
    function start() { if (running || reduce) return; running = true; prev = 0; raf = requestAnimationFrame(tick); }
    function stop() { running = false; cancelAnimationFrame(raf); }
    function sync() { (visible && !document.hidden) ? start() : stop(); }

    var ro = new ResizeObserver(resize); ro.observe(stage);
    var io = new IntersectionObserver(function (en) { visible = en[0].isIntersecting; sync(); }, { threshold: 0.01 });
    io.observe(root);
    document.addEventListener('visibilitychange', sync);
    resize();
    if (reduce) render(6); else sync();

    var api = {
      destroy: function () {
        stop(); ro.disconnect(); io.disconnect();
        document.removeEventListener('visibilitychange', sync);
        window.removeEventListener('pointermove', onMove);
        renderer.dispose(); root.__sxhcs = null;
      }
    };
    root.__sxhcs = api;
    return api;
  }

  window.SyntropixHCS = { mount: mount };
  function auto() { document.querySelectorAll('[data-syntropix-hcs]').forEach(mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();
})();