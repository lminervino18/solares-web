# Three (optional 3D)

Optional 3D building blocks. No 3D scene is rendered by default and the site is fully
usable without WebGL.

## Files

- `ThreeFallback/ThreeFallback.tsx` — static, accessible placeholder shown while a scene
  loads, when reduced motion is preferred, or when WebGL is unavailable.
- `LazyThreeScene/LazyThreeScene.tsx` — wrapper that loads a scene only when it enters the
  viewport and motion is allowed, keeping `three`, `@react-three/fiber` and
  `@react-three/drei` out of the initial bundle and off pages that do not use them.

## Usage

Create a scene module with a default export and pass a dynamic import to `LazyThreeScene`:

```tsx
<LazyThreeScene label="Escena del estadio" load={() => import('@/features/.../StadiumScene')} />
```

## Rules

- Load 3D dependencies dynamically; never in the initial bundle.
- Always provide a static fallback.
- Limit device pixel ratio and pause on tab visibility change inside the scene.
- Respect `prefers-reduced-motion`.
- Never gate essential content behind WebGL.
