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

  // hover‐scale spring
  const scale = new Spring(0.1);

 const keys: Record<string, boolean> = { w: false, a: false, s: false, d: false };
const moveSpeed = 2;
let rotation = 0;

  // rotation
  useTask((delta) => (rotation += delta));

  // loaded model goes here
  let citizen: THREE.Group | null = null;

  onMount(() => {
    new FBXLoader().load(
      '/models/citizen.fbx',
      (g) => {
        g.position.y = 1;
        g.scale.set(0.01, 0.01, 0.01);
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
    if (!citizen) return;

    // spin
    rotation += delta;
    citizen.rotation.y = rotation;

    // WASD move
    const dx = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
    const dz = (keys.s ? 1 : 0) - (keys.w ? 1 : 0);
    citizen.position.x += dx * moveSpeed * delta;
    citizen.position.z += dz * moveSpeed * delta;

    // hover-scale
    const s = scale.current;
    citizen.scale.set(s, s, s);
  });
</script>



{#if citizen}
  <T.PerspectiveCamera
    makeDefault
    position={[1000, 1000, 1000]}
    oncreate={(cam) => cam.lookAt(0, 1, 0)}
  />
  <T.DirectionalLight position={[0, 10, 10]} castShadow />


  <T
    is={citizen}
    scale={[0.0001, 0.0001, 0.0001]}
    rotation-y={rotation}
    position-y={1}
    castShadow
    receiveShadow
    onpointerenter={() => scale.target = 1}
    onpointerleave={() => scale.target = 1}
  />

    <T.Mesh rotation-x={-Math.PI / 2} receiveShadow>
    <!-- 1000×1000 units spans far beyond the camera frustum -->
    <T.PlaneGeometry args={[1000, 1000]} />
    <T.MeshStandardMaterial color="white" />
  </T.Mesh>
{:else}
  <div style="position: absolute; top: 1rem; left: 1rem; color: white">
    Loading model…
  </div>
{/if}
