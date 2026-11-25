/*
 * buket untuk Bibiy, dari Emir.
 *
 * versi web dari bouqet.py: buket 3D yang digambar dari huruf, mekar satu per satu,
 * berputar, lalu mengetik pesan di bawahnya.
 *
 * tombol:  spasi = jeda putaran  |  + / - = cepat / lambat  |  r = putar balik  |  n / klik / ketuk = pesan berikutnya
 */
"use strict";

(() => {
  // ------------------------------------------------------------------ tulisan
  // ganti kalimat di sini kalau mau. jaga tanda kutip dan komanya ya.
  const TO_NAME = "Bibiy";
  const FROM_NAME = "Emir";
  const SIGNATURE = "dirangkai pelan-pelan, khusus buat kamu — " + FROM_NAME + " ♥";
  const MESSAGES = [
    "Bibiy, kalau setiap kali aku mikirin kamu tumbuh satu bunga, mungkin dunia udah jadi taman ungu sekarang.",
    "Buket ini nggak akan pernah layu, sama kayak sayangku ke kamu.",
    "Aku pilih ungu karena itu warna favoritmu. Dan aku pilih kamu karena kamu favoritku.",
    "Terima kasih udah jadi bagian paling indah dari hari-hariku.",
    "",
  ];

  // ------------------------------------------------------------------ pengaturan
  const FPS = 30;
  const SPIN_SPEED = 0.55;
  const TILT = 0.3;
  const CAM_DIST = 4.0;
  const INTRO = true;

  const NUM_HEARTS = 16;
  const NUM_PETALS = 26;
  const TYPE_CPS = 28.0;
  const HEART = "♥";

  // ------------------------------------------------------------------ warna (kode 256 warna terminal, gelap -> terang)
  const DAISY_WHITE = [244, 248, 251, 254, 255, 231];
  const ASTER = [54, 97, 103, 140, 183, 189];
  const ROSE_VIOLET = [53, 91, 92, 128, 134, 171, 177];
  const ROSE_PLUM = [53, 90, 127, 133, 170, 176, 182];
  const ROSE_DEEP = [53, 54, 55, 92, 98, 135, 141];
  const ROSE_LILAC = [96, 97, 140, 146, 183, 189, 231];
  const ROSE_LAV = [54, 97, 103, 140, 147, 183, 189];
  const CONE_PETAL = [54, 91, 98, 135, 141, 183];
  const CONE_CENTER = [52, 58, 94, 94, 130, 136];
  const GOLD_CENTER = [94, 136, 178, 214, 220];
  const SAKURA_LILAC = [96, 133, 139, 176, 182, 219, 225];
  const SAKURA_CENTER = [53, 90, 127, 170, 213];
  const LILY_LILAC = [96, 133, 176, 182, 219, 225];
  const LILY_WHITE = [103, 146, 189, 225, 231, 231];
  const LILY_CENTER = [100, 136, 172, 214, 220];
  const TULIP_PURPLE = [54, 91, 97, 134, 140, 183];
  const TULIP_DEEP = [53, 54, 55, 92, 98, 141];
  const TULIP_LILAC = [97, 140, 141, 183, 189, 225];
  const TULIP_WHITE = [103, 146, 189, 254, 255, 231];
  const PERIWINKLE = [55, 61, 62, 99, 105, 141, 147];
  const LAVENDER = [54, 55, 97, 98, 134, 140, 183];
  const GREENS = [22, 28, 28, 34, 35, 71, 77, 114];
  const EUCALYPTUS = [22, 28, 29, 35, 65, 72, 107, 108, 114];
  const CORE_GREEN = [22, 22, 23, 28, 29, 34];
  const PAPER_PURPLE = [54, 91, 97, 134, 140, 177, 183];
  const PAPER_LAV = [97, 103, 140, 146, 183, 189, 225];
  const PAPER_CUFF = [103, 146, 182, 189, 225, 231];
  const TISSUE = [96, 139, 176, 182, 219, 225, 231];
  const TISSUE_LAV = [97, 103, 140, 147, 183, 189, 225];
  const RIBBON = [53, 54, 91, 92, 128, 134, 177, 219];
  const HEART_PRINT = [90, 127, 170, 213];
  const TWINE = [94, 137, 180, 223];
  const TAG_PAL = [137, 180, 187, 223, 230, 231];
  const CUT_END = [151, 187, 230];
  const HEART_COLORS = [134, 135, 170, 171, 177, 213];
  const PETAL_COLORS = [140, 141, 176, 177, 182, 183, 219];
  const MSG_COLORS = [134, 135, 141, 177, 183, 189, 183, 177, 141, 135];

  const SHADE = ".:-=+*%@";
  const PETAL_SHADE = ".:+*#%";
  const CORE_SHADE = ".:-=+*";
  const PETAL_CHARS = ",'`.";

  // ------------------------------------------------------------------ geometri
  const PIVOT_Y = 0.22;
  const TOP_Y = 1.06;
  const TWO_PI = 2 * Math.PI;
  const INV_2PI = 1.0 / TWO_PI;
  const AMBIENT = 0.34;

  const [LX, LY, LZ] = norm([-0.45, 0.6, 0.66]);

  const CEN = [0.0, 0.14, 0.0];
  const DOME = 0.68;
  const CORE_R = 0.5;
  const NECK = [0.0, -0.1, 0.0];
  const STEM_CUT = 0.24;

  const Y0 = -0.3, Y1 = 0.3, R0 = 0.05, R1 = 0.44;
  const KC = (R1 - R0) / (Y1 - Y0);
  const BY = -0.06;

  const ROSE = 0, SUN = 1, DAISY = 2, SAKURA = 3, LILY = 4, TULIP = 5, HYDRA = 6;
  const RADIAL = { [ROSE]: 1.0, [SUN]: 0.99, [DAISY]: 0.98, [SAKURA]: 1.0, [LILY]: 1.04, [TULIP]: 1.1, [HYDRA]: 0.96 };

  // centre radius, base brightness, slope, cup, petal count, centre palette
  const SPEC = {
    [ROSE]: [0.0, 0.5, 0.0, 0.45, 0, null],
    [SUN]: [0.46, 0.5, 0.2, 0.1, 18, CONE_CENTER],
    [DAISY]: [0.3, 0.62, 0.15, 0.1, 13, GOLD_CENTER],
    [SAKURA]: [0.13, 0.56, 0.35, 0.05, 5, SAKURA_CENTER],
    [LILY]: [0.15, 0.5, 0.5, 0.1, 6, LILY_CENTER],
  };
  const NTAB = 96;

  const LEAF_OFFS = [[-0.7, 0.0], [-0.3, -0.45], [-0.3, 0.0], [-0.3, 0.45],
    [0.1, -0.5], [0.1, 0.0], [0.1, 0.5], [0.5, 0.0]];

  // ------------------------------------------------------------------ helper
  function norm(v) {
    const m = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1.0;
    return [v[0] / m, v[1] / m, v[2] / m];
  }
  function cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }
  function basis(axis) {
    const helper = Math.abs(axis[1]) < 0.9 ? [0.0, 1.0, 0.0] : [1.0, 0.0, 0.0];
    const u = norm(cross(helper, axis));
    return [u, cross(axis, u)];
  }
  function add(p, d, k) {
    return [p[0] + d[0] * k, p[1] + d[1] * k, p[2] + d[2] * k];
  }
  function dist(a, b) {
    return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  }
  function clamp01(b) {
    return b < 0 ? 0 : b > 0.999 ? 0.999 : b;
  }
  function pmod(a, m) {
    const r = a % m;
    return r < 0 ? r + m : r;
  }
  const trunc = Math.trunc;

  function easeOutBack(x) {
    x = Math.min(1.0, Math.max(0.0, x));
    const c1 = 1.70158, c3 = c1 + 1.0;
    return 1.0 + c3 * (x - 1.0) ** 3 + c1 * (x - 1.0) ** 2;
  }
  function rot(v, ca, sa, ct, st) {
    const xr = v[0] * ca - v[2] * sa;
    const zr = v[0] * sa + v[2] * ca;
    return [xr, v[1] * ct - zr * st, v[1] * st + zr * ct];
  }
  function coneR(y) {
    return Math.max(R0, R0 + KC * (y - Y0));
  }
  function onCone(xo, y, lift) {
    const rad = coneR(y);
    const phi = Math.max(-1.5, Math.min(1.5, xo / rad));
    const sp = Math.sin(phi), cp = Math.cos(phi);
    return [rad * sp, rad * cp + lift, norm([sp, -KC, cp])];
  }

  // seeded random so the bouquet always looks the same
  function makeRng(seed) {
    let a = seed >>> 0;
    const random = () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    return {
      random,
      uniform: (lo, hi) => lo + (hi - lo) * random(),
      gauss: () => {
        const u = 1 - random(), v = random();
        return Math.sqrt(-2 * Math.log(u)) * Math.cos(TWO_PI * v);
      },
      choice: (seq) => seq[Math.floor(random() * seq.length)],
    };
  }
  const choice = (seq) => seq[Math.floor(Math.random() * seq.length)];
  const uniform = (lo, hi) => lo + (hi - lo) * Math.random();

  // xterm 256-colour code -> css colour
  const XTERM = (() => {
    const base = ["#000000", "#800000", "#008000", "#808000", "#000080", "#800080", "#008080", "#c0c0c0",
      "#808080", "#ff0000", "#00ff00", "#ffff00", "#0000ff", "#ff00ff", "#00ffff", "#ffffff"];
    const out = base.slice();
    const lv = [0, 95, 135, 175, 215, 255];
    const hex = (n) => n.toString(16).padStart(2, "0");
    for (let i = 16; i < 232; i++) {
      const k = i - 16;
      out.push("#" + hex(lv[Math.floor(k / 36)]) + hex(lv[Math.floor(k / 6) % 6]) + hex(lv[k % 6]));
    }
    for (let i = 232; i < 256; i++) {
      const g = 8 + (i - 232) * 10;
      out.push("#" + hex(g) + hex(g) + hex(g));
    }
    return out;
  })();

  // ------------------------------------------------------------------ bunga
  function petalTables(kind, petals) {
    const reach = new Float32Array(NTAB), tone = new Float32Array(NTAB);
    for (let i = 0; i < NTAB; i++) {
      const ph = ((i + 0.5) / NTAB) * TWO_PI;
      let r = 1.0, tn = 0.0;
      if (kind === ROSE) {
        r = 0.9 + 0.1 * Math.cos(5 * ph);
      } else if (kind === DAISY || kind === SUN) {
        const c = Math.abs(Math.cos((petals * ph) / 2));
        r = kind === DAISY ? 0.34 + 0.66 * c ** 1.2 : 0.52 + 0.48 * c ** 0.7;
        tn = 0.14 * (c - 0.5);
      } else if (kind === SAKURA) {
        const pa = pmod((ph * 5) / TWO_PI, 1.0);
        r = 0.64 + 0.36 * Math.max(0.0, Math.sin(Math.PI * pa)) ** 0.6;
        const dn = Math.abs(pa - 0.5);
        if (dn < 0.07) r -= 0.18 * (1 - dn / 0.07);
        tn = -0.2 * Math.exp(-(((pa - 0.5) / 0.09) ** 2));
      } else if (kind === LILY) {
        r = 0.28 + 0.72 * Math.abs(Math.cos(3 * ph)) ** 1.6;
        tn = -0.22 * Math.exp(-((Math.sin(3 * ph) / 0.22) ** 2));
      }
      reach[i] = r;
      tone[i] = tn;
    }
    return [reach, tone];
  }

  function makeFlower(kind, pos, axis, pal, R, seed, delay) {
    const [u, v] = basis(axis);
    const [cr, base, slope, cup, petals, cpal] = SPEC[kind] || [0.0, 0.5, 0.0, 0.0, 0, null];
    const [reach, tone] = petalTables(kind, petals);
    return { kind, pos, axis, pal, R, seed, delay, u, v, cr, base, slope, cup, cpal, reach, tone };
  }

  // ------------------------------------------------------------------ scene
  function buildScene(density) {
    const rnd = makeRng(21);
    const K = Math.max(0.6, Math.min(1.6, density));
    const n1 = (n) => Math.max(3, trunc(n * K));
    const pts = [];
    const P = (x, y, z, n, pal, tone = 0.0, two = true, ov = null, zb = 0.0) => {
      pts.push([x, y, z, n[0], n[1], n[2], pal, tone, two, ov, zb]);
    };

    // campuran bunga: ungu semua, dengan sedikit aksen putih dan lilac
    const wish = [];
    for (const pal of [ROSE_VIOLET, ROSE_LAV, ROSE_PLUM, ROSE_DEEP, ROSE_LILAC, ROSE_VIOLET, ROSE_PLUM, ROSE_LAV]) {
      wish.push([ROSE, pal, 0.175]);
    }
    wish.push([SUN, CONE_PETAL, 0.21], [SUN, CONE_PETAL, 0.2]);
    for (const pal of [LILY_LILAC, LILY_WHITE, LILY_LILAC]) wish.push([LILY, pal, 0.185]);
    for (let i = 0; i < 5; i++) wish.push([SAKURA, SAKURA_LILAC, 0.135]);
    for (const pal of [DAISY_WHITE, ASTER, DAISY_WHITE, ASTER, DAISY_WHITE]) wish.push([DAISY, pal, 0.125]);
    for (const pal of [TULIP_PURPLE, TULIP_DEEP, TULIP_LILAC, TULIP_WHITE]) wish.push([TULIP, pal, 0.13]);
    for (let i = 0; i < 3; i++) wish.push([HYDRA, PERIWINKLE, 0.11]);

    const placed = [], slots = [];
    const shi = Math.sin((86 * Math.PI) / 180);
    const order = wish.map((_, i) => i).sort((a, b) => wish[b][2] - wish[a][2]);
    for (const idx of order) {
      const [kind, pal, R] = wish[idx];
      const slo = Math.sin(((kind === TULIP ? 40 : 12) * Math.PI) / 180);
      let factor = 0.82, pos = null, d = null;
      for (let attempt = 0; attempt < 480; attempt++) {
        if (attempt && attempt % 80 === 0) factor *= 0.92;
        const s = rnd.uniform(slo, shi);
        const c = Math.sqrt(1 - s * s);
        const az = rnd.uniform(0, TWO_PI);
        d = [c * Math.cos(az), s, c * Math.sin(az)];
        pos = add(CEN, d, DOME * RADIAL[kind] * rnd.uniform(0.97, 1.04));
        if (placed.every(([q, Rq]) => dist(pos, q) >= factor * (R + Rq))) break;
      }
      placed.push([pos, R]);
      slots.push([kind, pal, R, pos, d]);
    }
    slots.sort((a, b) => a[4][1] - b[4][1]);

    const flowers = [];
    slots.forEach(([kind, pal, R, pos, d], rank) => {
      const axis = norm([d[0] + rnd.uniform(-0.18, 0.18), d[1] + rnd.uniform(-0.08, 0.2), d[2] + rnd.uniform(-0.18, 0.18)]);
      const base = add(pos, axis, -0.03);
      if (base[1] > STEM_CUT) {
        const tcut = (base[1] - STEM_CUT) / (base[1] - NECK[1]);
        const ns = n1(22);
        for (let j = 0; j < ns; j++) {
          const tt = (tcut * j) / (ns - 1);
          P(base[0] + (NECK[0] - base[0]) * tt, base[1] + (NECK[1] - base[1]) * tt,
            base[2] + (NECK[2] - base[2]) * tt, [axis[0], 0.0, axis[2]], GREENS, -0.25);
        }
      }
      if (kind === HYDRA) {
        for (let i = 0; i < n1(70); i++) {
          const v = norm([rnd.gauss(), rnd.gauss(), rnd.gauss()]);
          const q = add(pos, v, R * rnd.uniform(0.78, 1.0));
          P(q[0], q[1], q[2], v, pal, rnd.uniform(-0.1, 0.12), false, rnd.choice("*o+*"));
        }
        return;
      }
      flowers.push(makeFlower(kind, pos, axis, pal, R, rnd.uniform(0, 6.28), 0.45 + rank * 0.085 + rnd.uniform(0, 0.12)));
    });

    const leaf = (q, e, f, ln, wd, tone) => {
      const n = norm(cross(e, f));
      for (const [a, b] of LEAF_OFFS) {
        P(q[0] + e[0] * a * ln + f[0] * b * wd, q[1] + e[1] * a * ln + f[1] * b * wd,
          q[2] + e[2] * a * ln + f[2] * b * wd, n, EUCALYPTUS, tone - 0.1 + 0.1 * a - 0.05 * Math.abs(b));
      }
    };

    // eucalyptus sprigs
    for (let i = 0; i < 10; i++) {
      const az = ((i + rnd.uniform(0.0, 0.8)) / 10) * TWO_PI;
      const c = Math.cos(az), s = Math.sin(az);
      const d = norm([c, rnd.uniform(0.15, 0.7), s]);
      const side = [-s, 0.0, c];
      const base = [0.3 * c, 0.27, 0.3 * s];
      const Ls = rnd.uniform(0.42, 0.58), droop = rnd.uniform(0.1, 0.22);
      const sp = (u) => [base[0] + d[0] * Ls * u, base[1] + d[1] * Ls * u - droop * u * u, base[2] + d[2] * Ls * u];
      const nst = n1(12);
      for (let j = 0; j < nst; j++) {
        const p = sp(j / (nst - 1));
        P(p[0], p[1], p[2], [c, 0.3, s], EUCALYPTUS, -0.2);
      }
      for (let k = 0; k < 6; k++) {
        const u = 0.28 + 0.12 * k;
        const p = sp(u), p2 = sp(Math.min(1.0, u + 0.05));
        const tang = norm([p2[0] - p[0], p2[1] - p[1], p2[2] - p[2]]);
        for (const sgn of [-1, 1]) {
          const e = norm([tang[0] + side[0] * sgn * 0.9, tang[1], tang[2] + side[2] * sgn * 0.9]);
          let f = norm(cross(e, [0.0, 1.0, 0.0]));
          if (f[0] === 0 && f[1] === 0 && f[2] === 0) f = basis(e)[0];
          const q = add(p, e, 0.03);
          leaf(q, e, f, 0.062 - (0.012 * k) / 5, 0.034, rnd.uniform(-0.08, 0.08));
        }
      }
    }

    // big leaves
    for (let i = 0; i < 8; i++) {
      const a = ((i + 0.5) / 8) * TWO_PI + rnd.uniform(-0.1, 0.1);
      const c = Math.cos(a), s = Math.sin(a);
      const base = [0.3 * c, 0.27, 0.3 * s];
      const d = norm([c, 0.3 + rnd.uniform(-0.1, 0.15), s]);
      const side = [-s, 0.0, c];
      const n = norm(cross(side, d));
      const Ll = rnd.uniform(0.3, 0.4), W = 0.075;
      const nu = n1(24), nv = n1(9) | 1;
      for (let ti = 0; ti < nu; ti++) {
        const t = ti / (nu - 1);
        const wid = W * Math.sin(Math.PI * t ** 0.85) * (1 + 0.1 * Math.sin(26 * t));
        for (let wi = 0; wi < nv; wi++) {
          const w = (wi / (nv - 1)) * 2 - 1;
          const rib = wi === nv >> 1 ? 0.22 : 0.0;
          P(base[0] + d[0] * Ll * t + side[0] * wid * w + n[0] * 0.03 * w * w,
            base[1] + d[1] * Ll * t - 0.16 * t * t + n[1] * 0.03 * w * w,
            base[2] + d[2] * Ll * t + side[2] * wid * w + n[2] * 0.03 * w * w,
            n, GREENS, rib - 0.28 - 0.15 * Math.abs(w));
        }
      }
    }

    // lavender sprigs
    for (let i = 0; i < 7; i++) {
      const az = (i / 7) * TWO_PI + rnd.uniform(-0.3, 0.3);
      const el = (rnd.uniform(48, 80) * Math.PI) / 180;
      const d = [Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az)];
      const [bu, bv] = basis(d);
      const rEnd = rnd.uniform(0.95, 1.07);
      const ns = n1(14);
      for (let j = 0; j < ns; j++) {
        const q = add(CEN, d, 0.45 + ((rEnd * 0.78 - 0.45) * j) / (ns - 1));
        P(q[0], q[1], q[2], [d[0], 0.0, d[2]], GREENS, -0.1);
      }
      const nb = n1(16);
      for (let j = 0; j < nb; j++) {
        const rr = rEnd * 0.76 + ((rEnd - rEnd * 0.76) * j) / (nb - 1);
        for (let k = 0; k < 3; k++) {
          const angK = (k / 3) * TWO_PI + j * 1.7;
          const off = 0.013 * (1 - (0.5 * j) / nb);
          const q = add(add(add(CEN, d, rr), bu, off * Math.cos(angK)), bv, off * Math.sin(angK));
          P(q[0], q[1], q[2], d, LAVENDER, rnd.uniform(-0.1, 0.12), false, k ? ";" : ":", 0.01);
        }
      }
    }

    // paper cone
    const rings = n1(52);
    for (let i = 0; i < rings; i++) {
      const t = i / (rings - 1);
      const r = R0 + (R1 - R0) * t;
      const cnt = Math.max(10, trunc(170 * r * K));
      for (let j = 0; j < cnt; j++) {
        const ph = ((j + rnd.random() * 0.9) / cnt) * TWO_PI;
        const c = Math.cos(ph), s = Math.sin(ph);
        const cuff = t > 0.9;
        let rr = r * (1.0 + 0.05 * (0.3 + 0.7 * t) * Math.sin(7 * ph + 1.3 * t));
        if (cuff) rr *= 1.0 + (0.08 * (t - 0.9)) / 0.1;
        const y = Y0 + (Y1 - Y0) * t + 0.045 * (Math.abs(Math.sin(5 * ph + 0.3)) - 0.55) * t ** 4;
        const d = pmod(ph - (0.7 + 2.1 * t) + Math.PI, TWO_PI) - Math.PI;
        let tone = 0.3 + 0.17 * Math.cos(7 * ph + 1.3 * t) - 0.14 * (1 - t);
        let pal;
        if (cuff) {
          pal = PAPER_CUFF;
          tone += 0.1;
        } else if (Math.abs(d) < 0.55) {
          pal = PAPER_LAV;
          if (Math.abs(Math.abs(d) - 0.55) < 0.05) tone += 0.3;
        } else {
          pal = PAPER_PURPLE;
        }
        P(rr * c, y, rr * s, norm([c, -KC, s]), pal, tone);
      }
    }

    // little hearts printed on the paper
    for (let k = 0; k < 7; k++) {
      const t = 0.14 + 0.11 * k;
      const r = R0 + (R1 - R0) * t;
      const cnt = Math.max(5, trunc(r * 17 * K));
      for (let j = 0; j < cnt; j++) {
        const ph = ((j + 0.5 * (k % 2)) / cnt) * TWO_PI;
        const d = pmod(ph - (0.7 + 2.1 * t) + Math.PI, TWO_PI) - Math.PI;
        if (Math.abs(d) < 0.68) continue;
        const c = Math.cos(ph), s = Math.sin(ph);
        const rr = r * (1.0 + 0.05 * (0.3 + 0.7 * t) * Math.sin(7 * ph + 1.3 * t)) * 1.012;
        P(rr * c, Y0 + (Y1 - Y0) * t, rr * s, norm([c, -KC, s]), HEART_PRINT, 0.3, false, HEART, 0.03);
      }
    }

    // tissue paper
    const collar = (ya, yb, ra, rb, nrings, kCnt, pal, crink, rimAmp, phase) => {
      const nr = n1(nrings);
      const slope = (rb - ra) / (yb - ya);
      for (let i = 0; i < nr; i++) {
        const t = i / (nr - 1);
        const r = ra + (rb - ra) * t ** 0.8;
        const cnt = Math.max(10, trunc(kCnt * r * K));
        for (let j = 0; j < cnt; j++) {
          const ph = ((j + rnd.random()) / cnt) * TWO_PI;
          const c = Math.cos(ph), s = Math.sin(ph);
          const rr = r * (1.0 + crink * t * (Math.sin(9 * ph + 3 * t + phase) + 0.5 * Math.sin(23 * ph + phase)));
          const y = ya + (yb - ya) * t + rimAmp * t ** 3 * (Math.abs(Math.sin(6.5 * ph + phase)) - 0.5);
          const tone = 0.18 + 0.22 * Math.cos(9 * ph + 3 * t + phase) + 0.1 * Math.sin(23 * ph) - 0.1 * (1 - t);
          P(rr * c, y, rr * s, norm([c, -slope * 0.8, s]), pal, tone);
        }
      }
    };
    collar(0.24, 0.45, 0.34, 0.66, 18, 120, TISSUE, 0.07, 0.07, 0.4);
    collar(0.24, 0.56, 0.32, 0.5, 14, 100, TISSUE_LAV, 0.06, 0.06, 2.0);

    // ribbon band
    const br = coneR(BY) + 0.012;
    const nbr = n1(110);
    for (let j = 0; j < nbr; j++) {
      const ph = (j / nbr) * TWO_PI;
      const c = Math.cos(ph), s = Math.sin(ph);
      for (const dy of [-0.016, -0.005, 0.005, 0.016]) {
        const rr = br + KC * dy;
        P(rr * c, BY + dy, rr * s, [c, -0.1, s], RIBBON, 0.28 + 0.12 * Math.sin(3 * ph) + (dy === 0.005 ? 0.12 : 0.0));
      }
    }

    // bow
    const k0y = BY;
    const k0z = coneR(BY) + 0.03;
    const e1 = [1.0, 0.0, 0.0];
    const e2 = norm([0.0, 1.0, KC]);
    const nB = norm([0.0, -KC, 1.0]);
    const bow = (xx, yy, h) => [
      xx * e1[0] + yy * e2[0] + nB[0] * h,
      k0y + xx * e1[1] + yy * e2[1] + nB[1] * h,
      k0z + xx * e1[2] + yy * e2[2] + nB[2] * h,
    ];
    {
      const L = 0.2, W = 0.075;
      const nu = n1(24), nv = n1(9);
      for (const side of [-1, 1]) {
        const alpha = 0.42;
        const dx2 = side * Math.cos(alpha), dy2 = Math.sin(alpha);
        const px = -dy2, py = dx2;
        for (let iu = 0; iu < nu; iu++) {
          const u = 0.06 + (0.94 * iu) / (nu - 1);
          const wv = W * Math.max(0.0, Math.sin(Math.PI * u ** 0.8)) ** 0.8 * Math.min(1.0, 0.35 + u * 1.2);
          for (let iv = 0; iv < nv; iv++) {
            const v = (iv / (nv - 1)) * 2 - 1;
            const xx = dx2 * L * u + px * wv * v;
            const yy = dy2 * L * u + py * wv * v;
            const tone = 0.26 - 0.34 * (1 - Math.abs(v)) * Math.sin(Math.PI * u) + (Math.abs(v) > 0.8 ? 0.1 : 0.0);
            const p = bow(xx, yy, 0.01);
            P(p[0], p[1], p[2], nB, RIBBON, tone, true, null, 0.01);
          }
        }
      }
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          const p = bow(((i / 5) * 2 - 1) * 0.03, ((j / 5) * 2 - 1) * 0.026, 0.02);
          P(p[0], p[1], p[2], nB, RIBBON, 0.4 - (0.08 * j) / 5, true, null, 0.02);
        }
      }
    }

    // stems under the cone + twine
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * TWO_PI + rnd.uniform(-0.2, 0.2);
      const ca = Math.cos(a), sa = Math.sin(a);
      const spread = rnd.uniform(0.02, 0.07);
      const ey = -0.56 - rnd.uniform(0, 0.03);
      const ns = n1(26);
      for (let j = 0; j < ns; j++) {
        const t = j / (ns - 1);
        const rad = 0.02 + (spread - 0.02) * t;
        P(rad * ca, Y0 + 0.04 + (ey - Y0 - 0.04) * t, rad * sa, [ca, 0.0, sa], GREENS, 0.0);
      }
      P(spread * ca, ey, spread * sa, [ca, -1.0, sa], CUT_END, 0.2, true, "o", 0.01);
    }
    for (const yy of [-0.43, -0.445]) {
      for (let j = 0; j < 24; j++) {
        const ph = (j / 24) * TWO_PI;
        P(0.055 * Math.cos(ph), yy, 0.055 * Math.sin(ph), [Math.cos(ph), 0.0, Math.sin(ph)], TWINE, 0.25, true, null, 0.02);
      }
    }

    // baby's breath, sparkles, fireflies, stars
    const babies = [];
    for (let i = 0; i < n1(130); i++) {
      const a = rnd.random() * TWO_PI;
      const el = rnd.uniform(0.15, 1.45);
      const rr = rnd.uniform(0.62, 0.88);
      babies.push([rr * Math.cos(a) * Math.cos(el), CEN[1] + rr * Math.sin(el), rr * Math.sin(a) * Math.cos(el), rnd.uniform(0, 6.28)]);
    }
    const sparkles = [];
    for (let i = 0; i < 40; i++) {
      const a = rnd.random() * TWO_PI;
      const rr = rnd.uniform(0.8, 1.05);
      sparkles.push([rr * Math.cos(a), rnd.uniform(-0.3, 1.0), rr * Math.sin(a), rnd.uniform(0, 6.28), rnd.uniform(1.5, 4.0)]);
    }
    const flies = [];
    for (let i = 0; i < 12; i++) {
      flies.push([rnd.uniform(0.85, 1.15), rnd.uniform(-0.2, 0.9), rnd.uniform(0.4, 0.9) * rnd.choice([-1, 1]), rnd.uniform(0, 6.28)]);
    }
    const stars = [];
    for (let i = 0; i < 70; i++) stars.push([rnd.random(), rnd.random(), rnd.uniform(0, 6.28), rnd.uniform(0.6, 2.2)]);

    return { pts, flowers, babies, sparkles, flies, stars, K };
  }

  // ribbon tails, curls and the swinging tag
  function dynamicPoints(t, K) {
    const out = [];
    const nu = Math.max(8, trunc(24 * K)), nv = Math.max(3, trunc(5 * K));
    for (const side of [-1, 1]) {
      for (let i = 0; i < nu; i++) {
        const u = i / (nu - 1);
        const sway = 0.035 * Math.sin(t * 1.7 + side * 0.9 + u * 2.0) * u;
        const xo = side * (0.04 + 0.065 * u) + sway;
        const y = BY - 0.045 - 0.3 * u;
        for (let j = 0; j < nv; j++) {
          const v = (j / (nv - 1)) * 2 - 1;
          if (u > 1 - 0.14 * (1 - Math.abs(v))) continue;
          const [x, z, nn] = onCone(xo + 0.02 * v, y, 0.016);
          out.push([x, y, z, nn[0], nn[1], nn[2], RIBBON, 0.28 + 0.2 * Math.sin(5 * u + side) + 0.08 * (1 - Math.abs(v)), true, null, 0.015]);
        }
      }
    }
    const nc = Math.max(14, trunc(28 * K));
    for (let k = 0; k < 4; k++) {
      const side = k % 2 === 0 ? -1 : 1;
      const ph0 = k * 1.3;
      for (let i = 0; i < nc; i++) {
        const u = i / (nc - 1);
        const sway = 0.03 * Math.sin(t * 1.9 + k) * u;
        const xo = side * (0.05 + 0.05 * u + 0.012 * k) + 0.016 * Math.sin(u * Math.PI * 7 + ph0) * (0.3 + u) + sway;
        const y = BY - 0.05 - (0.2 + 0.03 * k) * u;
        const [x, z, nn] = onCone(xo, y, 0.018 + 0.018 * Math.cos(u * Math.PI * 7 + ph0) * u);
        out.push([x, y, z, nn[0], nn[1], nn[2], RIBBON, 0.32 + 0.2 * Math.cos(u * 20 + k), true, null, 0.02]);
      }
    }
    const th = 0.16 * Math.sin(t * 1.25);
    const ax = Math.sin(th), ay = -Math.cos(th);
    const px = Math.cos(th), py = Math.sin(th);
    const p0x = 0.0, p0y = BY - 0.02, ls = 0.07;
    const tx = p0x + ax * ls, ty = p0y + ay * ls;
    for (let k = 0; k < 6; k++) {
      const u = k / 5;
      const [x, z, nn] = onCone(p0x + ax * ls * u, p0y + ay * ls * u, 0.04);
      out.push([x, p0y + ay * ls * u, z, nn[0], nn[1], nn[2], TWINE, 0.0, true, null, 0.01]);
    }
    const hw = 0.05, hh = 0.068;
    const gx = Math.max(5, trunc(6 * K)), gy = Math.max(7, trunc(8 * K));
    for (let i = 0; i < gx; i++) {
      for (let j = 0; j < gy; j++) {
        const qx = ((i / (gx - 1)) * 2 - 1) * hw;
        const qy = (j / (gy - 1)) * 2 * hh;
        const edge = i === 0 || i === gx - 1 || j === 0 || j === gy - 1;
        const yy = ty + py * qx + ay * qy;
        const [x, z, nn] = onCone(tx + px * qx + ax * qy, yy, 0.046);
        out.push([x, yy, z, nn[0], nn[1], nn[2], TAG_PAL, edge ? 0.0 : 0.26, true, null, 0.02]);
      }
    }
    const [x, z, nn] = onCone(tx + ax * hh, ty + ay * hh, 0.046);
    out.push([x, ty + ay * hh, z, nn[0], nn[1], nn[2], HEART_PRINT, 0.5, false, HEART, 0.06]);
    return out;
  }

  // ------------------------------------------------------------------ rasteriser
  // the frame is a grid of cells: chars[i], colors[i], zbuf[i] with i = row * cols + col
  function drawCore(cam, G) {
    const [ca, sa, ct, st, cx, cy, sxs, scale] = cam;
    const { cols, rows, chars, colors, zbuf } = G;
    const [x, y, z] = CEN;
    const xr = x * ca - z * sa;
    const zr = x * sa + z * ca;
    const yp = y - PIVOT_Y;
    const yt = yp * ct - zr * st;
    const zt = yp * st + zr * ct;
    const f = CAM_DIST / (CAM_DIST - zt);
    const fx = cx + xr * f * sxs, fy = cy - yt * f * scale;
    const rx = CORE_R * f * sxs, ry = CORE_R * f * scale;
    const r1 = Math.min(rows, trunc(fy + ry) + 2), c1 = Math.min(cols, trunc(fx + rx) + 2);
    for (let row = Math.max(0, trunc(fy - ry) - 1); row < r1; row++) {
      const dy = (row + 0.5 - fy) / ry;
      for (let col = Math.max(0, trunc(fx - rx) - 1); col < c1; col++) {
        const dx = (col + 0.5 - fx) / rx;
        const q = dx * dx + dy * dy;
        if (q >= 1.0) continue;
        const nzv = Math.sqrt(1.0 - q);
        const zz = zt + CORE_R * nzv;
        const i = row * cols + col;
        if (zz <= zbuf[i]) continue;
        const oy = -dy * CORE_R, oz = nzv * CORE_R;
        const yw = CEN[1] + oy * ct + oz * st;
        if (yw < 0.27) continue;
        const ox = dx * CORE_R;
        const zr2 = -oy * st + oz * ct;
        const xo = ox * ca + zr2 * sa;
        const zo = -ox * sa + zr2 * ca;
        const h = (Math.imul(trunc((xo + 4) * 20), 73856093) ^ Math.imul(trunc((yw + 4) * 20), 19349663)
          ^ Math.imul(trunc((zo + 4) * 20), 83492791)) & 7;
        const dot = dx * LX - dy * LY + nzv * LZ;
        const b = clamp01(0.3 + 0.35 * Math.max(0.0, dot) + (h - 3.5) * 0.035);
        zbuf[i] = zz;
        chars[i] = CORE_SHADE[trunc(b * CORE_SHADE.length)];
        colors[i] = CORE_GREEN[trunc(b * CORE_GREEN.length)];
      }
    }
  }

  function drawPoints(plist, cam, G) {
    const [ca, sa, ct, st, cx, cy, sxs, scale] = cam;
    const { cols, rows, chars, colors, zbuf } = G;
    const ns = SHADE.length;
    for (let k = 0; k < plist.length; k++) {
      const p = plist[k];
      const x = p[0], y = p[1], z = p[2];
      const xr = x * ca - z * sa;
      const zr = x * sa + z * ca;
      const yp = y - PIVOT_Y;
      const yt = yp * ct - zr * st;
      const zt = yp * st + zr * ct;
      const f = CAM_DIST / (CAM_DIST - zt);
      const col = trunc(cx + xr * f * sxs);
      const row = trunc(cy - yt * f * scale);
      if (row < 0 || row >= rows || col < 0 || col >= cols) continue;
      const zz = zt + p[10];
      const i = row * cols + col;
      if (zz <= zbuf[i]) continue;
      const nx = p[3], ny = p[4], nz = p[5];
      const nxr = nx * ca - nz * sa;
      const nzr = nx * sa + nz * ca;
      const nyt = ny * ct - nzr * st;
      const nzt = ny * st + nzr * ct;
      let dot = nxr * LX + nyt * LY + nzt * LZ;
      if (p[8] && dot < 0) dot = -dot * 0.55;
      const b = clamp01(AMBIENT + 0.7 * (dot > 0.0 ? dot : 0.0) + p[7]);
      const pal = p[6];
      zbuf[i] = zz;
      chars[i] = p[9] || SHADE[trunc(b * ns)];
      colors[i] = pal[trunc(b * pal.length)];
    }
  }

  function rasterFlower(fl, g, t, cam, G) {
    const [ca, sa, ct, st, cx, cy, sxs, scale] = cam;
    const { cols, rows, chars, colors, zbuf } = G;
    const [x, y, z] = fl.pos;
    const xr = x * ca - z * sa;
    const zr = x * sa + z * ca;
    const yp = y - PIVOT_Y;
    const yt = yp * ct - zr * st;
    const zt = yp * st + zr * ct;
    const f = CAM_DIST / (CAM_DIST - zt);
    const fx = cx + xr * f * sxs, fy = cy - yt * f * scale;
    const R = fl.R * g * (1.0 + 0.03 * Math.sin(t * 1.6 + fl.seed));
    const dim = -0.4 * (1.0 - Math.min(1.0, Math.max(0.0, (zt + 0.6) / 1.2)));
    const pal = fl.pal, npal = pal.length;
    const Rx = R * f * sxs, Ry = R * f * scale;
    const PS = PETAL_SHADE, NP = PETAL_SHADE.length;

    if (fl.kind === TULIP) {
      const rx = Rx * 0.8, ry = Ry * 1.35;
      if (ry < 0.5) return;
      const r1 = Math.min(rows, trunc(fy + ry) + 2), c1 = Math.min(cols, trunc(fx + rx) + 2);
      for (let row = Math.max(0, trunc(fy - ry) - 1); row < r1; row++) {
        const dy = (row + 0.5 - fy) / ry;
        const v = (1 - dy) / 2;
        if (v < 0 || v > 1) continue;
        const hw = 0.62 * Math.sin(Math.PI * 0.5 * Math.min(1.0, v * 1.5 + 0.05));
        if (hw <= 0) continue;
        for (let col = Math.max(0, trunc(fx - rx) - 1); col < c1; col++) {
          const dx = (col + 0.5 - fx) / rx;
          if (Math.abs(dx) > hw) continue;
          const xn = dx / hw;
          if (v > 0.72 + 0.28 * Math.cos(1.5 * Math.PI * xn) ** 2) continue;
          const i = row * cols + col;
          if (zt + 0.03 <= zbuf[i]) continue;
          const seam = Math.abs(Math.abs(xn) - 0.33) < 0.12 && v > 0.3 ? -0.25 : 0.0;
          const rim = Math.abs(xn) > 0.84 || v < 0.06 ? -0.25 : 0.0;
          const b = clamp01(0.52 - 0.3 * xn + 0.1 * v + seam + rim + dim);
          zbuf[i] = zt + 0.03;
          chars[i] = PS[trunc(b * NP)];
          colors[i] = pal[trunc(b * npal)];
        }
      }
      return;
    }

    const [uxr, uyt, uzt] = rot(fl.u, ca, sa, ct, st);
    const [vxr, vyt, vzt] = rot(fl.v, ca, sa, ct, st);
    const [axr, ayt, azt] = rot(fl.axis, ca, sa, ct, st);
    const m11 = uxr * Rx, m12 = vxr * Rx, m21 = -uyt * Ry, m22 = -vyt * Ry;
    const big = Math.max(Math.abs(m11), Math.abs(m12), Math.abs(m21), Math.abs(m22));
    if (big < 0.55) {
      const c0 = trunc(fx), r0 = trunc(fy);
      if (r0 >= 0 && r0 < rows && c0 >= 0 && c0 < cols && big > 0.05) {
        const i = r0 * cols + c0;
        if (zt > zbuf[i]) {
          zbuf[i] = zt;
          chars[i] = "o";
          colors[i] = GREENS[GREENS.length - 1];
        }
      }
      return;
    }
    let det = m11 * m22 - m12 * m21;
    const thr = 0.55 * big;
    if (Math.abs(det) < thr) det = det >= 0 ? thr : -thr;
    const inv = 1.0 / det;
    const ex = Math.hypot(m11, m12), ey = Math.hypot(m21, m22);

    const back = azt < -0.08;
    const bl = 0.2 * (axr * LX + ayt * LY + azt * LZ);
    const kz = R * fl.cup * azt;
    const off = (fl.seed + t * 0.3 + (1.0 - Math.min(g, 1.0)) * 2.5) * INV_2PI;
    const { kind, cr, base, slope, reach, tone, cpal } = fl;
    const ncp = cpal ? cpal.length : 1;
    const NG = GREENS.length;

    const r1 = Math.min(rows, trunc(fy + ey) + 2), c1 = Math.min(cols, trunc(fx + ex) + 2);
    for (let row = Math.max(0, trunc(fy - ey) - 1); row < r1; row++) {
      const sy = row + 0.5 - fy;
      const shy = (-0.26 * sy) / ey;
      for (let col = Math.max(0, trunc(fx - ex) - 1); col < c1; col++) {
        const sx = col + 0.5 - fx;
        const a = (m22 * sx - m12 * sy) * inv;
        const b2 = (m11 * sy - m21 * sx) * inv;
        const s2 = a * a + b2 * b2;
        if (s2 > 1.0) continue;
        const zc = zt + R * (a * uzt + b2 * vzt) + kz * (1.0 - s2);
        const i = row * cols + col;
        if (zc <= zbuf[i]) continue;
        const s = Math.sqrt(s2);
        const u01 = Math.atan2(b2, a) * INV_2PI + off;
        let ti = trunc(pmod(u01, 1.0) * NTAB);
        if (ti >= NTAB) ti = NTAB - 1;
        const rch = reach[ti];
        if (s > rch) continue;
        const sh = shy - (0.2 * sx) / ex;
        let b, ch, color;
        if (back) {
          if (s < 0.5) {
            b = clamp01(0.3 + sh + dim * 0.5);
            ch = "%";
            color = GREENS[trunc(b * NG)];
          } else {
            b = clamp01(0.3 + sh + dim - (s > rch - 0.1 ? 0.2 : 0.0));
            ch = PS[trunc(b * NP)];
            color = pal[trunc(b * npal)];
          }
        } else if (kind === ROSE) {
          const sw = pmod(s * 2.4 - u01, 1.0);
          b = base + sh + bl + dim;
          if (sw < 0.22) b -= 0.3;
          else if (sw > 0.82) b += 0.16;
          if (s < 0.14) b -= 0.22;
          else if (s > rch - 0.1) b -= 0.28;
          b = clamp01(b);
          ch = PS[trunc(b * NP)];
          color = pal[trunc(b * npal)];
        } else if (s < cr) {
          if (kind === SUN) {
            const chk = (trunc(s * 9.0) + trunc(pmod(u01, 1.0) * 23.0)) & 1;
            b = 0.3 + 0.38 * chk + 0.5 * sh + 0.5 * bl + 0.5 * dim;
            ch = chk ? "@" : "o";
          } else {
            b = 0.55 + 1.5 * sh + dim;
            ch = s < cr * 0.55 ? "@" : "o";
          }
          b = clamp01(b);
          color = cpal[trunc(b * ncp)];
        } else {
          b = base + sh + tone[ti] + bl + dim + slope * (s - 0.5);
          if (s > rch - 0.1) b -= 0.25;
          b = clamp01(b);
          ch = PS[trunc(b * NP)];
          color = pal[trunc(b * npal)];
        }
        zbuf[i] = zc;
        chars[i] = ch;
        colors[i] = color;
      }
    }
  }

  function renderScene(scene, t, ang, G, scale, hearts, petals) {
    const { cols, rows, chars, colors, zbuf } = G;
    chars.fill(" ");
    zbuf.fill(-1e9);

    const tilt = TILT + 0.035 * Math.sin(t * 0.5);
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const ct = Math.cos(tilt), st = Math.sin(tilt);
    const sxs = scale * 2.0;
    const cx = cols / 2;
    // tall phone screens: centre the bouquet vertically instead of pinning it to the top
    const spare = Math.max(0, rows - (1.8 * scale + 2));
    const cy = 1 + (TOP_Y - PIVOT_Y) * scale + spare * 0.45;
    const cam = [ca, sa, ct, st, cx, cy, sxs, scale];

    const plot = (col, row, z, ch, color) => {
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        const i = row * cols + col;
        if (z > zbuf[i]) {
          zbuf[i] = z;
          chars[i] = ch;
          colors[i] = color;
        }
      }
    };
    const project = (x, y, z) => {
      const xr = x * ca - z * sa;
      const zr = x * sa + z * ca;
      const yp = y - PIVOT_Y;
      const yt = yp * ct - zr * st;
      const zt = yp * st + zr * ct;
      const f = CAM_DIST / (CAM_DIST - zt);
      return [trunc(cx + xr * f * sxs), trunc(cy - yt * f * scale), zt];
    };

    // sky
    for (const [sx, sy, ph, spd] of scene.stars) {
      const tw = Math.sin(t * spd + ph);
      const col = trunc(sx * cols), row = trunc(sy * rows);
      if (tw > 0.93) plot(col, row, -80, "+", 252);
      else if (tw > 0.5) plot(col, row, -80, "·", 247);
      else if (tw > 0.0) plot(col, row, -80, "·", 240);
    }
    for (const [x, y, , phase, color] of hearts) {
      const col = pmod(trunc((x + 0.015 * Math.sin(t * 1.2 + phase)) * cols), cols);
      plot(col, trunc(y * rows), -50, HEART, color);
    }
    for (const [x, y, , phase, color] of petals) {
      const col = pmod(trunc((x + 0.04 * Math.sin(t * 0.9 + phase)) * cols), cols);
      plot(col, trunc(y * rows), -50, PETAL_CHARS[pmod(trunc(t * 2.2 + phase * 3), 4)], color);
    }

    // the bouquet
    drawCore(cam, G);
    for (const fl of scene.flowers) {
      const g = INTRO ? easeOutBack((t - fl.delay) / 1.1) : 1.0;
      if (g > 0.02) rasterFlower(fl, g, t, cam, G);
    }
    drawPoints(scene.pts, cam, G);
    drawPoints(dynamicPoints(t, scene.K), cam, G);

    const show = INTRO ? Math.min(1.0, Math.max(0.0, (t - 2.5) / 2.0)) : 1.0;
    if (show > 0) {
      const nb = scene.babies.length;
      for (let i = 0; i < nb; i++) {
        if (i / nb > show) break;
        const [x, y, z, phase] = scene.babies[i];
        const [col, row, zt] = project(x, y, z);
        const star = Math.sin(t * 2 + phase) > 0.6;
        plot(col, row, zt + 0.02, star ? "*" : "·", star ? 231 : 255);
      }
      for (const [x, y, z, phase, speed] of scene.sparkles) {
        const [col, row, zt] = project(x, y, z);
        const tw = Math.sin(t * speed + phase);
        if (tw > 0.85) plot(col, row, zt, "*", 231);
        else if (tw > 0.4) plot(col, row, zt, "+", 225);
        else if (tw > 0.0) plot(col, row, zt, "·", 183);
      }
      const trail = [["*", 229], ["+", 223], ["·", 183], ["·", 140]];
      for (const [rad, y0, omega, phase] of scene.flies) {
        for (let k = 0; k < trail.length; k++) {
          const a = phase + t * omega - k * 0.1 * (omega > 0 ? 1 : -1);
          const yy = y0 + 0.08 * Math.sin(t * 0.9 + phase);
          const [col, row, zt] = project(rad * Math.cos(a), yy, rad * Math.sin(a));
          plot(col, row, zt + 0.1, trail[k][0], trail[k][1]);
        }
      }
    }
  }

  function updateParticles(hearts, petals, dt) {
    while (hearts.length < NUM_HEARTS) {
      hearts.push([Math.random(), uniform(0.0, 1.25), uniform(0.03, 0.08), uniform(0, 6.28), choice(HEART_COLORS)]);
    }
    while (petals.length < NUM_PETALS) {
      petals.push([Math.random(), uniform(0.0, 1.25), uniform(0.05, 0.11), uniform(0, 6.28), choice(PETAL_COLORS)]);
    }
    for (const [group, pal] of [[hearts, HEART_COLORS], [petals, PETAL_COLORS]]) {
      for (const h of group) {
        h[1] -= h[2] * dt;
        if (h[1] < 0) {
          h[0] = Math.random();
          h[1] = 1.0;
          h[4] = choice(pal);
        }
      }
    }
  }

  // which characters [lo, hi) of a message are visible tt seconds after it starts typing
  function msgPhase(n, tt) {
    const typeD = n / TYPE_CPS;
    const hold = 2.6 + 0.03 * n;
    const eraseD = 0.9;
    if (tt < 0) return [0, 0, false];
    if (tt < typeD) return [0, trunc(tt * TYPE_CPS), false];
    if (tt < typeD + hold) return [0, n, false];
    if (tt < typeD + hold + eraseD) return [trunc(((tt - typeD - hold) / eraseD) * n), n, false];
    return [n, n, tt > typeD + hold + eraseD + 0.5];
  }

  // ------------------------------------------------------------------ halaman
  const canvas = document.getElementById("bouquet");
  const ctx = canvas.getContext("2d");
  const stage = document.getElementById("stage");
  const titleEl = document.getElementById("to");
  const msgEl = document.getElementById("message");
  const sigEl = document.getElementById("signature");
  const hintEl = document.getElementById("hint");

  const touch = window.matchMedia("(hover: none)").matches;
  hintEl.textContent = touch
    ? "ketuk layar untuk pesan berikutnya"
    : "spasi jeda · +/- kecepatan · r putar balik · n / klik pesan berikutnya";

  const escapeHtml = (ch) => (ch === "<" ? "&lt;" : ch === ">" ? "&gt;" : ch === "&" ? "&amp;" : ch);

  function colourText(text, shift, lo = 0, hi = text.length, cursor = -1) {
    let html = "";
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (i === cursor) {
        html += '<span style="color:' + XTERM[177] + '">_</span>';
      } else if (i >= lo && i < hi && ch !== " ") {
        html += '<span style="color:' + XTERM[MSG_COLORS[(i + shift) % MSG_COLORS.length]] + '">' + escapeHtml(ch) + "</span>";
      } else if (ch === " ") {
        html += " ";
      } else {
        html += '<span class="ghost">' + escapeHtml(ch) + "</span>";
      }
    }
    return html;
  }

  const G = { cols: 0, rows: 0, cw: 0, ch: 0, chars: [], colors: null, zbuf: null };
  let scene = null, sceneDensity = null, scale = 1;

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    const cw = Math.max(4.5, Math.min(12, Math.min(window.innerWidth / 90, h / 120)));
    const chh = cw * 2;
    G.cw = cw;
    G.ch = chh;
    G.cols = Math.max(20, Math.floor(w / cw));
    G.rows = Math.max(12, Math.floor(h / chh));
    const n = G.cols * G.rows;
    G.chars = new Array(n).fill(" ");
    G.colors = new Uint8Array(n);
    G.zbuf = new Float32Array(n);

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(G.cols * cw * dpr);
    canvas.height = Math.round(G.rows * chh * dpr);
    canvas.style.width = G.cols * cw + "px";
    canvas.style.height = G.rows * chh + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = (chh * 0.82).toFixed(2) + 'px "Cascadia Mono", Consolas, Menlo, "DejaVu Sans Mono", ui-monospace, monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    scale = Math.max(1.0, Math.min((G.rows - 2) / 1.8, (G.cols - 2) / 3.5));
    const density = Math.round(Math.max(0.6, Math.min(1.6, scale / 24.0)) * 4) / 4;
    if (scene === null || density !== sceneDensity) {
      scene = buildScene(density);
      sceneDensity = density;
    }
  }

  function paint() {
    const { cols, rows, cw, ch, chars, colors } = G;
    ctx.clearRect(0, 0, cols * cw, rows * ch);
    let last = -1;
    for (let r = 0; r < rows; r++) {
      const y = (r + 0.5) * ch;
      const base = r * cols;
      for (let c = 0; c < cols; c++) {
        const glyph = chars[base + c];
        if (glyph === " ") continue;
        const col = colors[base + c];
        if (col !== last) {
          ctx.fillStyle = XTERM[col];
          last = col;
        }
        ctx.fillText(glyph, (c + 0.5) * cw, y);
      }
    }
  }

  // ------------------------------------------------------------------ main loop
  const hearts = [], petals = [];
  let ang = 0.0, spinMul = 1.0, spinOn = true;
  let msgI = 0, msgT0 = INTRO ? 0.9 : 0.3;
  let t = 0, lastNow = null, lastPaint = -1;
  let lastMsgKey = "";

  const nextMessage = () => {
    msgI = (msgI + 1) % MESSAGES.length;
    msgT0 = t;
  };

  window.addEventListener("keydown", (e) => {
    const k = e.key;
    if (k === " ") {
      spinOn = !spinOn;
      e.preventDefault();
    } else if (k === "+" || k === "=") spinMul = Math.min(6.0, spinMul * 1.25);
    else if (k === "-" || k === "_") spinMul = Math.max(0.1, spinMul / 1.25);
    else if (k === "r" || k === "R") spinMul = -spinMul;
    else if (k === "n" || k === "N") nextMessage();
  });
  window.addEventListener("pointerdown", nextMessage);
  window.addEventListener("resize", resize);

  titleEl.innerHTML = TO_NAME ? colourText("untuk " + TO_NAME, 0) : "";

  function frame(now) {
    requestAnimationFrame(frame);
    if (lastNow === null) lastNow = now;
    const dt = Math.min(0.1, Math.max(0.0, (now - lastNow) / 1000));
    lastNow = now;
    t += dt;
    if (t - lastPaint < 1 / FPS - 0.004) return;
    const fdt = lastPaint < 0 ? dt : Math.min(0.1, t - lastPaint);
    lastPaint = t;

    if (spinOn) ang += SPIN_SPEED * spinMul * fdt;
    updateParticles(hearts, petals, fdt);
    renderScene(scene, t, ang, G, scale, hearts, petals);
    paint();

    const shift = trunc(t * 8);
    const text = MESSAGES[msgI];
    const [lo, hi, done] = msgPhase(text.length, t - msgT0);
    if (done) nextMessage();
    const typing = lo === 0 && hi < text.length && trunc(t * 3) % 2 === 0;
    const msgKey = msgI + "|" + lo + "|" + hi + "|" + shift + "|" + typing;
    if (msgKey !== lastMsgKey) {
      lastMsgKey = msgKey;
      msgEl.innerHTML = colourText(text, shift, lo, hi, typing ? hi : -1);
      if (TO_NAME) titleEl.innerHTML = colourText("untuk " + TO_NAME, shift);
    }
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.5);
    sigEl.style.opacity = (0.55 + 0.35 * pulse).toFixed(3);
    hintEl.style.opacity = Math.max(0.0, Math.min(1.0, (11.0 - t) / 2.0)).toFixed(3);
  }

  sigEl.textContent = SIGNATURE;
  document.title = TO_NAME ? "untuk " + TO_NAME + " ♥" : "buket ♥";
  resize();
  requestAnimationFrame(frame);
})();
