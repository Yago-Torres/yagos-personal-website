<!-- src/lib/Scene.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { T, extend, useTask } from '@threlte/core';
  import { interactivity } from '@threlte/extras';
  import { Spring } from 'svelte/motion';
  import { MTLLoader, OBJLoader } from 'three-stdlib';
  import * as THREE from 'three';

  // register all THREE classes so <T.primitive> knows what to do
  extend(THREE);

  interactivity();

  // hover‐scale spring
  const scale = new Spring(1);

  // rotation
  let rotation = 0;
  useTask((delta) => (rotation += delta));

  // loaded model goes here
  let citizenModel: THREE.Group | null = null;

  onMount(() => {
    const mtlLoader = new MTLLoader();
    mtlLoader.load(
      '/models/citizen.mtl',
      (materials) => {
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
          '/models/citizen.obj',
          (group) => (citizenModel = group),
          undefined,
          (err) => console.error(err)
        );
      },
      undefined,
      (err) => console.error(err)
    );
  });
</script>

{#if citizenModel}
  <T.PerspectiveCamera
    makeDefault
    position={[10, 10, 10]}
    oncreate={(cam) => cam.lookAt(0, 1, 0)}
  />
  <T.DirectionalLight position={[0, 10, 10]} castShadow />

  <!-- now Threlte knows about THREE.Group, Mesh, Materials, etc. -->

  <T
    is={citizenModel}
    rotation-y={rotation}
    position-y={1}
    scale={scale.current}
    castShadow
    receiveShadow
    onpointerenter={() => scale.target = 1.5}
    onpointerleave={() => scale.target = 1}
  />

    <T.Mesh rotation-x={-Math.PI / 2} receiveShadow>
    <T.CircleGeometry args={[4, 40]} />
    <T.MeshStandardMaterial color="white" />
  </T.Mesh>
{:else}
  <div style="position: absolute; top: 1rem; left: 1rem; color: white">
    Loading model…
  </div>
{/if}
