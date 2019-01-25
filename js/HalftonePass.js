/**
 * @author rezmason
 */

THREE.HalftonePass = function (color1, color2, dotScale = 1, angle = 45, threshold = 0.5) {
  this.shader = {
    uniforms: {
      tDiffuse: { value: null },
      color1: { value: new THREE.Color(color1) },
      color2: { value: new THREE.Color(color2) },
      dotScale: { value: dotScale },
      angle: { value: angle },
      threshold: { value: threshold },
      width: { value: 1 },
      height: { value: 1 },
    },

    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4( position, 1.0 );
      }
    `,

    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform float angle;
      uniform float dotScale;
      uniform float threshold;
      varying vec2 vUv;

      uniform float width;
      uniform float height;

      // Original halftone dot matrix shader by Tomek Augustyn, 2010

      #define PI 3.1415926535897932384626433832795
      #define DEGREES_TO_RADIANS PI / 180.0

      float halftonePattern(vec2 pos, float angle, float freqMultiplier)
      {
        float sinAngle = sin(angle * DEGREES_TO_RADIANS);
        float cosAngle = cos(angle * DEGREES_TO_RADIANS);
        return
          0.5
          +
          0.25 * cos(
            (pos.x * sinAngle + pos.y * cosAngle + 0.5) * freqMultiplier
          )
          +
          0.25 * cos(
            (pos.x * cosAngle - pos.y * sinAngle + 0.5) * freqMultiplier
          );
      }

      void main()
      {
        vec4 source = texture2D(tDiffuse, vUv);
        float grayscale = 0.2125 * source.r + 0.7154 * source.g + 0.0721 * source.b;

        vec2 dstCoord = vUv * vec2(width, height) / min(width, height);
        float rasterPattern = halftonePattern(
          dstCoord - 0.5,
          angle,
          PI * 16.0 / dotScale
        );

        float value = (rasterPattern * threshold + grayscale - threshold) / (1.0 - threshold);

        gl_FragColor = vec4(mix(color1, color2, value), source.a);
      }
    `
  };

  THREE.ShaderPass.call(this, this.shader);
};

THREE.HalftonePass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {
  constructor: THREE.HalftonePass,
  render: function() {
    THREE.ShaderPass.prototype.render.call(this, ...arguments);
  }
});

THREE.HalftonePass.prototype.setSize = function ( width, height ) {
  this.uniforms.width.value = width;
  this.uniforms.height.value = height;
};
