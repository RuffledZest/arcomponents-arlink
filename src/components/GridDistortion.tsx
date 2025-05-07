/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import './GridDistortion.css';
import { ArweaveGridProps } from '@/types/arweave';
import { createAOProcess, executeLuaHandler, commonLuaHandlers } from '@/utils/arweaveUtils';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform vec2 mouse;
uniform float time;
uniform float grid;
uniform float strength;
uniform float relaxation;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  // Calculate grid distortion
  float gridSize = 1.0 / grid;
  vec2 gridPos = floor(uv * grid) * gridSize;
  vec2 gridOffset = uv - gridPos;
  
  // Apply mouse-based distortion
  vec2 mouseOffset = (mouse - 0.5) * 2.0;
  float distortion = sin(time + uv.x * 10.0) * strength;
  
  // Combine distortions with relaxation
  uv.x += distortion * (1.0 - relaxation) + mouseOffset.x * strength;
  uv.y += distortion * (1.0 - relaxation) + mouseOffset.y * strength;
  
  // Sample texture with distorted coordinates
  gl_FragColor = texture2D(uTexture, uv);
}`;

const GridDistortion: React.FC<ArweaveGridProps> = ({
  imageSrc,
  grid = 15,
  mouse = 0.1,
  strength = 0.15,
  relaxation = 0.9,
  className = '',
  aoProcessId,
  // luaCode,
  // onConnect,
  // onDisconnect,
  // onTransaction,
  onMessage,
  // onInbox,
  onError,
  onGridUpdate
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const [process, setProcess] = useState<any>(null);
  const [gridPresets, setGridPresets] = useState<any[]>([]);

  useEffect(() => {
    // Initialize AO process if not provided
    if (!aoProcessId) {
      createAOProcess('GridDistortion', 'A grid distortion effect with Lua handlers', [
        ...commonLuaHandlers,
        {
          name: 'updateGrid',
          code: `function updateGrid(params)
  local grid = params.grid or 15
  local mouse = params.mouse or 0.1
  local strength = params.strength or 0.15
  local relaxation = params.relaxation or 0.9
  
  return {
    success = true,
    grid = grid,
    mouse = mouse,
    strength = strength,
    relaxation = relaxation
  }
end`,
          description: 'Update grid distortion parameters',
          parameters: [
            { name: 'grid', type: 'number', description: 'Grid size' },
            { name: 'mouse', type: 'number', description: 'Mouse sensitivity' },
            { name: 'strength', type: 'number', description: 'Distortion strength' },
            { name: 'relaxation', type: 'number', description: 'Distortion relaxation' }
          ],
          returnType: '{ success: boolean, grid: number, mouse: number, strength: number, relaxation: number }',
          example: `local result = updateGrid({ grid = 20, mouse = 0.2, strength = 0.2, relaxation = 0.8 })
print(result.success) -- true
print(result.grid) -- 20`
        },
        {
          name: 'saveGridPreset',
          code: `function saveGridPreset(params)
  local name = params.name or "Default Preset"
  local grid = params.grid or 15
  local mouse = params.mouse or 0.1
  local strength = params.strength or 0.15
  local relaxation = params.relaxation or 0.9
  
  -- Store preset in Arweave
  local preset = {
    name = name,
    grid = grid,
    mouse = mouse,
    strength = strength,
    relaxation = relaxation,
    timestamp = os.time()
  }
  
  return {
    success = true,
    preset = preset
  }
end`,
          description: 'Save current grid settings as a preset',
          parameters: [
            { name: 'name', type: 'string', description: 'Preset name' },
            { name: 'grid', type: 'number', description: 'Grid size' },
            { name: 'mouse', type: 'number', description: 'Mouse sensitivity' },
            { name: 'strength', type: 'number', description: 'Distortion strength' },
            { name: 'relaxation', type: 'number', description: 'Distortion relaxation' }
          ],
          returnType: '{ success: boolean, preset: { name: string, grid: number, mouse: number, strength: number, relaxation: number, timestamp: number } }',
          example: `local result = saveGridPreset({ name = "My Preset", grid = 20, mouse = 0.2, strength = 0.2, relaxation = 0.8 })
print(result.success) -- true
print(result.preset.name) -- "My Preset"`
        },
        {
          name: 'loadGridPreset',
          code: `function loadGridPreset(params)
  local presetId = params.presetId
  
  -- Load preset from Arweave
  local preset = {
    name = "Loaded Preset",
    grid = 20,
    mouse = 0.2,
    strength = 0.2,
    relaxation = 0.8
  }
  
  return {
    success = true,
    preset = preset
  }
end`,
          description: 'Load a saved grid preset',
          parameters: [
            { name: 'presetId', type: 'string', description: 'Preset ID' }
          ],
          returnType: '{ success: boolean, preset: { name: string, grid: number, mouse: number, strength: number, relaxation: number } }',
          example: `local result = loadGridPreset({ presetId = "preset123" })
print(result.success) -- true
print(result.preset.name) -- "Loaded Preset"`
        },
        {
          name: 'shareGridState',
          code: `function shareGridState(params)
  local grid = params.grid or 15
  local mouse = params.mouse or 0.1
  local strength = params.strength or 0.15
  local relaxation = params.relaxation or 0.9
  
  -- Share state through AO messages
  return {
    success = true,
    message = {
      type = "gridState",
      grid = grid,
      mouse = mouse,
      strength = strength,
      relaxation = relaxation
    }
  }
end`,
          description: 'Share current grid state with other users',
          parameters: [
            { name: 'grid', type: 'number', description: 'Grid size' },
            { name: 'mouse', type: 'number', description: 'Mouse sensitivity' },
            { name: 'strength', type: 'number', description: 'Distortion strength' },
            { name: 'relaxation', type: 'number', description: 'Distortion relaxation' }
          ],
          returnType: '{ success: boolean, message: { type: string, grid: number, mouse: number, strength: number, relaxation: number } }',
          example: `local result = shareGridState({ grid = 20, mouse = 0.2, strength = 0.2, relaxation = 0.8 })
print(result.success) -- true
print(result.message.type) -- "gridState"`
        }
      ]).then(setProcess);
    }
  }, [aoProcessId]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    cameraRef.current = camera;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageSrc, (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      textureRef.current = texture;

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          mouse: { value: new THREE.Vector2(0, 0) },
          time: { value: 0 },
          grid: { value: grid },
          strength: { value: strength },
          relaxation: { value: relaxation }
        },
        vertexShader,
        fragmentShader
      });
      materialRef.current = material;

      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const handleResize = () => {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        renderer.setSize(width, height);
      };

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1 - (e.clientY - rect.top) / rect.height;
        material.uniforms.mouse.value.set(x, y);

        // Execute Lua handler for mouse movement
        if (process) {
          executeLuaHandler(process.id, 'onMessage', {
            type: 'mouseMove',
            x,
            y
          }).catch(onError);
        }
      };

      window.addEventListener('resize', handleResize);
      container.addEventListener('mousemove', handleMouseMove);
      handleResize();

      let animationFrameId: number;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        material.uniforms.time.value += 0.01;
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        container.removeEventListener('mousemove', handleMouseMove);
        renderer.dispose();
        texture.dispose();
        geometry.dispose();
        material.dispose();
      };
    });

    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
      if (materialRef.current) {
        materialRef.current.dispose();
        materialRef.current = null;
      }
      if (sceneRef.current) {
        sceneRef.current.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
        sceneRef.current = null;
      }
      if (cameraRef.current) {
        cameraRef.current = null;
      }
    };
  }, [imageSrc, grid, strength, relaxation, process, onError]);

  // Handle grid updates through Lua
  useEffect(() => {
    if (process && onGridUpdate) {
      executeLuaHandler(process.id, 'updateGrid', {
        grid,
        mouse,
        strength,
        relaxation
      })
        .then(result => {
          if (result.success) {
            onGridUpdate({
              grid: result.grid,
              mouse: result.mouse,
              strength: result.strength,
              relaxation: result.relaxation
            });
          }
        })
        .catch(onError);
    }
  }, [grid, mouse, strength, relaxation, process, onGridUpdate, onError]);

  // Handle grid presets
  useEffect(() => {
    if (process) {
      // Load saved presets
      executeLuaHandler(process.id, 'loadGridPreset', { presetId: 'all' })
        .then(result => {
          if (result.success && result.presets) {
            setGridPresets(result.presets);
          }
        })
        .catch(onError);
    }
  }, [process, onError]);

  // Handle shared grid states
  useEffect(() => {
    if (process && onMessage) {
      const handleMessage = (message: any) => {
        if (message.type === 'gridState') {
          onGridUpdate?.({
            grid: message.grid,
            mouse: message.mouse,
            strength: message.strength,
            relaxation: message.relaxation
          });
        }
      };

      onMessage(handleMessage);
    }
  }, [process, onMessage, onGridUpdate]);

  return (
    <div 
      ref={containerRef} 
      className={`grid-distortion-container ${className}`}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '300px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Add preset controls */}
      <div className="grid-preset-controls">
        <select
          onChange={(e) => {
            const preset = gridPresets.find(p => p.id === e.target.value);
            if (preset) {
              onGridUpdate?.({
                grid: preset.grid,
                mouse: preset.mouse,
                strength: preset.strength,
                relaxation: preset.relaxation
              });
            }
          }}
        >
          <option value="">Select Preset</option>
          {gridPresets.map(preset => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            if (process) {
              executeLuaHandler(process.id, 'saveGridPreset', {
                name: 'Custom Preset',
                grid,
                mouse,
                strength,
                relaxation
              })
                .then(result => {
                  if (result.success) {
                    setGridPresets(prev => [...prev, result.preset]);
                  }
                })
                .catch(onError);
            }
          }}
        >
          Save Current as Preset
        </button>
        <button
          onClick={() => {
            if (process) {
              executeLuaHandler(process.id, 'shareGridState', {
                grid,
                mouse,
                strength,
                relaxation
              }).catch(onError);
            }
          }}
        >
          Share Current State
        </button>
      </div>
    </div>
  );
};

export default GridDistortion; 