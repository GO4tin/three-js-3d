/* creating function to initialize environment */
function init() {

    var scene = new THREE.Scene();                                                                              //initialising scene
    var gui = new dat.GUI();                                                                                    //initialising dat.gui
    var clock = new THREE.Clock();

    /* setting up fog */
    var enableFog = false;                                                                                      //fog trigger
    if (enableFog) {
        scene.fog = new THREE.FogExp2(0xffffff, 0.2);                                                           //fog function
    }

    /* creating objects */
    var plane = getPlane(30);                                                                                   //calling getPlabe function
    var DirectionalLight = getDirectionalLight(1);                                                              //calling getPointLight function
    var sphere = getSphere(0.05);                                                                               //calling getSphere function
    var boxGrid = getBoxGrid(10, 1.5);
    boxGrid.name = 'boxGrid';

    plane.name = 'plane-1';                                                                                     //setting up plane name

    /* transforming objects */
    plane.rotation.x = Math.PI/2;                                                                               //rotating plane using "Math" module
    DirectionalLight.position.x = 13;                                                                           //setting up point light position
    DirectionalLight.position.y = 10;
    DirectionalLight.position.z = 10;    
    DirectionalLight.intensity = 2;                                                                             //setting up DirectionalLight intensity

    /* adding objects to the scene */
    scene.add(plane);                                                                                           //adding plane object to the scene
    scene.add(boxGrid);
    scene.add(DirectionalLight);                                                                                //adding point light object to the scene
    DirectionalLight.add(sphere);                                                                               //adding light bulb object to the scene
    
    /* creating interface */
    gui.add(DirectionalLight, 'intensity', 0, 10);
    gui.add(DirectionalLight.position, 'x', 0, 20);                                                             //creating user interface controller
    gui.add(DirectionalLight.position, 'y', 0, 20);
    gui.add(DirectionalLight.position, 'z', 0, 20);

    /* setting up camera */
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 1000);                //creating camera
    camera.position.x = 10;                                                                                      //setting up camera X position
    camera.position.y = 18;                                                                                      //setting up camera Y position
    camera.position.z = -18;                                                                                      //setting up camera Z position
    camera.lookAt (new THREE.Vector3(0, 0, 0));                                                                 //setting up camera target
    
    /* setting up renderer */
    var renderer = new THREE.WebGLRenderer();                                                                   //creating renderer
    renderer.shadowMap.enabled = true;                                                                          //enabling shadows
    renderer.setSize(window.innerWidth, window.innerHeight);                                                    //setting up render resolution
    renderer.setClearColor('rgb(120, 120, 120)');                                                               //setting background

    /*
    DOM (Document Object Model) – объектная модель, используемая для XML/HTML-документов.
    DOM – это представление документа в виде дерева объектов, доступное для изменения через JavaScript.
    */
    document.getElementById('webgl').appendChild(renderer.domElement);
    
    var controls = new THREE.OrbitControls(camera, renderer.domElement);                                        //assigning controls

    update(renderer, scene, camera, controls, clock);                                                                  //calling "update" function

    return scene;

}


/* creating box object */
function getBox(w, h, d) {

    var geometry = new THREE.BoxGeometry(w, h, d);                                                              //setting up box geometry
    var material = new THREE.MeshPhongMaterial({color: 'rgb(120, 120, 120)'});                                  //setting up the material
    var mesh = new THREE.Mesh(geometry, material);                                                              //creating a mesh object from the geometry and a material
    mesh.castShadow = true;                                                                                     //setting up the box to cast shadows

    return mesh;

}

/* creating a grid of boxes */
function getBoxGrid(amount, separationMultiplier) {
	var group = new THREE.Group();

	for (var i=0; i<amount; i++) {
		var obj = getBox(1, 1, 1);
		obj.position.x = i * separationMultiplier;
		obj.position.y = obj.geometry.parameters.height/2;
		group.add(obj);
		for (var j=1; j<amount; j++) {
			var obj = getBox(1, 1, 1);
			obj.position.x = i * separationMultiplier;
			obj.position.y = obj.geometry.parameters.height/2;
			obj.position.z = j * separationMultiplier;
			group.add(obj);
		}
	}

	group.position.x = -(separationMultiplier * (amount-1))/2;
	group.position.z = -(separationMultiplier * (amount-1))/2;

	return group;
}

/* creating sphere object */
function getSphere(size) {

    var geometry = new THREE.SphereGeometry(size, 24, 24);                                                      //setting up sphere geometry
    var material = new THREE.MeshBasicMaterial({color: 'rgb(255, 255, 255)'});                                  //setting up the material
    var mesh = new THREE.Mesh(geometry, material);                                                              //creating a mesh object from the geometry and a material

    return mesh;

}


/* creating plane object */
function getPlane(size) {

    var geometry = new THREE.PlaneGeometry(size, size);                                                         //setting up box geometry
    var material = new THREE.MeshPhongMaterial({color: 'rgb(120, 120, 120)', side: THREE.DoubleSide});          //setting up the material
    var mesh = new THREE.Mesh(geometry, material);                                                              //creating a mesh object from the geometry and a material
    mesh.receiveShadow = true;                                                                                  //setting up the plane to receive shadows

    return mesh;

}


/* creating point light object */
function getPointLight(intensity) {
    
    var light = new THREE.PointLight(0xffffff, intensity);                                                      //setting up point light using color and intensity
    light.castShadow = true;                                                                                    //setting up the light to cast shadows

    return light;

}

/* creating spot light object */
function getSpotLight(intensity) {
    
    var light = new THREE.SpotLight(0xffffff, intensity);                                                       //setting up spot light using color and intensity
    light.castShadow = true;                                                                                    //setting up the light to cast shadows

    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    return light;

}

/* creating directional light object */
function getDirectionalLight(intensity) {
    
    var light = new THREE.DirectionalLight(0xffffff, intensity);                                                //setting up directional light using color and intensity
    light.castShadow = true;                                                                                    //setting up the light to cast shadows

    light.shadow.camera.left = -10;                                                                             //setting up the left bound of directional light
    light.shadow.camera.right = 10;                                                                             //setting up the right bound of directional light
    light.shadow.camera.top = -10;                                                                              //setting up the top bound of directional light
    light.shadow.camera.bottom = 10;                                                                            //setting up the bottom bound of directional light

    return light;

}

/* creating ambient light object */
function getAmbientLight(intensity) {
    
    var light = new THREE.AmbientLight('rgb(10, 30, 50)', intensity);                                                      //setting up ambient light using color and intensity

    return light;

}

/* setting up frame updates */
function update(renderer, scene, camera, controls, clock) {
    
    renderer.render(scene, camera);                                                                             //calling render method using the "scene" and "camera" as arguments

    controls.update();

    var timeElapsed = clock.getElapsedTime();

    var boxGrid = scene.getObjectByName('boxGrid');
    boxGrid.children.forEach(function(child, index) {
        var noise = new Noise(Math.random());
        var x = timeElapsed * 3 + index;
        child.scale.y = (noise.simplex2(x, x) + 1) / 2 + 0.001;
        child.position.y = child.scale.y/2;
    });

    requestAnimationFrame(function() {update(renderer, scene, camera, controls, clock);})                              //creating recursive function to continiously update scene

}

var scene = init();