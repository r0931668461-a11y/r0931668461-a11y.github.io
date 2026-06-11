// Fallback for Scroll-Driven Animations using IntersectionObserver
if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
  console.log("CSS Scroll-Driven Animations not supported. Using IntersectionObserver fallback.");
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    // Initial state for fallback
    el.style.opacity = 0;
    el.style.transform = 'translateY(50px)';
    observer.observe(el);
  });
  
  // Parallax fallback using scroll event
  const heroImage = document.querySelector('.hero-image-wrapper');
  if (heroImage) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      // 只在英雄區塊可見時做計算
      if (scrollY < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    }, { passive: true });
  }

}

// WebGL Background Shader Implementation
// A simple fluid/gradient animated shader
function initWebGLBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const gl = canvas.getContext('webgl');
  
  if (!gl) {
    console.warn('WebGL not supported, falling back to static background.');
    return;
  }

  // Vertex Shader
  const vsSource = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  // Fragment Shader (Fluid Dark Noir effect)
  const fsSource = `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      
      // Center coordinates
      vec2 p = uv * 2.0 - 1.0;
      p.x *= u_resolution.x / u_resolution.y;

      // Slow moving fluid math
      float t = u_time * 0.1;
      
      // Create some organic distortion
      vec2 offset = vec2(
        sin(p.y * 2.0 + t) * 0.5,
        cos(p.x * 2.0 + t * 0.8) * 0.5
      );
      
      p += offset * 0.3;
      
      // Calculate a soft glow pattern
      float d = length(p);
      float glow = 0.05 / (d + 0.1);
      
      // Add subtle color shifting based on position and time
      vec3 col1 = vec3(0.08, 0.08, 0.08); // Base dark
      vec3 col2 = vec3(0.12, 0.14, 0.18); // Subtle blue/grey
      
      float mixFactor = sin(p.x * 3.0 + t) * cos(p.y * 3.0 - t) * 0.5 + 0.5;
      vec3 finalCol = mix(col1, col2, mixFactor);
      
      // Add the glow
      finalCol += vec3(glow * 0.1);
      
      gl_FragColor = vec4(finalCol, 1.0);
    }
  `;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    return;
  }

  gl.useProgram(program);

  // Set up full-screen quad
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = new Float32Array([
    -1.0, -1.0,
     1.0, -1.0,
    -1.0,  1.0,
    -1.0,  1.0,
     1.0, -1.0,
     1.0,  1.0,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  const timeLocation = gl.getUniformLocation(program, 'u_time');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
  }

  window.addEventListener('resize', resize);
  resize();

  // Render loop
  function render(time) {
    time *= 0.001; // convert to seconds
    gl.uniform1f(timeLocation, time);
    
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initWebGLBackground);
