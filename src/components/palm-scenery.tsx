"use client";

import { useEffect, useRef, useState } from "react";

import palmAssets from "../../data/palm-assets.json";

const layers = ["landscape", "tree", "right-trees"] as const;
const vertexSource = `
attribute vec2 position;
attribute vec2 texturePosition;
varying vec2 uv;
uniform float time;
uniform float moving;
uniform float tree;
vec2 turn(vec2 p, float angle) {
  return vec2(p.x * cos(angle) - p.y * sin(angle), p.x * sin(angle) + p.y * cos(angle));
}
float trunkMask(vec2 p, vec2 crown, vec2 root, float scale) {
  float along = clamp((p.y - crown.y) / (root.y - crown.y), 0.0, 1.0);
  float center = mix(crown.x, root.x, along);
  return (1.0 - smoothstep(14.0 * scale, 30.0 * scale, abs(p.x - center)))
    * smoothstep(crown.y - 4.0 * scale, crown.y + 18.0 * scale, p.y);
}
vec2 palmMotion(vec2 p, vec2 crown, vec2 root, float scale, float phase, float protectedTrunk) {
  vec2 delta = p - crown;
  float radius = length(delta) / scale;
  float angle = atan(delta.y, delta.x);
  float flutter = 0.0;
  float weight = 0.0;
  for (int i = 0; i < 10; i++) {
    float n = float(i);
    float direction = -2.9 + n * 0.62;
    float distance = abs(atan(sin(angle - direction), cos(angle - direction)));
    float influence = exp(-distance * distance * 14.0);
    float offset = n * 2.399 + phase;
    float frequency = 1.45 + mod(n * 0.37 + phase * 0.13, 1.05);
    float amplitude = 0.025 + mod(n * 0.007, 0.021);
    float gust = 0.8 + 0.2 * sin(time * 0.43 + offset);
    float wave = sin(time * frequency + offset) * 0.78
      + sin(time * frequency * 1.73 - offset) * 0.22;
    flutter += influence * wave * amplitude * gust;
    weight += influence;
  }
  float crownMask = 1.0 - smoothstep(96.0, 156.0, delta.y / scale);
  float tip = smoothstep(12.0, 125.0, radius);
  float entrance = smoothstep(0.0, 1.2, time);
  float bend = (sin(time * 1.18 - 0.35 + phase) * 0.012 + flutter / max(weight, 0.001) * tip)
    * crownMask * (1.0 - protectedTrunk) * entrance;
  p += (turn(delta, bend) - delta) * smoothstep(4.0, 45.0, radius);
  // A rigid root rotation preserves the trunk's thickness and natural curvature.
  float sway = (sin(time * 1.18 + phase) * 0.011 + sin(time * 0.53 + phase) * 0.003) * entrance;
  vec2 stem = p - root;
  p += (turn(stem, sway) - stem) * smoothstep(0.0, 18.0, root.y - position.y);
  return p;
}
void main() {
  vec2 p = position;
  if (moving > 0.5 && tree > 0.5) {
    if (tree < 1.5) {
      vec2 crown = vec2(187.0, 239.0);
      vec2 root = vec2(154.0, 375.0);
      vec2 moved = palmMotion(p, crown, root, 1.0, 0.0, trunkMask(p, crown, vec2(98.0, 527.0), 1.0));
      // Hold the lower trunk and its mountain crossing completely still.
      p = mix(position, moved, 1.0 - smoothstep(325.0, 375.0, position.y));
    } else {
      vec2 crownA = vec2(1915.0, 215.0);
      vec2 rootA = vec2(2002.0, 534.0);
      vec2 crownB = vec2(2070.0, 320.0);
      vec2 rootB = vec2(2082.0, 534.0);
      float protectedTrunk = max(trunkMask(p, crownA, rootA, 1.0), trunkMask(p, crownB, rootB, 0.72));
      vec2 a = palmMotion(p, crownA, rootA, 1.0, 0.8, protectedTrunk);
      vec2 b = palmMotion(p, crownB, rootB, 0.72, 1.9, protectedTrunk);
      // Blend only between the overlapping crowns; keep each trunk in one field.
      float boundary = 2010.0 + max(0.0, p.y - 320.0) * 0.14;
      p = mix(a, b, smoothstep(boundary - 25.0, boundary + 25.0, p.x));
    }
  }
  gl_Position = vec4(p.x / 2172.0 * 2.0 - 1.0, 1.0 - p.y / 724.0 * 2.0, 0.0, 1.0);
  uv = texturePosition;
}`;

const fragmentSource = `
precision highp float;
varying vec2 uv;
uniform sampler2D artwork;
uniform float time;
uniform float moving;
uniform float tree;
void main() {
  vec2 sampleUv = uv;
  if (tree < 0.5 && moving > 0.5) {
    vec2 p = uv * vec2(2172.0, 724.0);
    float leftRow = smoothstep(539.0, 553.0, p.y) * (1.0 - smoothstep(572.0, 601.0, p.y))
      * (1.0 - smoothstep(850.0, 940.0, p.x));
    float rightRow = smoothstep(575.0, 588.0, p.y) * (1.0 - smoothstep(607.0, 636.0, p.y))
      * smoothstep(1240.0, 1320.0, p.x);
    float edges = smoothstep(0.0, 28.0, p.x) * (1.0 - smoothstep(2144.0, 2172.0, p.x));
    float breeze = sin(time * 1.45 - p.x * 0.012) * 1.25 + sin(time * 0.81 + p.x * 0.021) * 0.45;
    float foreground = smoothstep(607.0, 645.0, p.y);
    float pathLeft = 1030.0 + (p.y - 620.0) * 1.64;
    float pathRight = 1107.0 + (p.y - 620.0) * 2.45;
    float besidePath = (1.0 - smoothstep(pathLeft - 55.0, pathLeft - 25.0, p.x))
      + smoothstep(pathRight + 25.0, pathRight + 55.0, p.x);
    float nearBreeze = sin(time * 1.65 - p.x * 0.02 + p.y * 0.045) * 2.3
      + sin(time * 2.7 + p.x * 0.038 - p.y * 0.023) * 0.65;
    float clumps = 0.75 + 0.25 * sin(p.y * 0.13 + p.x * 0.009);
    float drift = breeze * (leftRow + rightRow) + nearBreeze * foreground * besidePath * clumps;
    sampleUv.x += drift * edges * smoothstep(0.0, 1.2, time) / 2172.0;
  }
  gl_FragColor = texture2D(artwork, sampleUv);
}
`;

function mesh(
  left: number,
  top: number,
  width: number,
  height: number,
  columns: number,
  rows: number,
) {
  const vertices: number[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      for (const [dx, dy] of [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 0],
        [1, 1],
        [0, 1],
      ]) {
        const u = (x + dx!) / columns;
        const v = (y + dy!) / rows;
        vertices.push(left + u * width, top + v * height, u, v);
      }
    }
  }
  return new Float32Array(vertices);
}

export function PalmScenery() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const desktop = matchMedia("(min-width: 1280px)");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    if (!gl) return;
    let disposed = false;
    let visible = false;
    let initialized = false;
    let loading = false;
    let frame = 0;
    let lastTime = 0;
    let elapsed = 0;
    const textures: WebGLTexture[] = [];
    const buffers: WebGLBuffer[] = [];
    const shaders: WebGLShader[] = [];
    const program = gl.createProgram();
    if (!program) return;
    const shader = (type: number, source: string) => {
      const result = gl.createShader(type);
      if (!result) throw new Error("Could not create palm shader");
      shaders.push(result);
      gl.shaderSource(result, source);
      gl.compileShader(result);
      if (!gl.getShaderParameter(result, gl.COMPILE_STATUS))
        throw new Error("Could not compile palm shader");
      gl.attachShader(program, result);
    };
    let position = 0;
    let texturePosition = 0;
    let time: WebGLUniformLocation | null = null;
    let moving: WebGLUniformLocation | null = null;
    let tree: WebGLUniformLocation | null = null;
    const scenery = mesh(0, 0, 2172, 724, 1, 1);
    const palm = mesh(20, 70, 320, 470, 40, 59);
    const rightPalms = mesh(1760, 60, 412, 485, 52, 61);
    const drawLayer = (vertices: Float32Array, layer: number) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers[layer]!);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 16, 0);
      gl.vertexAttribPointer(texturePosition, 2, gl.FLOAT, false, 16, 8);
      gl.bindTexture(gl.TEXTURE_2D, textures[layer]!);
      gl.uniform1f(tree, layer);
      gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 4);
    };
    const render = () => {
      if (!initialized || disposed || !desktop.matches) return;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(time, elapsed);
      gl.uniform1f(moving, reducedMotion.matches ? 0 : 1);
      drawLayer(scenery, 0);
      drawLayer(palm, 1);
      drawLayer(rightPalms, 2);
    };
    const tick = (now: number) => {
      if (lastTime) elapsed += Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      render();
      frame = requestAnimationFrame(tick);
    };
    const update = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      lastTime = 0;
      render();
      if (
        initialized &&
        visible &&
        desktop.matches &&
        !reducedMotion.matches &&
        !document.hidden
      )
        frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const ratio = Math.min(devicePixelRatio, 2);
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      gl.viewport(0, 0, canvas.width, canvas.height);
      render();
    };
    const load = async () => {
      if (!desktop.matches || initialized || disposed || loading)
        return update();
      loading = true;
      try {
        const images = await Promise.all(
          layers.map(async (layer) => {
            const image = new Image();
            image.src = `/images/covers/palm/${layer}-twilight.webp?v=${palmAssets.revision}`;
            await image.decode();
            return image;
          }),
        );
        if (disposed) return;
        shader(gl.VERTEX_SHADER, vertexSource);
        shader(gl.FRAGMENT_SHADER, fragmentSource);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
          throw new Error("Could not link palm shaders");
        gl.useProgram(program);
        position = gl.getAttribLocation(program, "position");
        texturePosition = gl.getAttribLocation(program, "texturePosition");
        gl.enableVertexAttribArray(position);
        gl.enableVertexAttribArray(texturePosition);
        time = gl.getUniformLocation(program, "time");
        moving = gl.getUniformLocation(program, "moving");
        tree = gl.getUniformLocation(program, "tree");
        for (const vertices of [scenery, palm, rightPalms]) {
          const buffer = gl.createBuffer();
          if (!buffer) throw new Error("Could not create palm buffer");
          buffers.push(buffer);
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        }
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        for (const image of images) {
          const texture = gl.createTexture();
          if (!texture) throw new Error("Could not create palm texture");
          textures.push(texture);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            image,
          );
        }
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        initialized = true;
        resize();
        update();
        setReady(true);
      } catch {
        // Unsupported GPU/image loading: retain the original static illustration.
        initialized = false;
        if (!disposed) setReady(false);
      } finally {
        loading = false;
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      update();
    });
    const sizing = new ResizeObserver(resize);
    observer.observe(canvas);
    sizing.observe(canvas);
    const contextLost = () => {
      initialized = false;
      cancelAnimationFrame(frame);
      setReady(false);
    };
    canvas.addEventListener("webglcontextlost", contextLost);
    desktop.addEventListener("change", load);
    reducedMotion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    void load();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizing.disconnect();
      canvas.removeEventListener("webglcontextlost", contextLost);
      desktop.removeEventListener("change", load);
      reducedMotion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      textures.forEach((texture) => gl.deleteTexture(texture));
      buffers.forEach((buffer) => gl.deleteBuffer(buffer));
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="palm-scenery"
      aria-hidden="true"
      data-ready={ready}
    />
  );
}
