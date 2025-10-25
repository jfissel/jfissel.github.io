(function () {
  "use strict";

  // Particle cluster configuration
  const config = {
    particleCount: 80,
    sphereRadius: 300,
    baseRotationSpeed: 0.00008,
    mouseInfluence: 0.00015,
    particleSize: 4,
    connectionDistance: 180,
    lineOpacity: 0.35,
    particleColor: "rgba(100, 100, 120, 0.6)",
    lineColor: "rgba(80, 80, 100, LINE_OPACITY)",
    floatSpeed: 0.001,
    floatAmplitude: 0.3,
  };

  class Particle {
    constructor(radius) {
      // Generate random point on sphere using spherical coordinates
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      this.originalX = radius * Math.sin(phi) * Math.cos(theta);
      this.originalY = radius * Math.sin(phi) * Math.sin(theta);
      this.originalZ = radius * Math.cos(phi);

      this.x = this.originalX;
      this.y = this.originalY;
      this.z = this.originalZ;

      // Random phase for floating animation
      this.floatPhase = Math.random() * Math.PI * 2;
    }

    rotate(angleX, angleY, time) {
      // Apply floating animation
      const floatOffset =
        Math.sin(time * config.floatSpeed + this.floatPhase) *
        config.floatAmplitude;

      let x = this.originalX;
      let y = this.originalY + floatOffset;
      let z = this.originalZ;

      // Rotate around Y axis
      let tempX = x * Math.cos(angleY) - z * Math.sin(angleY);
      let tempZ = x * Math.sin(angleY) + z * Math.cos(angleY);
      x = tempX;
      z = tempZ;

      // Rotate around X axis
      let tempY = y * Math.cos(angleX) - z * Math.sin(angleX);
      tempZ = y * Math.sin(angleX) + z * Math.cos(angleX);
      y = tempY;
      z = tempZ;

      this.x = x;
      this.y = y;
      this.z = z;
    }

    project(centerX, centerY) {
      // Simple perspective projection
      const scale = 300 / (300 + this.z);
      return {
        x: this.x * scale + centerX,
        y: this.y * scale + centerY,
        scale: scale,
      };
    }
  }

  class ParticleCluster {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.particles = [];
      this.angleX = 0;
      this.angleY = 0;
      this.targetAngleX = 0;
      this.targetAngleY = 0;
      this.animationId = null;
      this.time = 0;

      this.centerX = 0;
      this.centerY = 0;

      this.mouseX = 0;
      this.mouseY = 0;

      this.init();
    }

    init() {
      // Set canvas size
      this.resize();

      // Create particles
      for (let i = 0; i < config.particleCount; i++) {
        this.particles.push(new Particle(config.sphereRadius));
      }

      // Bind event listeners
      this.bindEvents();

      // Start animation
      this.animate();
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;

      this.ctx.scale(dpr, dpr);

      this.centerX = rect.width / 2;
      this.centerY = rect.height / 2;
    }

    bindEvents() {
      // Mouse move for interactivity
      const handleMouseMove = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;

        // Calculate target angles based on mouse position
        this.targetAngleY = (this.mouseX - this.centerX) * config.mouseInfluence;
        this.targetAngleX = (this.mouseY - this.centerY) * config.mouseInfluence;
      };

      this.canvas.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("resize", () => this.resize());
    }

    animate() {
      this.time++;

      // Smooth angle transitions
      this.angleX += (this.targetAngleX - this.angleX) * 0.05;
      this.angleY += (this.targetAngleY - this.angleY) * 0.05;

      // Add base rotation
      this.angleY += config.baseRotationSpeed * this.time;

      // Rotate all particles
      this.particles.forEach((particle) => {
        particle.rotate(this.angleX, this.angleY, this.time);
      });

      // Render
      this.render();

      // Continue animation
      this.animationId = requestAnimationFrame(() => this.animate());
    }

    render() {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Sort particles by Z depth for proper rendering
      const projectedParticles = this.particles
        .map((particle) => ({
          particle,
          projected: particle.project(this.centerX, this.centerY),
        }))
        .sort((a, b) => a.particle.z - b.particle.z);

      // Draw connections first (behind particles)
      this.ctx.strokeStyle = config.lineColor.replace(
        "LINE_OPACITY",
        config.lineOpacity
      );
      this.ctx.lineWidth = 1.2;

      for (let i = 0; i < projectedParticles.length; i++) {
        const p1 = projectedParticles[i];

        for (let j = i + 1; j < projectedParticles.length; j++) {
          const p2 = projectedParticles[j];

          const dx = p1.particle.x - p2.particle.x;
          const dy = p1.particle.y - p2.particle.y;
          const dz = p1.particle.z - p2.particle.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < config.connectionDistance) {
            const opacity =
              config.lineOpacity * (1 - distance / config.connectionDistance);
            this.ctx.strokeStyle = config.lineColor.replace(
              "LINE_OPACITY",
              opacity
            );
            this.ctx.beginPath();
            this.ctx.moveTo(p1.projected.x, p1.projected.y);
            this.ctx.lineTo(p2.projected.x, p2.projected.y);
            this.ctx.stroke();
          }
        }
      }

      // Draw particles
      projectedParticles.forEach(({ particle, projected }) => {
        const size = Math.min(config.particleSize * projected.scale, config.particleSize * 1.5);
        const opacity = 0.5 + projected.scale * 0.5;

        this.ctx.fillStyle = config.particleColor.replace("0.8", opacity);
        this.ctx.beginPath();
        this.ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2);
        this.ctx.fill();
      });
    }

    destroy() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }
  }

  // Initialize particle cluster when DOM is ready
  const initParticleCluster = () => {
    const canvas = document.getElementById("particle-cluster");
    if (!canvas) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      canvas.style.display = "none";
      return;
    }

    // Initialize cluster
    new ParticleCluster(canvas);
  };

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initParticleCluster, {
      once: true,
    });
  } else {
    initParticleCluster();
  }
})();
