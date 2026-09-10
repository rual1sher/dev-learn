import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

/**
 * Dynamic Vector Animated Mascot: Dotty (Halftone Matrix)
 * Generates an algorithmic breathing halftone mascot
 */
export default function AnimatedDotty({ size = 48, animated = true, style }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!animated) return;
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 360);
    }, 45); // ~22 FPS - smoothly morphing vectors without JS thread overhead
    return () => clearInterval(interval);
  }, [animated]);

  const width = size;
  const height = size;
  const centerX = width / 2;
  const centerY = height / 2;

  // Grid step: produces ~50 crisp vector halftone dots
  const dotSpacing = size / 13;
  const maxRadius = dotSpacing * 0.44;

  // Time variable (radians)
  const t = (frame * Math.PI) / 36; // 72 frames for a full organic breathing cycle

  // 1. Vector radii: breathing / morphing ellipse
  const baseRx = size * 0.39;
  const baseRy = size * 0.29;
  const rx = animated ? baseRx + Math.sin(t) * (size * 0.035) : baseRx;
  const ry = animated ? baseRy + Math.cos(t) * (size * 0.028) : baseRy;

  // 2. Vector rotation: organic angle wobble (swaying ±12 deg around 45deg)
  const angle = (Math.PI / 4) + (animated ? Math.sin(t * 0.7) * 0.20 : 0);

  const cosA = Math.cos(-angle);
  const sinA = Math.sin(-angle);
  const rxSq = rx * rx;
  const rySq = ry * ry;

  const dots = [];
  let key = 0;

  for (let y = dotSpacing * 0.6; y < height; y += dotSpacing) {
    for (let x = dotSpacing * 0.6; x < width; x += dotSpacing) {
      const dx = x - centerX;
      const dy = y - centerY;

      // Vector coordinate transformation
      const rotatedX = dx * cosA - dy * sinA;
      const rotatedY = dx * sinA + dy * cosA;

      const distSq = (rotatedX * rotatedX) / rxSq + (rotatedY * rotatedY) / rySq;

      if (distSq <= 1.03) {
        // Base intensity rings from Gemini algorithm
        let intensity;
        if (distSq < 0.30) {
          intensity = 0.92; // Core
        } else if (distSq < 0.62) {
          intensity = 0.35; // Lighter ring
        } else {
          intensity = 0.65; // Shell
        }

        // 3. Dynamic halftone undulating ripple wave across the dot vectors
        if (animated) {
          const wave = Math.sin(distSq * Math.PI * 2.6 - t * 1.5) * 0.16;
          intensity = Math.max(0.15, Math.min(1.0, intensity + wave));
        }

        const r = intensity * maxRadius;

        dots.push(
          <View
            key={key++}
            style={{
              position: 'absolute',
              left: x - r,
              top: y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: r,
              backgroundColor: '#000000',
            }}
          />
        );
      }
    }
  }

  return (
    <View style={[{ width: size, height: size, position: 'relative' }, style]}>
      {dots}
    </View>
  );
}
