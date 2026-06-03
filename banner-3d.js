import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

const mount = document.getElementById('globe3d');
if (mount) {
    /* ───── Scene ───── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    camera.position.set(0, 0, 4.3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth || 560, mount.clientHeight || 560, false);
    mount.appendChild(renderer.domElement);

    /* ───── Single rotating group (everything rotates together) ───── */
    const globe = new THREE.Group();
    globe.rotation.y = -1.95;          // Start rotation from Europe (Greece facing viewer)
    scene.add(globe);

    /* ───── Lighting ───── */
    scene.add(new THREE.AmbientLight(0xffffff, 2.2));

    const loader = new THREE.TextureLoader();
    const earthMap = loader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    const earthSpec = loader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg');
    const earthNorm = loader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg');

    const R = 1.3; // globe radius

    /* ───── Earth ───── */
    const earth = new THREE.Mesh(
        new THREE.SphereGeometry(R, 96, 96),
        new THREE.MeshPhongMaterial({
            map: earthMap,
            specularMap: earthSpec,
            normalMap: earthNorm,
            specular: new THREE.Color(0x444444),
            shininess: 12
        })
    );
    globe.add(earth);



    /* ───── Atmosphere ───── */
    const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(R + 0.07, 96, 96),
        new THREE.MeshBasicMaterial({
            color: 0x8fd3ff,
            transparent: true,
            opacity: 0.10
        })
    );
    globe.add(atmosphere);

    /* ───── Lat/Lon → 3D ───── */
    function latLon(lat, lon, radius) {
        const phi = (90 - lat) * Math.PI / 180;
        const theta = (lon + 180) * Math.PI / 180;
        return new THREE.Vector3(
            -radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
        );
    }

    /* ───── Route curve (Greece → Bangalore) ───── */
    const routeR = R + 0.02; // dots sit just above the surface
    const greece = latLon(39.0742, 21.8243, routeR);
    const bangalore = latLon(12.9716, 77.5946, routeR);

    // Intermediate control points for a gentle arc
    const mid1 = latLon(34, 38, R + 0.16);
    const mid2 = latLon(24, 55, R + 0.22);
    const mid3 = latLon(18, 68, R + 0.16);

    const curve = new THREE.CatmullRomCurve3([greece, mid1, mid2, mid3, bangalore]);

    /* ───── Dotted route (visible points, not lines) ───── */
    const dotCount = 160;
    const dotPositions = [];
    for (let i = 0; i <= dotCount; i++) {
        const pt = curve.getPointAt(i / dotCount);
        dotPositions.push(pt.x, pt.y, pt.z);
    }

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));

    const dotMat = new THREE.PointsMaterial({
        color: 0xf4a04b,
        size: 0.032,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        sizeAttenuation: true
    });
    const pathDots = new THREE.Points(dotGeo, dotMat);
    globe.add(pathDots);

    /* ───── Location markers (small rings at Greece & Bangalore) ───── */
    function makeLocationDot(pos, color) {
        const m = new THREE.Mesh(
            new THREE.SphereGeometry(0.025, 16, 16),
            new THREE.MeshBasicMaterial({ color })
        );
        m.position.copy(pos);
        globe.add(m);
    }
    makeLocationDot(greece, 0xf37022);
    makeLocationDot(bangalore, 0xf37022);

    /* ───── Domestic route lines (Bangalore → Indian cities, pulsating dotted paths) ───── */
    /* Logo-derived palette: navy, purple, teal (Pune, Mumbai, Vizag removed) */
    const indianCities = [
        { name: 'Kolkata',            lat: 22.5726, lon: 88.3639, color: 0xF37022 },   // orange
        { name: 'Chennai',            lat: 13.0827, lon: 80.2707, color: 0xF37022 },   // orange
        { name: 'Delhi',              lat: 28.6139, lon: 77.2090, color: 0xF37022 },   // orange
        { name: 'Ayodhya',            lat: 26.7922, lon: 82.1998, color: 0xF37022 },   // orange
        { name: 'Ahmedabad',          lat: 23.0225, lon: 72.5714, color: 0xF37022 },   // orange
        { name: 'Thiruvananthapuram', lat: 8.5241,  lon: 76.9366, color: 0xF37022 },   // orange
    ];

    const domesticLines = []; // store refs for animation

    indianCities.forEach((city, idx) => {
        const blrPos = latLon(12.9716, 77.5946, routeR);
        const cityPos = latLon(city.lat, city.lon, routeR);

        // Add a very small, elegant location marker dot at the destination city (0.016 radius)
        const destMarker = new THREE.Mesh(
            new THREE.SphereGeometry(0.016, 16, 16),
            new THREE.MeshBasicMaterial({ color: city.color })
        );
        destMarker.position.copy(cityPos);
        globe.add(destMarker);

        // Calculate actual distance between Bangalore and target city
        const dist = blrPos.distanceTo(cityPos);
        // Dynamic arc height: slightly higher base (R + 0.035) to prevent any surface clipping
        const arcHeight = R + 0.035 + dist * 0.22;

        // Build a mid-point that arcs slightly above the surface
        const midLat = (12.9716 + city.lat) / 2;
        const midLon = (77.5946 + city.lon) / 2;
        const midPos = latLon(midLat, midLon, arcHeight);

        const domesticCurve = new THREE.CatmullRomCurve3([blrPos, midPos, cityPos]);

        // 1. Add a complete, thin solid base line stroke from Bangalore to the city
        const segCount = 64;
        const pts = domesticCurve.getPoints(segCount);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
        const baseLineMat = new THREE.LineBasicMaterial({
            color: city.color,
            transparent: true,
            opacity: 0.55,        // clear, beautiful solid base line
            depthWrite: false
        });
        const baseLine = new THREE.Line(lineGeo, baseLineMat);
        globe.add(baseLine);

        // 2. Generate pulsating dots along the curve (smaller, delicate 0.020 size)
        const localDotCount = 40;
        const positions = [];
        for (let i = 0; i <= localDotCount; i++) {
            const pt = domesticCurve.getPointAt(i / localDotCount);
            positions.push(pt.x, pt.y, pt.z);
        }

        const dotGeo = new THREE.BufferGeometry();
        dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        const dotMat = new THREE.PointsMaterial({
            color: city.color,
            size: 0.020,          // delicate, high-tech minimal dot size
            transparent: true,
            opacity: 0.95,
            depthWrite: false,
            sizeAttenuation: true
        });

        const pathDots = new THREE.Points(dotGeo, dotMat);
        globe.add(pathDots);

        // 3. Add a moving marker dot for this specific domestic route (0.022 size)
        const cityMarker = new THREE.Mesh(
            new THREE.SphereGeometry(0.022, 16, 16),
            new THREE.MeshBasicMaterial({ color: city.color })
        );
        globe.add(cityMarker);

        domesticLines.push({
            mat: dotMat,
            curve: domesticCurve,
            marker: cityMarker,
            progress: 0,
            speed: 0.004 + 0.002 * (idx % 3), // staggered speeds for an organic look
            phase: idx * 1.05
        });
    });

    /* ───── Moving marker ───── */
    const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 18, 18),
        new THREE.MeshBasicMaterial({ color: 0xf37022 })
    );
    globe.add(marker);

    /* ───── Subtle outer glow (CSS overlay) ───── */
    const glow = document.createElement('div');
    glow.style.cssText = 'position:absolute;inset:9%;border-radius:50%;box-shadow:0 0 90px rgba(243,112,34,.18), inset 0 0 90px rgba(255,255,255,.08);pointer-events:none;';
    mount.appendChild(glow);

    /* ───── Animation state ───── */
    let progress = 0;
    let hold = 0;
    const travelFrames = 250;
    const holdFrames = 60;
    let frameCount = 0; // global frame counter for pulsation

    /* ───── Hover Interaction to Pause on India ───── */
    let isHovered = false;
    mount.addEventListener('mouseenter', () => { isHovered = true; });
    mount.addEventListener('mouseleave', () => { isHovered = false; });
    // Support pointer events for mobile touch devices
    mount.addEventListener('pointerenter', () => { isHovered = true; });
    mount.addEventListener('pointerleave', () => { isHovered = false; });

    function animate() {
        requestAnimationFrame(animate);
        frameCount++;

        // Normalize rotation angle to [0, 2*PI]
        const norm = ((globe.rotation.y % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

        // Dynamically compute speed: fast in Pacific/Atlantic/Americas, slow in Europe/Asia
        const minSpeed = 0.0016;
        const maxSpeed = 0.0110;
        const dynamicSpeed = minSpeed + (maxSpeed - minSpeed) * (0.5 + 0.5 * Math.cos(norm - 1.1));

        // India is facing the viewer when norm is between 3.20 and 3.55 radians
        const isIndiaInFront = (norm >= 3.20 && norm <= 3.55);

        /* West-to-east rotation (paused ONLY when India is facing front AND user is hovering) */
        if (isHovered && isIndiaInFront) {
            // Pause rotation so India can be inspected closely
        } else {
            globe.rotation.y -= dynamicSpeed;
        }

        /* ── Marker travel logic ── */
        if (hold > 0) {
            hold--;
        } else {
            progress++;
            if (progress > travelFrames) {
                progress = travelFrames;
                hold = holdFrames;
            }
        }

        const t = Math.min(progress / travelFrames, 1);
        // Ease-in-out for smooth marker motion
        const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        marker.position.copy(curve.getPointAt(e));

        if (t >= 1 && hold > 0) {
            // Pulse at Bangalore
            const pulse = 1.0 + 0.35 * Math.sin(hold * 0.15);
            marker.scale.setScalar(pulse);
            marker.position.copy(curve.getPointAt(1));
        } else {
            marker.scale.setScalar(1);
        }

        // Reset for loop
        if (progress >= travelFrames && hold === 0) progress = 0;

        /* ── Pulsating domestic lines & moving markers ── */
        domesticLines.forEach((dl) => {
            // 1. Smooth sine-wave pulsation: opacity oscillates 0.2 → 0.7
            dl.mat.opacity = 0.45 + 0.25 * Math.sin(frameCount * 0.04 + dl.phase);

            // 2. Animate the traveling marker along its curve
            dl.progress += dl.speed;
            if (dl.progress > 1) {
                dl.progress = 0; // seamless reset loop
            }

            // Ease-in-out curve for natural travel acceleration
            const de = dl.progress < 0.5
                ? 2 * dl.progress * dl.progress
                : 1 - Math.pow(-2 * dl.progress + 2, 2) / 2;

            dl.marker.position.copy(dl.curve.getPointAt(de));
        });

        renderer.render(scene, camera);
    }

    animate();

    /* ───── Responsive resize ───── */
    window.addEventListener('resize', () => {
        const w = mount.clientWidth || 560;
        const h = mount.clientHeight || 560;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
    });
}