<!-- src/lib/Scene.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { T, extend, useTask } from '@threlte/core';

  import { interactivity } from '@threlte/extras';
  import { Spring } from 'svelte/motion';
  import { MTLLoader, OBJLoader } from 'three-stdlib';
  import { FBXLoader } from 'three-stdlib';
  import * as THREE from 'three';


  interactivity();

  const keys: Record<string, boolean> = { w: false, a: false, s: false, d: false, space: false };
  const moveSpeed = 10;
  let posX = 0;
  let posZ = 0;
  let posY = 1;
  let rotation = 0;
  const jumpSpeed = 5;     // tweak this
  const gravity   = 9.8;   // world units / s²
  let velocityY = 0;
  let onGround = true;
  let cameraRef: THREE.PerspectiveCamera | null = null;
  const cameraOffset = new THREE.Vector3(0, 3, -6);



  // loaded model goes here
  let citizen: THREE.Group | null = null;

  onMount(() => {
    new FBXLoader().load(
      '/models/citizen.fbx',
      (g) => {
        g.position.set(0, posY, 0);
        g.scale.set(1, 1, 1);
        citizen = g;
      },
      undefined,
      console.error
    );

    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in keys) keys[k] = true;
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in keys) keys[k] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  });

useTask((delta: number) => {
  if (!citizen || !cameraRef) return;


    const dx = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
    const dz = (keys.w ? 1 : 0) - (keys.s ? 1 : 0);

    // Rotation
    if (dx !== 0 || dz !== 0) {
  // atan2(x, z) gives the angle around Y from the +Z axis toward +X
  const targetYaw = Math.atan2(dx, dz);
  // smoothly interpolate toward it (or just snap: rotation = targetYaw)
  rotation += (targetYaw - rotation) * Math.min(delta * 10, 1);
}

    posX += dx * moveSpeed * delta;
    posZ += dz * moveSpeed * delta;

 if (keys.Space && onGround) {
      velocityY = jumpSpeed;
      onGround = false;
    }
    // apply gravity
    velocityY -= gravity * delta;
    posY      += velocityY * delta;
    // ground collision
    if (posY <= 1) {
      posY = 1;
      velocityY = 0;
      onGround = true;
    }

      const targetPos = new THREE.Vector3(posX, posY, posZ);
      const desiredCamPos = targetPos
      .clone()
      .add(new THREE.Vector3(0, 3, -6).applyAxisAngle(
      new THREE.Vector3(0,1,0),
      rotation
    ));

    const followSpeed = 5;                            // units per second
    const t = Math.min(1, followSpeed * delta);       // fraction to move this frame
    cameraRef.position.lerp(desiredCamPos, t);
    cameraRef.lookAt(targetPos);

  });
</script>



{#if citizen}

  <T.PerspectiveCamera
    makeDefault
    position={[0, 3, -6]}
    oncreate={(cam: THREE.PerspectiveCamera) => {
      cameraRef = cam;
    }}
  />
 
  <T.DirectionalLight position={[0, 10, 10]} castShadow />


  <T
    is={citizen}
    scale={[0.0005, 0.0005, 0.0005]}
    rotation-y={rotation}
    position={[posX, posY, posZ]}
    castShadow
    receiveShadow
    
  />

  <T.Mesh
  rotation={[-Math.PI / 2, 0, 0]}
  position={[0, 0.01, 0]}
  receiveShadow
>
  <T.PlaneGeometry args={[1000, 1000]} />
  <T.MeshStandardMaterial color="green" />
</T.Mesh>

{:else}
  <div style="position: absolute; top: 1rem; left: 1rem; color: white">
    Loading model…
  </div>
{/if}
