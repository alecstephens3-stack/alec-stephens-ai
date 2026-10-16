/* Burin · the engraved style of the Lens system (adopted 2026-10-17).
 *
 * Draws a public-domain picture as banknote engraving: horizontal lines about 4 px apart
 * with a slow wave, swelling in shadow and thinning in light, bending a little with the form.
 * Day = ink on paper. Night = cream on the night radial. A soft lens follows a fine pointer.
 *
 *   <canvas class="sai-burin" data-src="plate.jpg" data-mode="night"
 *           data-focus="0.5,0.4" data-zoom="0.9" data-lens></canvas>
 *
 * Options (all optional): data-src (same-origin image) or data-plate (key into window.PLATES,
 * each {w, h, src}), data-mode day|night, data-focus "x,y" in the picture (0 to 1),
 * data-zoom (1 = cover, lower = closer), data-pitch line spacing px (4.2), data-amp wave px (3),
 * data-wl wavelength px (260), data-relief bend with the form (0.6), data-gamma tone curve
 * (below 1 lightens, above 1 darkens), data-minw / data-maxw line width range, data-lens.
 * The canvas fills its box; give the box a size. Phones and reduced motion get a still plate.
 * Canvases mount by themselves; call SAIBurin.mount(el) for ones added later.
 */
(function () {
  "use strict";
  if (window.SAIBurin) return;
  var FINE = window.matchMedia && matchMedia("(pointer: fine)").matches;
  var STILL = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var INK = { day: [23 / 255, 19 / 255, 16 / 255], night: [245 / 255, 241 / 255, 232 / 255] };
  var DEF = { pitch: 4.2, amp: 3.0, wl: 260, relief: 0.6, minw: 0.07, maxw: 0.88, gamma: 1.0, zoom: 1 };

  var VS = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";
  var FS = [
    "precision highp float;",
    "uniform sampler2D u_img; uniform vec2 u_res; uniform vec4 u_view;",
    "uniform float u_pitch, u_amp, u_wl, u_relief, u_minw, u_maxw, u_gamma, u_night;",
    "uniform vec3 u_ink; uniform vec3 u_ptr; uniform float u_ptrR;",
    "float tone(vec2 px){",
    "  vec2 uv = vec2(u_view.x + (px.x / u_res.x - 0.5) * u_view.z, u_view.y + (px.y / u_res.y - 0.5) * u_view.w);",
    "  float l = dot(texture2D(u_img, uv).rgb, vec3(0.299, 0.587, 0.114));",
    "  return pow(clamp(l, 0.0, 1.0), u_gamma);",
    "}",
    "void main(){",
    "  vec2 px = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);",
    "  vec2 d0 = px - u_ptr.xy;",
    "  float fall = u_ptr.z * exp(-dot(d0, d0) / (u_ptrR * u_ptrR));",
    "  vec2 q = u_ptr.xy + d0 * (1.0 - 0.38 * fall);",          /* the lens: magnify around the pointer */
    "  float t = tone(q);",
    "  float s = u_pitch * 2.2;",
    "  float tb = (tone(q + vec2(s, 0.0)) + tone(q - vec2(s, 0.0)) + tone(q + vec2(0.0, s)) + tone(q - vec2(0.0, s)) + 2.0 * t) / 6.0;",
    "  float k = 6.2831853 / u_wl;",
    "  float y = q.y + u_amp * sin(q.x * k + q.y * 0.0021) + u_amp * 0.45 * sin(q.x * k * 0.37 - q.y * 0.0013 + 1.7)",
    "          + u_relief * u_pitch * (tb - 0.5);",                /* bend with a softened tone */
    "  float w = u_night > 0.5 ? t : 1.0 - t;",
    "  float hw = 0.5 * u_pitch * mix(u_minw, u_maxw, w);",
    "  float d = abs(fract(y / u_pitch) - 0.5) * u_pitch;",
    "  float a = clamp(hw - d + 0.5, 0.0, 1.0);",
    "  gl_FragColor = vec4(u_ink * a, a);",
    "}"
  ].join("\n");

  function num(v, d) { var n = parseFloat(v); return isNaN(n) ? d : n; }

  function Burin(cv) {
    this.cv = cv;
    this.ptr = { x: 0, y: 0, s: 0, target: 0 };
    this.read();
    if (!this.init()) return;
    var self = this;
    cv.addEventListener("webglcontextlost", function (e) { e.preventDefault(); self.ready = false; });
    cv.addEventListener("webglcontextrestored", function () { if (self.init()) self.load(); });
    this.load();
    if (FINE && !STILL && cv.hasAttribute("data-lens")) this.bindLens();
    if (window.ResizeObserver) new ResizeObserver(function () { self.draw(); }).observe(cv);
    else window.addEventListener("resize", function () { self.draw(); });
  }

  Burin.prototype.init = function () {
    var gl = this.cv.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) { this.cv.classList.add("sai-burin-off"); return false; }
    this.gl = gl;
    var prog = gl.createProgram();
    [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, FS]].forEach(function (s) {
      var sh = gl.createShader(s[0]); gl.shaderSource(sh, s[1]); gl.compileShader(sh);
      gl.attachShader(prog, sh);
    });
    gl.linkProgram(prog); gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var u = this.u = {};
    ["u_img", "u_res", "u_view", "u_pitch", "u_amp", "u_wl", "u_relief", "u_minw", "u_maxw", "u_gamma", "u_night", "u_ink", "u_ptr", "u_ptrR"]
      .forEach(function (n) { u[n] = gl.getUniformLocation(prog, n); });
    this.tex = gl.createTexture();
    return true;
  };

  Burin.prototype.read = function () {
    var d = this.cv.dataset, f = (d.focus || "0.5,0.5").split(",");
    this.o = {
      mode: d.mode || "day", fx: num(f[0], .5), fy: num(f[1], .5),
      pitch: num(d.pitch, DEF.pitch), amp: num(d.amp, DEF.amp), wl: num(d.wl, DEF.wl), relief: num(d.relief, DEF.relief),
      minw: num(d.minw, DEF.minw), maxw: num(d.maxw, DEF.maxw), gamma: num(d.gamma, DEF.gamma), zoom: num(d.zoom, DEF.zoom)
    };
  };

  // Load the plate named on the canvas (data-src, or data-plate from window.PLATES).
  Burin.prototype.load = function () {
    var self = this, d = this.cv.dataset, p = d.plate && window.PLATES ? window.PLATES[d.plate] : null;
    var src = p ? p.src : d.src;
    if (!src || !this.gl) return;
    this.ready = false;
    var img = new Image();
    img.onload = function () {
      var gl = self.gl;
      self.iw = img.naturalWidth; self.ih = img.naturalHeight;
      gl.bindTexture(gl.TEXTURE_2D, self.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      self.ready = true; self.draw();
      self.cv.classList.add("is-drawn");
    };
    img.src = src;
  };

  Burin.prototype.draw = function () {
    if (!this.ready) return;
    var cv = this.cv, gl = this.gl, o = this.o, dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = Math.max(1, Math.round(cv.clientWidth * dpr)), h = Math.max(1, Math.round(cv.clientHeight * dpr));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    gl.viewport(0, 0, w, h);
    var A = w / h, I = this.iw / this.ih;
    var wx = Math.min(1, A / I) * o.zoom, wy = Math.min(1, I / A) * o.zoom;
    var cx = Math.min(1 - wx / 2, Math.max(wx / 2, o.fx)), cy = Math.min(1 - wy / 2, Math.max(wy / 2, o.fy));
    var u = this.u, ink = INK[o.mode] || INK.day;
    gl.uniform1i(u.u_img, 0);
    gl.uniform2f(u.u_res, w, h);
    gl.uniform4f(u.u_view, cx, cy, wx, wy);
    gl.uniform1f(u.u_pitch, o.pitch * dpr); gl.uniform1f(u.u_amp, o.amp * dpr); gl.uniform1f(u.u_wl, o.wl * dpr);
    gl.uniform1f(u.u_relief, o.relief); gl.uniform1f(u.u_minw, o.minw); gl.uniform1f(u.u_maxw, o.maxw);
    gl.uniform1f(u.u_gamma, o.gamma); gl.uniform1f(u.u_night, o.mode === "night" ? 1 : 0);
    gl.uniform3f(u.u_ink, ink[0], ink[1], ink[2]);
    gl.uniform3f(u.u_ptr, this.ptr.x * dpr, this.ptr.y * dpr, this.ptr.s); gl.uniform1f(u.u_ptrR, 110 * dpr);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  // The lens eases in and out so it never pops. It listens on the nearest [data-burin-host]
  // (or the canvas) so it keeps tracking when text sits on top of the plate.
  Burin.prototype.bindLens = function () {
    var self = this, cv = this.cv, host = cv.closest("[data-burin-host]") || cv, raf = 0;
    function tick() {
      raf = 0;
      self.ptr.s += (self.ptr.target - self.ptr.s) * 0.18;
      self.draw();
      if (Math.abs(self.ptr.target - self.ptr.s) > 0.01) raf = requestAnimationFrame(tick);
    }
    host.addEventListener("pointermove", function (e) {
      var b = cv.getBoundingClientRect();
      self.ptr.x = e.clientX - b.left; self.ptr.y = e.clientY - b.top;
      var inside = self.ptr.x >= 0 && self.ptr.y >= 0 && self.ptr.x <= b.width && self.ptr.y <= b.height;
      self.ptr.target = inside ? 1 : 0;
      if (!raf) raf = requestAnimationFrame(tick);
    });
    host.addEventListener("pointerleave", function () { self.ptr.target = 0; if (!raf) raf = requestAnimationFrame(tick); });
  };

  function mount(cv) { if (!cv._burin) cv._burin = new Burin(cv); return cv._burin; }
  function mountAll() { [].forEach.call(document.querySelectorAll("canvas.sai-burin"), mount); }
  window.SAIBurin = { mount: mount, mountAll: mountAll, defaults: DEF };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountAll);
  else mountAll();
})();
