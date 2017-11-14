"use strict";
/* globals THREE, $, TweenLite, Power3, TimelineMax  */

var camera = undefined,
    scene = undefined,
    renderer = undefined;
var plane = undefined;
var raycaster = new THREE.Raycaster();
var normalizedMouse = {
	x: 0,
	y: -180
};

// let lightBlue = {
// 	r: 34,
// 	g: 183,
// 	b: 236
// };

var darkBlue = {
	r: 0,
	g: 52,
	b: 74
};

var baseColorRGB = darkBlue;
var baseColor = "rgb(" + baseColorRGB.r + "," + baseColorRGB.g + "," + baseColorRGB.b + ")";
var nearStars = undefined,
    farStars = undefined,
    farthestStars = undefined;

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	renderer = new THREE.WebGLRenderer();

	// Scene initialization
	camera.position.z = 50;

	renderer.setClearColor("#121212", 1.0);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);

	document.body.appendChild(renderer.domElement);

	// Lights
	var topLight = new THREE.DirectionalLight(0xffffff, 1);
	topLight.position.set(0, 1, 1).normalize();
	scene.add(topLight);

	var bottomLight = new THREE.DirectionalLight(0xffffff, 0.4);
	bottomLight.position.set(1, -1, 1).normalize();
	scene.add(bottomLight);

	var skyLightRight = new THREE.DirectionalLight(0x666666, 0.2);
	skyLightRight.position.set(-1, -1, 0.2).normalize();
	scene.add(skyLightRight);

	var skyLightCenter = new THREE.DirectionalLight(0x666666, 0.2);
	skyLightCenter.position.set(-0, -1, 0.2).normalize();
	scene.add(skyLightCenter);

	var skyLightLeft = new THREE.DirectionalLight(0x666666, 0.2);
	skyLightLeft.position.set(1, -1, 0.2).normalize();
	scene.add(skyLightLeft);

	// Mesh creation
	var geometry = new THREE.PlaneGeometry(400, 400, 70, 70);
	var darkBlueMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading, side: THREE.DoubleSide, vertexColors: THREE.FaceColors });

	geometry.vertices.forEach(function (vertice) {
		vertice.x += (Math.random() - 0.5) * 4;
		vertice.y += (Math.random() - 0.5) * 4;
		vertice.z += (Math.random() - 0.5) * 4;
		vertice.dx = Math.random() - 0.5;
		vertice.dy = Math.random() - 0.5;
		vertice.randomDelay = Math.random() * 5;
	});

	for (var i = 0; i < geometry.faces.length; i++) {
		geometry.faces[i].color.setStyle(baseColor);
		geometry.faces[i].baseColor = baseColorRGB;
	}

	plane = new THREE.Mesh(geometry, darkBlueMaterial);
	scene.add(plane);

	// Create stars
	farthestStars = createStars(1200, 420, "#0952BD");
	farStars = createStars(1200, 370, "#A5BFF0");
	nearStars = createStars(1200, 290, "#118CD6");

	scene.add(farthestStars);
	scene.add(farStars);
	scene.add(nearStars);

	farStars.rotation.x = 0.25;
	nearStars.rotation.x = 0.25;

	// Uncomment for testing second camera position
	// camera.rotation.x = Math.PI / 2;
	// camera.position.y = -0;
	// camera.position.z = 20;
	// plane.scale.x = 2;
}

function createStars(amount, yDistance) {
	var color = arguments.length <= 2 || arguments[2] === undefined ? "0x000000" : arguments[2];

	var opacity = Math.random();
	var starGeometry = new THREE.Geometry();
	var starMaterial = new THREE.PointsMaterial({ color: color, opacity: opacity });

	for (var i = 0; i < amount; i++) {
		var vertex = new THREE.Vector3();
		vertex.z = (Math.random() - 0.5) * 1500;
		vertex.y = yDistance;
		vertex.x = (Math.random() - 0.5) * 1500;

		starGeometry.vertices.push(vertex);
	}

	return new THREE.Points(starGeometry, starMaterial);
}

var timer = 0;

function render() {
	requestAnimationFrame(render);

	timer += 0.01;
	var vertices = plane.geometry.vertices;

	for (var i = 0; i < vertices.length; i++) {
		// Ease back to original vertice position while still maintaining sine wave
		vertices[i].x -= Math.sin(timer + vertices[i].randomDelay) / 40 * vertices[i].dx;
		vertices[i].y += Math.sin(timer + vertices[i].randomDelay) / 40 * vertices[i].dy;
		// ((vertices[i].x - vertices[i].originalPosition.x) * 0.1) +
	}

	// Determine where ray is being projected from camera view
	raycaster.setFromCamera(normalizedMouse, camera);

	// Send objects being intersected into a variable
	var intersects = raycaster.intersectObjects([plane]);

	if (intersects.length > 0) {
		(function () {

			var faceBaseColor = intersects[0].face.baseColor;

			plane.geometry.faces.forEach(function (face) {
				face.color.r *= 255;
				face.color.g *= 255;
				face.color.b *= 255;

				face.color.r += (faceBaseColor.r - face.color.r) * 0.01;
				face.color.g += (faceBaseColor.g - face.color.g) * 0.01;
				face.color.b += (faceBaseColor.b - face.color.b) * 0.01;

				var rInt = Math.floor(face.color.r);
				var gInt = Math.floor(face.color.g);
				var bInt = Math.floor(face.color.b);

				var newBasecol = "rgb(" + rInt + "," + gInt + "," + bInt + ")";
				face.color.setStyle(newBasecol);
			});
			plane.geometry.colorsNeedUpdate = true;

			intersects[0].face.color.setStyle("#006ea0");
			plane.geometry.colorsNeedUpdate = true;
		})();
	}

	plane.geometry.verticesNeedUpdate = true;
	plane.geometry.elementsNeedUpdate = true;

	farthestStars.rotation.y -= 0.00001;
	farStars.rotation.y -= 0.00005;
	nearStars.rotation.y -= 0.00011;

	renderer.render(scene, camera);
}

init();

window.addEventListener("resize", function () {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener("mousemove", function (event) {

	// Normalize mouse coordinates
	normalizedMouse.x = event.clientX / window.innerWidth * 2 - 1;
	normalizedMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

var introContainer = $('.intro-container');
var skyContainer = $('.sky-container');
var xMark = $('.x-mark');

$('.shift-camera-button').click(function () {
	var introTimeline = new TimelineMax();

	introTimeline.add([TweenLite.fromTo(introContainer, 0.5, { opacity: 1 }, { opacity: 0, ease: Power3.easeIn }), TweenLite.to(camera.rotation, 3, { x: Math.PI / 2, ease: Power3.easeInOut }), TweenLite.to(camera.position, 2.5, { z: 20, ease: Power3.easeInOut }), TweenLite.to(camera.position, 3, { y: 120, ease: Power3.easeInOut }), TweenLite.to(plane.scale, 3, { x: 2, ease: Power3.easeInOut })]);

	introTimeline.add([TweenLite.to(xMark, 2, { opacity: 1, ease: Power3.easeInOut }), TweenLite.to(skyContainer, 2, { opacity: 1, ease: Power3.easeInOut })]);
});

$('.x-mark').click(function () {
	var outroTimeline = new TimelineMax();

	outroTimeline.add([TweenLite.to(xMark, 0.5, { opacity: 0, ease: Power3.easeInOut }), TweenLite.to(skyContainer, 0.5, { opacity: 0, ease: Power3.easeInOut }), TweenLite.to(camera.rotation, 3, { x: 0, ease: Power3.easeInOut }), TweenLite.to(camera.position, 3, { z: 50, ease: Power3.easeInOut }), TweenLite.to(camera.position, 2.5, { y: 0, ease: Power3.easeInOut }), TweenLite.to(plane.scale, 3, { x: 1, ease: Power3.easeInOut })]);

	outroTimeline.add([TweenLite.to(introContainer, 0.5, { opacity: 1, ease: Power3.easeIn })]);
});

render();