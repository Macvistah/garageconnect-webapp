import { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    let animId;
    let t = 0;

    const resize = () => {
      c.width = c.offsetWidth;
      c.height = c.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      t++;
      const w = c.width;
      const h = c.height;
      ctx.clearRect(0, 0, w, h);

      // background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, w, h);

      // garage floor
      ctx.fillStyle = '#111';
      ctx.fillRect(0, h * 0.62, w, h * 0.38);
      ctx.fillStyle = '#151515';
      ctx.fillRect(0, h * 0.62, w, 2);

      // floor tiles
      for (let i = 0; i < 12; i++) {
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(i * (w / 11), h * 0.62);
        ctx.lineTo(i * (w / 11), h);
        ctx.stroke();
      }

      // car lift platform
      const liftY = h * 0.63;
      const liftH = 8 + Math.sin(t * 0.008) * 3;
      ctx.fillStyle = '#1e1e1e';
      ctx.fillRect(w * 0.2, liftY, w * 0.6, liftH);
      // lift legs
      ctx.fillStyle = '#222';
      ctx.fillRect(w * 0.28, liftY + liftH, 12, 30 + Math.sin(t * 0.008) * 10);
      ctx.fillRect(w * 0.70, liftY + liftH, 12, 30 + Math.sin(t * 0.008) * 10);

      // car body
      const carY = liftY - 55;
      const carX = w * 0.18;
      const carW = w * 0.64;

      // car underbody glow (orange)
      ctx.fillStyle = 'rgba(232,120,32,0.07)';
      ctx.fillRect(carX, carY + 50, carW, 20);

      // car bottom
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.roundRect(carX, carY + 30, carW, 28, 4);
      ctx.fill();

      // car main body
      ctx.fillStyle = '#222';
      ctx.beginPath();
      ctx.roundRect(carX + 20, carY, carW - 40, 38, [12, 12, 0, 0]);
      ctx.fill();

      // car roof
      ctx.fillStyle = '#1e1e1e';
      ctx.beginPath();
      ctx.roundRect(carX + 60, carY - 26, carW - 140, 30, [8, 8, 0, 0]);
      ctx.fill();

      // windows
      ctx.fillStyle = 'rgba(232,120,32,0.12)';
      ctx.beginPath();
      ctx.roundRect(carX + 68, carY - 22, (carW - 156) * 0.48, 22, [6, 6, 0, 0]);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(carX + 68 + (carW - 156) * 0.52, carY - 22, (carW - 156) * 0.44, 22, [6, 6, 0, 0]);
      ctx.fill();

      // wheels
      const wheelY = carY + 52;
      const wheels = [carX + 60, carX + carW - 60];
      wheels.forEach(wx => {
        // wheel shadow
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath();
        ctx.ellipse(wx, wheelY + 20, 28, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        // tyre
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(wx, wheelY, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#2a2a2a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(wx, wheelY, 22, 0, Math.PI * 2);
        ctx.stroke();
        // rim
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(wx, wheelY, 12, 0, Math.PI * 2);
        ctx.fill();
        // rim spokes
        for (let s = 0; s < 5; s++) {
          const angle = (s / 5) * Math.PI * 2 + t * 0.01;
          ctx.strokeStyle = '#444';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(wx + Math.cos(angle) * 4, wheelY + Math.sin(angle) * 4);
          ctx.lineTo(wx + Math.cos(angle) * 11, wheelY + Math.sin(angle) * 11);
          ctx.stroke();
        }
        // hub cap
        ctx.fillStyle = '#E87820';
        ctx.beginPath();
        ctx.arc(wx, wheelY, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // headlights
      ctx.fillStyle = 'rgba(232,120,32,0.6)';
      ctx.beginPath();
      ctx.roundRect(carX + 22, carY + 8, 18, 10, 3);
      ctx.fill();
      ctx.fillStyle = 'rgba(232,120,32,0.6)';
      ctx.beginPath();
      ctx.roundRect(carX + carW - 40, carY + 8, 18, 10, 3);
      ctx.fill();

      // headlight glow
      const glowPulse = 0.15 + Math.abs(Math.sin(t * 0.03)) * 0.1;
      ctx.fillStyle = `rgba(232,120,32,${glowPulse})`;
      ctx.beginPath();
      ctx.ellipse(carX + 31, carY + 13, 30, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // mechanic body
      const mechX = w * 0.72;
      const mechY = h * 0.62 - 95;
      const armAngle = Math.sin(t * 0.04) * 0.4;

      // mechanic legs
      ctx.fillStyle = '#1e3a5f';
      ctx.fillRect(mechX - 8, mechY + 60, 14, 35);
      ctx.fillRect(mechX + 6, mechY + 60, 14, 35);

      // mechanic torso
      ctx.fillStyle = '#E87820';
      ctx.beginPath();
      ctx.roundRect(mechX - 14, mechY + 20, 38, 42, 4);
      ctx.fill();

      // mechanic arm (moving — working under car)
      ctx.save();
      ctx.translate(mechX - 10, mechY + 35);
      ctx.rotate(armAngle - 0.8);
      ctx.fillStyle = '#E87820';
      ctx.fillRect(-6, 0, 10, 28);
      // wrench
      ctx.fillStyle = '#888';
      ctx.fillRect(-4, 26, 8, 14);
      ctx.beginPath();
      ctx.arc(-4, 40, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(4, 40, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // other arm
      ctx.save();
      ctx.translate(mechX + 24, mechY + 35);
      ctx.rotate(-armAngle * 0.5 + 0.3);
      ctx.fillStyle = '#E87820';
      ctx.fillRect(-4, 0, 10, 22);
      ctx.restore();

      // mechanic head
      ctx.fillStyle = '#c8956b';
      ctx.beginPath();
      ctx.arc(mechX + 5, mechY + 14, 14, 0, Math.PI * 2);
      ctx.fill();

      // helmet/cap
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.roundRect(mechX - 8, mechY + 2, 28, 12, [6, 6, 0, 0]);
      ctx.fill();
      ctx.fillStyle = '#E87820';
      ctx.fillRect(mechX - 10, mechY + 12, 32, 4);

      // spark effects under car (while working)
      if (t % 12 < 6) {
        for (let sp = 0; sp < 4; sp++) {
          const sx = w * 0.42 + Math.random() * 80;
          const sy = carY + 50 + Math.random() * 15;
          ctx.fillStyle = `rgba(232,120,32,${Math.random() * 0.8 + 0.2})`;
          ctx.beginPath();
          ctx.arc(sx, sy, Math.random() * 2 + 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // toolbox
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.roundRect(w * 0.78, h * 0.62 - 30, 50, 28, 4);
      ctx.fill();
      ctx.strokeStyle = '#E87820';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(w * 0.78, h * 0.62 - 30, 50, 28);
      // drawers
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.78, h * 0.62 - 20);
      ctx.lineTo(w * 0.78 + 50, h * 0.62 - 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w * 0.78, h * 0.62 - 10);
      ctx.lineTo(w * 0.78 + 50, h * 0.62 - 10);
      ctx.stroke();
      // handles
      ctx.fillStyle = '#E87820';
      ctx.fillRect(w * 0.78 + 20, h * 0.62 - 26, 10, 3);
      ctx.fillRect(w * 0.78 + 20, h * 0.62 - 16, 10, 3);
      ctx.fillRect(w * 0.78 + 20, h * 0.62 - 6, 10, 3);

      // diagnostic tablet on wall
      const tabX = w * 0.12;
      const tabY = h * 0.25;
      ctx.fillStyle = '#161616';
      ctx.beginPath();
      ctx.roundRect(tabX, tabY, 70, 90, 6);
      ctx.fill();
      ctx.strokeStyle = '#E87820';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(tabX, tabY, 70, 90);
      // screen
      ctx.fillStyle = '#0d0d0d';
      ctx.beginPath();
      ctx.roundRect(tabX + 5, tabY + 5, 60, 65, 3);
      ctx.fill();
      // data lines on screen
      const lineColors = ['#22c55e', '#E87820', '#22c55e', '#ef4444', '#22c55e'];
      lineColors.forEach((col, i) => {
        const barW = 20 + Math.sin(t * 0.05 + i) * 15;
        ctx.fillStyle = col;
        ctx.fillRect(tabX + 8, tabY + 12 + i * 11, barW, 5);
        ctx.fillStyle = '#222';
        ctx.fillRect(tabX + 8 + barW, tabY + 12 + i * 11, 48 - barW, 5);
      });
      // tablet label
      ctx.fillStyle = '#333';
      ctx.font = '8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('DIAGNOSTICS', tabX + 35, tabY + 82);

      // ambient particles
      for (let p = 0; p < 3; p++) {
        const px = (Math.sin(t * 0.01 + p * 2.1) * 0.4 + 0.5) * w;
        const py = (Math.cos(t * 0.008 + p * 1.7) * 0.3 + 0.3) * h;
        ctx.fillStyle = 'rgba(232,120,32,0.08)';
        ctx.beginPath();
        ctx.arc(px, py, 40, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}
