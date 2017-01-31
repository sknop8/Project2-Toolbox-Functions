
// Skybox texture from: https://github.com/mrdoob/three.js/tree/master/examples/textures/cube/skybox

const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Wing from './wing'

var feathers = [];

// called after the scene loads
function onLoad(framework) {
    var scene = framework.scene;
    var camera = framework.camera;
    var renderer = framework.renderer;
    var gui = framework.gui;
    var stats = framework.stats;

    // Basic Lambert white
    var lambertWhite = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });

    // Set light
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.color.setHSL(0.1, 1, 0.95);
    directionalLight.position.set(1, 3, 2);
    directionalLight.position.multiplyScalar(10);

    // set skybox
    var loader = new THREE.CubeTextureLoader();
    var urlPrefix = '/images/skymap/';

    var skymap = new THREE.CubeTextureLoader().load([
        urlPrefix + 'px.jpg', urlPrefix + 'nx.jpg',
        urlPrefix + 'py.jpg', urlPrefix + 'ny.jpg',
        urlPrefix + 'pz.jpg', urlPrefix + 'nz.jpg'
    ] );

    scene.background = skymap;

    // load a simple obj mesh
    var objLoader = new THREE.OBJLoader();
    objLoader.load('/geo/feather.obj', function(obj) {

        // LOOK: This function runs after the obj has finished loading
        var featherGeo = obj.children[0].geometry;

        // var featherMesh = new THREE.Mesh(featherGeo, lambertWhite);
        // featherMesh.name = "feather";
        // scene.add(featherMesh);

        for(var i = 1; i < 50; i++) {
            var material = lambertWhite.clone();
            var fMesh = new THREE.Mesh(featherGeo, material);
            var posZ = Wing.wingCurve(i / 50);
            var posX = Wing.featherSpread(i / 50);
            fMesh.position.setX(i / 10);//posX);
            fMesh.position.setZ((posZ - 0.5) * 10);
            feathers.push(fMesh);
            // console.log(pos - 0.5);
        
            var rot = Wing.featherRotation(i / 50);
            fMesh.rotation.y = Math.PI / 3;//(30 * rot) ;
            fMesh.rotation.y -= rot * 1.8;
            console.log("rot: " + rot);

            var scale = 2 - Wing.featherSize(i / 50);
            fMesh.scale.set(scale, scale, scale);

            var color = Wing.featherColor(i / 50);
            fMesh.material.color = new THREE.Color(color[0], color[1], color[2]);
        
            scene.add(fMesh);
        }
    });

    // set camera position
    camera.position.set(0, 1, 5);
    camera.lookAt(new THREE.Vector3(0,0,0));

    // scene.add(lambertCube);
    scene.add(directionalLight);

    // edit params and listen to changes like this
    // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
    gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
        camera.updateProjectionMatrix();
    });
}

// called on frame updates
function onUpdate(framework) {
    var feather = framework.scene.getObjectByName("feather"); 
    for (var i = 0; i < feathers.length; i++) {
        feather = feathers[i]    
           
        if (feather !== undefined) {
            // Simply flap wing
            var date = new Date();
            // feather.rotateZ(Math.sin(date.getTime() / 100) * 2 * Math.PI / 180);  


        }
    }
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);