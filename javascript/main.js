var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

/******* Add the create scene function ******/
var createScene = function () {
    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", (3/4)*Math.PI, (1/2 + 0.05)*Math.PI, 2, new BABYLON.Vector3(-10, 0, 10), scene);
    camera.attachControl(canvas, true);


    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    // Add and manipulate meshes in the scene
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);
    var box = BABYLON.MeshBuilder.CreateBox("box", {height: 5, width: 2, depth: 4}, scene);

    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 10, subdivsions: 1, updatable: false}, scene);
    ground.position = new BABYLON.Vector3(0, -2, 0);


    // var pointArray = [];
    // var sphereArray = [];
    // for(i = 0; i < 100; i++){
    //     sphereArray[i] = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:1}, scene);
    //     sphereArray[i].position = new BABYLON.Vector3(3*(Math.random()-0.5)*i, (Math.random()-0.5)*i, 3*(Math.random()-0.5)*i);
    //     pointArray[i] = new BABYLON.Vector3(sphereArray[i].position.x, sphereArray[i].position.y, sphereArray[i].position.z);
    // }
    // var sphereConnectingLines = BABYLON.MeshBuilder.CreateLines("sphereConnectingLines", {points: pointArray}, scene);

    var pointArray = [];
    for(i = 0; i < 100; i++){
        pointArray[i] = new BABYLON.Vector3(Math.cos((Math.PI/4)*i), i, Math.sin((Math.PI/4)*i));
    }
    var sphereConnectingLines = BABYLON.MeshBuilder.CreateLines("sphereConnectingLines", {points: pointArray}, scene);

    box.position = new BABYLON.Vector3(3, 1, 3);
    var updatePos = function(){
        box.position.x += .1;
    }
    var gameLoop = setInterval(function(){
        updatePos();
    }, 20);
    return scene;
};
/******* End of the create scene function ******/    

var scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () { 
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () { 
        engine.resize();
});
