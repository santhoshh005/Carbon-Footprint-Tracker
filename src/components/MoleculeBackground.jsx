import { useEffect, useRef } from 'react';

// Molecule configurations in local model coordinates
const MOLECULE_TEMPLATES = {
  co2: {
    atoms: [
      { x: 0, y: 0, z: 0, color: '#334155', radius: 15, name: 'C' }, // Carbon (dark grey)
      { x: -50, y: 0, z: 0, color: '#ef4444', radius: 11, name: 'O' }, // Oxygen (red)
      { x: 50, y: 0, z: 0, color: '#ef4444', radius: 11, name: 'O' }  // Oxygen (red)
    ],
    bonds: [
      { from: 0, to: 1, count: 2 }, // Double bond
      { from: 0, to: 2, count: 2 }  // Double bond
    ]
  },
  ch4: {
    atoms: [
      { x: 0, y: 0, z: 0, color: '#334155', radius: 15, name: 'C' }, // Carbon
      { x: 0, y: 45, z: 45, color: '#38bdf8', radius: 8, name: 'H' }, // Hydrogen (blue-sky)
      { x: 45, y: -45, z: 0, color: '#38bdf8', radius: 8, name: 'H' },
      { x: -45, y: -45, z: 0, color: '#38bdf8', radius: 8, name: 'H' },
      { x: 0, y: 0, z: -45, color: '#38bdf8', radius: 8, name: 'H' }
    ],
    bonds: [
      { from: 0, to: 1, count: 1 },
      { from: 0, to: 2, count: 1 },
      { from: 0, to: 3, count: 1 },
      { from: 0, to: 4, count: 1 }
    ]
  },
  h2o: {
    atoms: [
      { x: 0, y: 15, z: 0, color: '#ef4444', radius: 13, name: 'O' }, // Oxygen (red)
      { x: -35, y: -25, z: 0, color: '#38bdf8', radius: 8, name: 'H' }, // Hydrogen
      { x: 35, y: -25, z: 0, color: '#38bdf8', radius: 8, name: 'H' }  // Hydrogen
    ],
    bonds: [
      { from: 0, to: 1, count: 1 },
      { from: 0, to: 2, count: 1 }
    ]
  }
};

function MoleculeBackground() {
  const canvasRef = useRef(null);
  const moleculesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Math: Rotate point in 3D space
  const rotate3D = (point, rx, ry, rz) => {
    let { x, y, z } = point;

    // Rotate X (pitch)
    const cosX = Math.cos(rx), sinX = Math.sin(rx);
    const y1 = y * cosX - z * sinX;
    const z1 = y * sinX + z * cosX;

    // Rotate Y (yaw)
    const cosY = Math.cos(ry), sinY = Math.sin(ry);
    const x2 = x * cosY + z1 * sinY;
    const z2 = -x * sinY + z1 * cosY;

    // Rotate Z (roll)
    const cosZ = Math.cos(rz), sinZ = Math.sin(rz);
    const x3 = x2 * cosZ - y1 * sinZ;
    const y3 = x2 * sinZ + y1 * cosZ;

    return { x: x3, y: y3, z: z2 };
  };

  // Create a randomized molecule instance from template
  const createRandomMolecule = (x, y) => {
    const types = ['co2', 'ch4', 'h2o'];
    const chosenType = types[Math.floor(Math.random() * types.length)];
    const template = MOLECULE_TEMPLATES[chosenType];

    // Deep copy template atoms
    const atoms = template.atoms.map(a => ({ ...a }));
    const bonds = template.bonds.map(b => ({ ...b }));

    return {
      type: chosenType,
      atoms,
      bonds,
      x,
      y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      rx: Math.random() * Math.PI * 2,
      ry: Math.random() * Math.PI * 2,
      rz: Math.random() * Math.PI * 2,
      vrx: (Math.random() - 0.5) * 0.006,
      vry: (Math.random() - 0.5) * 0.006,
      vrz: (Math.random() - 0.5) * 0.006,
      scale: 0.4 + Math.random() * 0.5
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial molecules spawn (e.g. 5 default molecules)
    const initialCount = 5;
    const initialMols = [];
    for (let i = 0; i < initialCount; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      initialMols.push(createRandomMolecule(x, y));
    }
    moleculesRef.current = initialMols;

    // Track mouse coordinates relative to center (scaled -1 to 1)
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      mouseRef.current.targetY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Interactive Click logic for "Free Spaces"
    const handleWindowClick = (e) => {
      const target = e.target;
      if (!target) return;

      // Detect if click was on interactive buttons, inputs, links, dropdowns, or forms
      const isInteractive = (el) => {
        if (!el || el.nodeType !== 1) return false;
        const tag = el.tagName?.toLowerCase();
        if (['button', 'input', 'select', 'a', 'textarea', 'option', 'label'].includes(tag)) return true;
        try {
          const style = window.getComputedStyle(el);
          if (style && style.cursor === 'pointer') return true;
        } catch (err) {
          // Ignore style calculation errors on text/non-element nodes
        }
        return false;
      };

      let el = target;
      while (el && el !== document.body) {
        if (isInteractive(el)) return; // Bypass if user clicked buttons/inputs
        el = el.parentElement;
      }

      // Add a new molecule at click position
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const newMol = createRandomMolecule(clickX, clickY);
      
      // Limit active molecules count to 15 to maintain performance
      if (moleculesRef.current.length >= 15) {
        moleculesRef.current.shift(); // Remove oldest
      }
      moleculesRef.current.push(newMol);

      // Apply explosive push force to all other molecules
      moleculesRef.current.forEach((m) => {
        if (m === newMol) return;

        const dx = m.x - clickX;
        const dy = m.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        if (dist < 400) {
          const pushForce = ((400 - dist) / 400) * 8; // Max 8px push
          const angle = Math.atan2(dy, dx);
          m.vx += Math.cos(angle) * pushForce;
          m.vy += Math.sin(angle) * pushForce;
        }
      });
    };
    window.addEventListener('click', handleWindowClick);

    // Animation Loop
    let animId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Interpolate mouse movement for spring-like look
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      moleculesRef.current.forEach((mol) => {
        // 1. Physics: Move molecules
        mol.x += mol.vx;
        mol.y += mol.vy;

        // Apply friction to slow down after click explosions
        mol.vx *= 0.98;
        mol.vy *= 0.98;

        // Add default low drift speed
        const drift = 0.15;
        if (Math.abs(mol.vx) < drift) mol.vx += (mol.vx >= 0 ? 1 : -1) * 0.01;
        if (Math.abs(mol.vy) < drift) mol.vy += (mol.vy >= 0 ? 1 : -1) * 0.01;

        // Boundary bounce wraps / collisions
        const margin = 100;
        if (mol.x < -margin) mol.x = canvas.width + margin;
        if (mol.x > canvas.width + margin) mol.x = -margin;
        if (mol.y < -margin) mol.y = canvas.height + margin;
        if (mol.y > canvas.height + margin) mol.y = -margin;

        // 2. Rotate based on default speed AND mouse coordinates
        mol.rx += mol.vrx + mouse.y * 0.003;
        mol.ry += mol.vry + mouse.x * 0.003;
        mol.rz += mol.vrz;

        // 3. Project 3D positions to 2D
        const rotAtoms = mol.atoms.map((atom, index) => {
          const rot = rotate3D(atom, mol.rx, mol.ry, mol.rz);
          const depthScale = 300 / (300 + rot.z); // Perspective scale
          return {
            ...atom,
            projX: mol.x + rot.x * mol.scale * depthScale,
            projY: mol.y + rot.y * mol.scale * depthScale,
            projR: atom.radius * mol.scale * depthScale,
            z: rot.z,
            index
          };
        });

        // 4. Render Bonds (Draw bonds first so atoms clip over them)
        mol.bonds.forEach((bond) => {
          const atomA = rotAtoms[bond.from];
          const atomB = rotAtoms[bond.to];

          if (bond.count === 1) {
            // Single bond
            ctx.beginPath();
            ctx.moveTo(atomA.projX, atomA.projY);
            ctx.lineTo(atomB.projX, atomB.projY);
            ctx.strokeStyle = 'rgba(71, 85, 105, 0.18)'; // Slate border line
            ctx.lineWidth = 4 * mol.scale;
            ctx.stroke();
          } else if (bond.count === 2) {
            // Double bond: draw parallel lines offset slightly
            const dx = atomB.projX - atomA.projX;
            const dy = atomB.projY - atomA.projY;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const offsetX = (-dy / len) * 3 * mol.scale;
            const offsetY = (dx / len) * 3 * mol.scale;

            ctx.beginPath();
            ctx.moveTo(atomA.projX + offsetX, atomA.projY + offsetY);
            ctx.lineTo(atomB.projX + offsetX, atomB.projY + offsetY);
            ctx.moveTo(atomA.projX - offsetX, atomA.projY - offsetY);
            ctx.lineTo(atomB.projX - offsetX, atomB.projY - offsetY);
            
            ctx.strokeStyle = 'rgba(71, 85, 105, 0.18)';
            ctx.lineWidth = 2.5 * mol.scale;
            ctx.stroke();
          }
        });

        // 5. Depth Sort Atoms (back to front)
        const sortedAtoms = [...rotAtoms].sort((a, b) => b.z - a.z);

        // 6. Render Atoms as 3D spheres
        sortedAtoms.forEach((atom) => {
          ctx.beginPath();
          ctx.arc(atom.projX, atom.projY, atom.projR, 0, Math.PI * 2);

          // Radial gradient for 3D sphere light projection
          const grad = ctx.createRadialGradient(
            atom.projX - atom.projR * 0.3,
            atom.projY - atom.projR * 0.3,
            atom.projR * 0.08,
            atom.projX,
            atom.projY,
            atom.projR
          );
          
          grad.addColorStop(0, '#ffffff'); // Glare/highlight
          grad.addColorStop(0.15, atom.color);
          grad.addColorStop(0.85, atom.color);
          grad.addColorStop(1, '#050b14'); // Shadow border

          ctx.fillStyle = grad;
          ctx.fill();
        });
      });

      animId = requestAnimationFrame(render);
    };

    render();

    // Cleanup listeners
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleWindowClick);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none w-full h-full"
    />
  );
}

export default MoleculeBackground;
