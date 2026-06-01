/* ============================================================
   THREE.JS — Animated Neural Network Particle Background
   ============================================================ */
(function initThree() {
  const canvas = document.getElementById("three-canvas");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    innerWidth / innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 55;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  /* Particle positions */
  const COUNT = 140;
  const pts = [];
  const posBuf = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 45;
    pts.push([x, y, z]);
    posBuf[i * 3] = x;
    posBuf[i * 3 + 1] = y;
    posBuf[i * 3 + 2] = z;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(posBuf, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0x00d4ff,
    size: 0.55,
    transparent: true,
    opacity: 0.65,
  });
  const pointMesh = new THREE.Points(pGeo, pMat);
  scene.add(pointMesh);

  /* Connection lines */
  const lVerts = [];
  const THRESH = 16;
  for (let i = 0; i < COUNT; i++) {
    for (let j = i + 1; j < COUNT; j++) {
      const [ax, ay, az] = pts[i];
      const [bx, by, bz] = pts[j];
      const d = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2);
      if (d < THRESH) lVerts.push(ax, ay, az, bx, by, bz);
    }
  }
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(lVerts), 3),
  );
  const lMat = new THREE.LineBasicMaterial({
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.085,
  });
  const lineMesh = new THREE.LineSegments(lGeo, lMat);
  scene.add(lineMesh);

  /* Mouse parallax */
  let mx = 0,
    my = 0;
  window.addEventListener("mousemove", (e) => {
    mx = (e.clientX / innerWidth - 0.5) * 2;
    my = (e.clientY / innerHeight - 0.5) * 2;
  });

  /* Animation loop */
  let t = 0;
  (function tick() {
    requestAnimationFrame(tick);
    t += 0.00042;
    pointMesh.rotation.y = t;
    lineMesh.rotation.y = t;
    pointMesh.rotation.x = t * 0.35;
    lineMesh.rotation.x = t * 0.35;
    camera.position.x += (mx * 9 - camera.position.x) * 0.028;
    camera.position.y += (-my * 9 - camera.position.y) * 0.028;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  })();

  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();

/* ============================================================
   SPOTLIGHT CURSOR
   Replaces the custom cursor dot — a soft radial glow that
   follows the mouse and lights up the page beneath it.
   ============================================================ */
(function initSpotlight() {
  const spotlight = document.getElementById("spotlight");
  if (!spotlight) return;

  let tx = -9999,
    ty = -9999; // target position
  let cx = -9999,
    cy = -9999; // current (lerped) position

  window.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  // Hide spotlight when mouse leaves the window
  document.addEventListener("mouseleave", () => {
    spotlight.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    spotlight.style.opacity = "1";
  });

  // Smooth lerp loop — spotlight drifts slightly behind the mouse
  (function loop() {
    requestAnimationFrame(loop);
    cx += (tx - cx) * 0.09;
    cy += (ty - cy) * 0.09;
    spotlight.style.left = cx + "px";
    spotlight.style.top = cy + "px";
  })();
})();

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
(function initScrollProgress() {
  const bar = document.getElementById("prog");
  window.addEventListener(
    "scroll",
    () => {
      const max = document.body.scrollHeight - innerHeight;
      bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
    },
    { passive: true },
  );
})();

/* ============================================================
   NAV — scroll shadow
   ============================================================ */
(function initNav() {
  const nav = document.getElementById("main-nav");
  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("scrolled", scrollY > 40);
    },
    { passive: true },
  );
})();

/* ============================================================
   MOBILE HAMBURGER MENU
   ============================================================ */
(function initMobileMenu() {
  const btn = document.getElementById("hamburger");
  const drawer = document.getElementById("mobile-drawer");
  if (!btn || !drawer) return;

  btn.addEventListener("click", () => {
    const open = btn.classList.toggle("open");
    drawer.classList.toggle("open", open);
  });
  drawer.querySelectorAll(".drawer-link").forEach((link) => {
    link.addEventListener("click", () => {
      btn.classList.remove("open");
      drawer.classList.remove("open");
    });
  });
})();

/* ============================================================
   TYPING EFFECT
   ============================================================ */
(function initTyping() {
  const el = document.getElementById("typed");
  if (!el) return;

  const phrases = [
    "Full-Stack Developer",
    "MERN Stack Engineer",
    "ECS Graduate",
    "Java DSA Practitioner",
    "Open to New Roles ",
  ];

  let pi = 0,
    ci = 0,
    del = false;

  function step() {
    const phrase = phrases[pi];
    if (!del) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        del = true;
        setTimeout(step, 2000);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        del = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(step, del ? 42 : 82);
  }
  step();
})();

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
(function initScrollReveal() {
  const els = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("up");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  els.forEach((el) => obs.observe(el));

  // Trigger hero immediately
  setTimeout(() => {
    document
      .querySelectorAll("#hero .reveal")
      .forEach((el) => el.classList.add("up"));
  }, 160);
})();

/* ============================================================
   3D CARD TILT 
   ============================================================ */
(function initCardTilt() {
  const STRENGTH = 9; // max tilt degrees
  const LIFT = 14; // translateZ lift in px

  document.querySelectorAll(".proj-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // Snap transition off on enter so the initial tilt is instant
      card.style.transition =
        "transform 0.08s ease-out, border-color 0.35s, box-shadow 0.35s";
    });

    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = ((y - r.height / 2) / (r.height / 2)) * -STRENGTH;
      const ry = ((x - r.width / 2) / (r.width / 2)) * STRENGTH;

      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${LIFT}px)`;
    });

    card.addEventListener("mouseleave", () => {
      // Slow ease back to flat
      card.style.transition =
        "transform 0.5s cubic-bezier(.22,1,.36,1), border-color 0.35s, box-shadow 0.35s";
      card.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    });
  });
})();

/* ============================================================
   SKILL PILLS — staggered entrance on scroll
   ============================================================ */
(function initSkillPills() {
  // Start hidden
  document.querySelectorAll(".sk-pill").forEach((p) => {
    p.style.opacity = "0";
    p.style.transform = "translateY(14px)";
  });

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll(".sk-pill").forEach((pill, i) => {
          setTimeout(() => {
            pill.style.transition = "opacity 0.45s ease, transform 0.45s ease";
            pill.style.opacity = "1";
            pill.style.transform = "translateY(0)";
          }, i * 65);
        });
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.3 },
  );

  document.querySelectorAll(".skill-group").forEach((g) => obs.observe(g));
})();

/* ============================================================
   PROGRESS BARS — animate when ongoing section scrolls into view
   ============================================================ */
(function initProgressBars() {
  const bars = document.querySelectorAll(".progress-bar-fill");

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        const w = bar.getAttribute("data-width") || "0";
        // Small delay so the section reveal animation finishes first
        setTimeout(() => {
          bar.style.width = w + "%";
        }, 300);
        obs.unobserve(bar);
      });
    },
    { threshold: 0.5 },
  );

  bars.forEach((b) => obs.observe(b));
})();
