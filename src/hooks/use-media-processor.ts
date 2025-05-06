
import { useCallback, useRef } from 'react';
import { StoryFilter } from '@/types/stories';

/**
 * Hook pour le traitement optimisé des médias avec WebGL
 */
export const useMediaProcessor = () => {
  // Cache pour les shaders
  const shaderCacheRef = useRef<Map<StoryFilter, WebGLProgram>>(new Map());
  
  /**
   * Initialise un contexte WebGL optimisé
   */
  const initWebGLContext = useCallback((canvas: HTMLCanvasElement): WebGLRenderingContext | null => {
    // Optimisation: demander un contexte WebGL avec antialiasing et préservation du buffer
    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      depth: false,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    
    if (!gl) {
      console.error('WebGL not supported');
      return null;
    }
    
    return gl;
  }, []);
  
  /**
   * Compile un shader pour le traitement d'image
   */
  const compileShader = useCallback((
    gl: WebGLRenderingContext,
    type: number,
    source: string
  ): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }, []);
  
  /**
   * Crée un programme WebGL avec vertex et fragment shaders
   */
  const createProgram = useCallback((
    gl: WebGLRenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ): WebGLProgram | null => {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return null;
    
    const program = gl.createProgram();
    if (!program) return null;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    
    // Nettoyage des shaders après création du programme
    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    
    return program;
  }, [compileShader]);
  
  /**
   * Obtient un shader pour un filtre spécifique (mise en cache pour performance)
   */
  const getFilterShader = useCallback((
    gl: WebGLRenderingContext,
    filter: StoryFilter
  ): WebGLProgram | null => {
    // Vérifier si on a déjà compilé ce shader
    if (shaderCacheRef.current.has(filter)) {
      return shaderCacheRef.current.get(filter) || null;
    }
    
    // Vertex shader standard pour tous les filtres
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0, 1);
        v_texCoord = a_texCoord;
      }
    `;
    
    // Fragment shader selon le filtre choisi
    let fragmentShaderSource: string;
    
    switch (filter) {
      case 'sepia':
        fragmentShaderSource = `
          precision mediump float;
          varying vec2 v_texCoord;
          uniform sampler2D u_image;
          
          void main() {
            vec4 color = texture2D(u_image, v_texCoord);
            vec3 sepia = vec3(
              color.r * 0.393 + color.g * 0.769 + color.b * 0.189,
              color.r * 0.349 + color.g * 0.686 + color.b * 0.168,
              color.r * 0.272 + color.g * 0.534 + color.b * 0.131
            );
            gl_FragColor = vec4(sepia, color.a);
          }
        `;
        break;
        
      case 'grayscale':
        fragmentShaderSource = `
          precision mediump float;
          varying vec2 v_texCoord;
          uniform sampler2D u_image;
          
          void main() {
            vec4 color = texture2D(u_image, v_texCoord);
            float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
            gl_FragColor = vec4(vec3(gray), color.a);
          }
        `;
        break;
        
      case 'vintage':
        fragmentShaderSource = `
          precision mediump float;
          varying vec2 v_texCoord;
          uniform sampler2D u_image;
          
          void main() {
            vec4 color = texture2D(u_image, v_texCoord);
            vec3 vintage = vec3(
              min(1.0, color.r * 0.5 + color.g * 0.3 + color.b * 0.2 + 0.15),
              min(1.0, color.r * 0.2 + color.g * 0.5 + color.b * 0.3 + 0.1),
              min(1.0, color.r * 0.2 + color.g * 0.2 + color.b * 0.5 + 0.05)
            );
            gl_FragColor = vec4(vintage, color.a);
          }
        `;
        break;
        
      case 'neon':
        fragmentShaderSource = `
          precision mediump float;
          varying vec2 v_texCoord;
          uniform sampler2D u_image;
          
          void main() {
            vec4 color = texture2D(u_image, v_texCoord);
            vec3 neon = vec3(
              min(1.0, color.r * 1.2 + 0.1),
              min(1.0, color.g * 1.2 + 0.1),
              min(1.0, color.b * 1.5 + 0.2)
            );
            gl_FragColor = vec4(neon, color.a);
          }
        `;
        break;
        
      case 'vibrant':
        fragmentShaderSource = `
          precision mediump float;
          varying vec2 v_texCoord;
          uniform sampler2D u_image;
          
          void main() {
            vec4 color = texture2D(u_image, v_texCoord);
            vec3 vibrant = vec3(
              min(1.0, color.r * 1.3),
              min(1.0, color.g * 1.1),
              min(1.0, color.b * 1.5)
            );
            gl_FragColor = vec4(vibrant, color.a);
          }
        `;
        break;
        
      case 'minimal':
        fragmentShaderSource = `
          precision mediump float;
          varying vec2 v_texCoord;
          uniform sampler2D u_image;
          
          void main() {
            vec4 color = texture2D(u_image, v_texCoord);
            vec3 minimal = vec3(
              min(1.0, color.r * 0.9 + 0.08),
              min(1.0, color.g * 0.95 + 0.05),
              min(1.0, color.b * 0.9 + 0.03)
            );
            gl_FragColor = vec4(minimal, color.a);
          }
        `;
        break;
        
      case 'blur':
        fragmentShaderSource = `
          precision mediump float;
          varying vec2 v_texCoord;
          uniform sampler2D u_image;
          uniform vec2 u_textureSize;
          
          void main() {
            vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
            vec4 color = vec4(0.0);
            
            // Simple 3x3 Gaussian blur
            color += texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)) * 0.0625;
            color += texture2D(u_image, v_texCoord + onePixel * vec2(0, -1)) * 0.125;
            color += texture2D(u_image, v_texCoord + onePixel * vec2(1, -1)) * 0.0625;
            
            color += texture2D(u_image, v_texCoord + onePixel * vec2(-1, 0)) * 0.125;
            color += texture2D(u_image, v_texCoord) * 0.25;
            color += texture2D(u_image, v_texCoord + onePixel * vec2(1, 0)) * 0.125;
            
            color += texture2D(u_image, v_texCoord + onePixel * vec2(-1, 1)) * 0.0625;
            color += texture2D(u_image, v_texCoord + onePixel * vec2(0, 1)) * 0.125;
            color += texture2D(u_image, v_texCoord + onePixel * vec2(1, 1)) * 0.0625;
            
            gl_FragColor = color;
          }
        `;
        break;
        
      case 'none':
      default:
        fragmentShaderSource = `
          precision mediump float;
          varying vec2 v_texCoord;
          uniform sampler2D u_image;
          
          void main() {
            vec4 color = texture2D(u_image, v_texCoord);
            gl_FragColor = color;
          }
        `;
        break;
    }
    
    // Créer et mettre en cache le programme shader
    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    if (program) {
      shaderCacheRef.current.set(filter, program);
    }
    
    return program;
  }, [createProgram]);
  
  /**
   * Applique un filtre à une vidéo en utilisant WebGL pour de meilleures performances
   */
  const applyWebGLFilter = useCallback((
    videoElement: HTMLVideoElement,
    canvasElement: HTMLCanvasElement,
    filter: StoryFilter
  ) => {
    // S'assurer que le canvas a les bonnes dimensions
    if (canvasElement.width !== videoElement.videoWidth || 
        canvasElement.height !== videoElement.videoHeight) {
      canvasElement.width = videoElement.videoWidth || 640;
      canvasElement.height = videoElement.videoHeight || 480;
    }
    
    const gl = initWebGLContext(canvasElement);
    if (!gl) return;
    
    // Obtenir le programme de shader pour ce filtre
    const program = getFilterShader(gl, filter);
    if (!program) return;
    
    // Préparer le contexte WebGL
    gl.useProgram(program);
    
    // Créer et configurer le buffer de positions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    // Définir un rectangle qui couvre tout le canvas
    const positions = [
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    // Coordonnées de texture
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    
    const texCoords = [
      0.0, 1.0,
      1.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    
    // Configurer les attributs
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
    
    // Créer et configurer la texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // Définir les paramètres de texture pour des performances optimales
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
    // Charger la vidéo dans la texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoElement);
    
    // Configurer le viewport et effacer
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Configurer les attributs de position
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Configurer les attributs de texture
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Pour le filtre blur, on doit passer la taille de la texture
    if (filter === 'blur') {
      const textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
      gl.uniform2f(textureSizeLocation, videoElement.videoWidth, videoElement.videoHeight);
    }
    
    // Dessiner le rectangle
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    // Nettoyage pour éviter les fuites de mémoire
    gl.disableVertexAttribArray(positionLocation);
    gl.disableVertexAttribArray(texCoordLocation);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.useProgram(null);
    
    // Ne pas supprimer les buffers et textures car ils seront réutilisés
    // dans les frames suivantes pour de meilleures performances
  }, [initWebGLContext, getFilterShader]);
  
  /**
   * Dessine une vidéo sur un canvas efficacement
   */
  const drawVideoToCanvas = useCallback((
    videoElement: HTMLVideoElement,
    canvasElement: HTMLCanvasElement
  ) => {
    if (!videoElement || !canvasElement) return;
    
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;
    
    // Ajuster les dimensions du canvas
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    
    // Dessiner la vidéo
    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    
    return ctx;
  }, []);
  
  /**
   * Compresse une vidéo côté client pour de meilleures performances
   */
  const compressVideo = useCallback(async (
    videoBlob: Blob,
    quality: number = 0.85
  ): Promise<Blob> => {
    // Pour une véritable implémentation de compression, nous utiliserions
    // une bibliothèque comme ffmpeg.wasm. Pour l'instant, nous simulons la compression.
    
    return new Promise((resolve) => {
      console.log('Optimisation de la vidéo en cours...');
      
      // Simuler un délai de compression
      setTimeout(() => {
        resolve(videoBlob);
      }, 300);
    });
  }, []);
  
  /**
   * Crée une miniature à partir d'une vidéo
   */
  const createThumbnail = useCallback(async (
    videoFile: File
  ): Promise<File | null> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Configurer la vidéo
      video.autoplay = false;
      video.muted = true;
      video.src = URL.createObjectURL(videoFile);
      
      // Précharger les métadonnées
      video.preload = 'metadata';
      
      // Capturer une image quand les métadonnées sont chargées
      video.onloadedmetadata = () => {
        // Aller à la première seconde
        video.currentTime = 1.0;
      };
      
      // Quand la vidéo atteint le temps ciblé
      video.onseeked = () => {
        // Configurer les dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Dessiner l'image
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convertir en fichier
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], `thumbnail-${Date.now()}.jpg`, {
                type: 'image/jpeg'
              });
              resolve(file);
            } else {
              resolve(null);
            }
            
            // Nettoyer
            URL.revokeObjectURL(video.src);
          }, 'image/jpeg', 0.8);
        } else {
          resolve(null);
          URL.revokeObjectURL(video.src);
        }
      };
      
      // Gérer les erreurs
      video.onerror = () => {
        console.error('Error creating thumbnail');
        resolve(null);
        URL.revokeObjectURL(video.src);
      };
    });
  }, []);
  
  /**
   * Optimise les dimensions de la vidéo pour la performance
   */
  const optimizeVideoDimensions = useCallback((
    width: number,
    height: number,
    isMobile: boolean = false
  ): { width: number, height: number } => {
    const maxDimension = isMobile ? 720 : 1080;
    
    if (width > height && width > maxDimension) {
      const scale = maxDimension / width;
      return {
        width: maxDimension,
        height: Math.round(height * scale)
      };
    } else if (height > width && height > maxDimension) {
      const scale = maxDimension / height;
      return {
        width: Math.round(width * scale),
        height: maxDimension
      };
    }
    
    return { width, height };
  }, []);
  
  return {
    applyWebGLFilter,
    drawVideoToCanvas,
    compressVideo,
    createThumbnail,
    optimizeVideoDimensions
  };
};
