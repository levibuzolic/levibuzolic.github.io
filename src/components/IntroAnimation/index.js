import React from 'react'
import * as THREE from 'three'
import Stats from 'three/examples/js/libs/stats.min'
global.THREE = THREE;
require('three/examples/js/renderers/CanvasRenderer')
require('three/examples/js/renderers/Projector')

export default class IntroAnimation extends React.PureComponent {
  componentDidMount() {
    if (this._el)
      return;

    init(this._el);
    animate();
  }

  render() {
    return <div ref={el => this._el = el} />;
  }
}

var SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;
var container, stats;
var camera, scene, renderer;
var particles, particle, count = 0;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

function init(el) {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;
  scene = new THREE.Scene();
  particles = new Array();
  var PI2 = Math.PI * 2;
  var material = new THREE.SpriteCanvasMaterial({
    color: 0xffffff,
    program(context) {
      context.beginPath();
      context.arc(0, 0, 0.5, 0, PI2, true);
      context.fill();
    }
  });
  var i = 0;
  for (var ix = 0; ix < AMOUNTX; ix ++) {
    for (var iy = 0; iy < AMOUNTY; iy ++) {
      particle = particles[ i ++ ] = new THREE.Sprite(material);
      particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
      particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
      scene.add(particle);
    }
  }
  renderer = new THREE.CanvasRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  debugger;
  el.appendChild(renderer.domElement);
  stats = new Stats();
  el.appendChild(stats.dom);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('touchstart', onDocumentTouchStart, false);
  document.addEventListener('touchmove', onDocumentTouchMove, false);
  //
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
//

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart(event) {
  if (event.touches.length === 1) {
    event.preventDefault();
    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    mouseY = event.touches[ 0 ].pageY - windowHalfY;
  }
}

function onDocumentTouchMove(event) {
  if (event.touches.length === 1) {
    event.preventDefault();
    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    mouseY = event.touches[ 0 ].pageY - windowHalfY;
  }
}

function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}

function render() {
  camera.position.x += (mouseX - camera.position.x) * .05;
  camera.position.y += (- mouseY - camera.position.y) * .05;
  camera.lookAt(scene.position);
  var i = 0;
  for (var ix = 0; ix < AMOUNTX; ix ++) {
    for (var iy = 0; iy < AMOUNTY; iy ++) {
      particle = particles[ i++ ];
      particle.position.y = (Math.sin((ix + count) * 0.3) * 50) +
        (Math.sin((iy + count) * 0.5) * 50);
      particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 4 +
        (Math.sin((iy + count) * 0.5) + 1) * 4;
    }
  }
  renderer.render(scene, camera);
  count += 0.1;
}
