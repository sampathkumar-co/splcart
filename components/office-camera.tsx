"use client";

/**
 * Room-to-room cinematic camera transitions.
 *
 * Adapted from the CameraAnimator approach in:
 * https://github.com/iamlukethedev/Hermes3D
 * src/features/retro-office/systems/cameraLighting.tsx
 * Copyright (c) 2026 Luke The Dev, MIT License.
 * The complete applicable license is retained at
 * docs/third-party/Hermes3D-LICENSE.txt.
 *
 * This is a deliberately isolated subset, not a Hermes backend integration.
 */
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type ElementRef } from "react";
import * as THREE from "three";
import type { RoomKey } from "./office";

export type OfficeView = RoomKey | "overview";
type Pose = {
  position: [number, number, number];
  target: [number, number, number];
};

/** All positions are in the locally authored jewellery HQ scene coordinate system. */
export const OFFICE_CAMERA_POSES: Record<OfficeView, Pose> = {
  overview: { position: [10.2, 10.8, 12.1], target: [0, 0.4, 0] },
  ceo: { position: [2.5, 6.3, 3.9], target: [-4.1, 0.6, -2.6] },
  sales: { position: [10.0, 6.3, 3.6], target: [3.6, 0.6, -2.6] },
  marketing: { position: [2.8, 6.4, 9.0], target: [-4.1, 0.6, 3.05] },
  meeting: { position: [10.4, 6.3, 9.5], target: [3.6, 0.6, 3.05] },
};

export function OfficeCamera({ view }: { view: OfficeView }) {
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);
  const desiredRef = useRef<Pose | null>(null);
  const reducedMotionRef = useRef(false);
  const positionRef = useRef(new THREE.Vector3());
  const lookAtRef = useRef(new THREE.Vector3());
  const { camera } = useThree();

  useEffect(() => {
    desiredRef.current = OFFICE_CAMERA_POSES[view];
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, [view]);

  useFrame((_, delta) => {
    const desired = desiredRef.current;
    const controls = controlsRef.current;
    if (!desired || !controls) return;

    positionRef.current.set(...desired.position);
    lookAtRef.current.set(...desired.target);

    // Time-corrected damping, with instant positioning for reduced-motion users.
    const blend = reducedMotionRef.current ? 1 : 1 - Math.exp(-6 * Math.min(delta, 0.05));
    camera.position.lerp(positionRef.current, blend);
    controls.target.lerp(lookAtRef.current, blend);
    controls.update();

    if (
      camera.position.distanceToSquared(positionRef.current) < 0.0025 &&
      controls.target.distanceToSquared(lookAtRef.current) < 0.0025
    ) {
      camera.position.copy(positionRef.current);
      controls.target.copy(lookAtRef.current);
      controls.update();
      desiredRef.current = null;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      target={[0, 0.4, 0]}
      enablePan={false}
      minDistance={7}
      maxDistance={35}
      maxPolarAngle={Math.PI / 2.22}
      minPolarAngle={0.3}
      enableDamping
      dampingFactor={0.08}
    />
  );
}
