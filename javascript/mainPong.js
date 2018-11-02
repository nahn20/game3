var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

/******* Add the create scene function ******/
var createScene = function () {
    var ticks = 0;
    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
    //var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(0, 0, -30), scene);
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI/2, Math.PI/2, 50, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    function cameraPan(){
        camera.alpha -= Math.PI/200;
        //camera.beta += Math.PI/300;
        camera.radius = 38 + (20-8)*Math.pow(Math.cos(camera.alpha), 2);
        //Originally (20+8)*sin^2 + (20+20)*cos^2 but realized am dumb. Change back if using variables intead of 38 and 12.
    }


    // Add lights to the scene
    //var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 0, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 0, 0), scene);
    var light3 = new BABYLON.PointLight("light3", new BABYLON.Vector3(0, 0, -30), scene);
    function light3CameraFollow(){
        light2.position = new BABYLON.Vector3(ball.babylon.position.x, ball.babylon.position.y, ball.babylon.position.z);
        light3.position = new BABYLON.Vector3(camera.position.x, camera.position.y, camera.position.z);
    }

    function paddle(name, startX, startY, startZ, followType){ //Creates a plane facing towards the inside
        if(followType == 0){
            this.babylon = BABYLON.MeshBuilder.CreateBox(name, {height: 2, width: 0.2, depth: 2}, scene);
        }
        if(followType == 1){
            this.babylon = BABYLON.MeshBuilder.CreateBox(name, {height: 0.2, width: 2, depth: 2}, scene);
        }
        if(followType == 2){
            this.babylon = BABYLON.MeshBuilder.CreateBox(name, {height: 2, width: 2, depth: 0.2}, scene);
        }
        this.babylon.position = new BABYLON.Vector3(startX, startY, startZ);
        this.followType = followType;
        this.loop = function(){
            this.exactBallFollow();
            this.ballCollisionCheck();
        }
        this.exactBallFollow = function(){
            if(this.followType == 0){
                this.babylon.position.y = ball.babylon.position.y;
                this.babylon.position.z = ball.babylon.position.z;
            }
            if(this.followType == 1){
                this.babylon.position.x = ball.babylon.position.x;
                this.babylon.position.z = ball.babylon.position.z;
            }
            if(this.followType == 2){
                this.babylon.position.x = ball.babylon.position.x;
                this.babylon.position.y = ball.babylon.position.y;
            }

            //this.babylon.position = new BABYLON.Vector3(this.babylon.position.x, ball.babylon.position.y, ball.babylon.position.z);
        }
        this.ballCollisionCheck = function(){
        }
    }

    var paddle1 = new paddle(paddle1, -20.2, 0, 0, 0);
    var paddle2 = new paddle(paddle2, 20.2, 0, 0, 0);
    var paddle3 = new paddle(paddle3, 0, 6.2, 0, 1);
    var paddle4 = new paddle(paddle4, 0, -6.2, 0, 1);
    var paddle5 = new paddle(paddle5, 0, 0, 8.2, 2);
    var paddle6 = new paddle(paddle6, 0, 0, -8.2, 2);

    var ball = {
        radius : 0.5,
        vx : Math.random(),
        vy : 1.43,
        vz : Math.random(),
        babylon : BABYLON.MeshBuilder.CreateSphere("ball", {diameter:2*this.radius}, scene),
        babylonClone : [],
        connectingLine : null,
        collisionCheck : function(){
            // this.vx = Math.cos(ticks*Math.PI/10)/2;
            // this.vy = Math.sin(ticks*Math.PI/10)/2;
            // this.vz = Math.cos(ticks*Math.PI/10)/2;

            if(this.babylon.position.y - this.radius <= -6 && this.vy < 0){ //Collision with ground
                this.vy *= -1;
            }
            if(this.babylon.position.y + this.radius >= 6 && this.vy > 0){ //Collision with imaginary ceiling
                this.vy *= -1;
            }
            if(this.babylon.position.z - this.radius <= -8 && this.vz < 0){ //Collision with imaginary close wall
                this.vz *= -1;
            }
            if(this.babylon.position.z + this.radius >= 8 && this.vz > 0){ //Collision with imaginary far wall
                this.vz *= -1;
            }

            if(this.babylon.position.x + this.radius >= 20){
                this.vx *= -1;
                if(Math.random() < 1){
                    this.vx = -Math.random();
                    //this.vy = Math.random();
                    this.vz = Math.random();
                }
            }
            if(this.babylon.position.x - this.radius <= -20){
                this.vx *= -1;
                if(Math.random() < 1){
                    this.vx = Math.random();
                    //this.vy = Math.random();
                    this.vz = Math.random();
                }
            }
        },
        connectingLineUpdate : function(){
            this.connectingLine = BABYLON.MeshBuilder.CreateLines("connectingLine", {points: this.babylonClone}, scene);
        },
        ballClone : function(){ //Clones ball position 
            this.babylonClone[this.babylonClone.length] = BABYLON.MeshBuilder.CreateSphere("ball", {diameter:2*this.radius}, scene);
            this.babylonClone[this.babylonClone.length-1].position = new BABYLON.Vector3(this.babylon.position.x, this.babylon.position.y, this.babylon.position.z);
        },
        pointClone : function(){
            this.babylonClone[this.babylonClone.length] = new BABYLON.Vector3(this.babylon.position.x, this.babylon.position.y, this.babylon.position.z);
        },
    }

    //var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 40, height: 16, subdivsions: 1, updatable: false}, scene);
    //ground.position = new BABYLON.Vector3(0, -6, 0);

    var gameLoop = setInterval(function(){
        ball.babylon.position = new BABYLON.Vector3(ball.babylon.position.x + ball.vx, ball.babylon.position.y + ball.vy, ball.babylon.position.z + ball.vz);
        ball.collisionCheck();
        light3CameraFollow();
        cameraPan();

        paddle1.loop();
        paddle2.loop();
        paddle3.loop();
        paddle4.loop();
        paddle5.loop();
        paddle6.loop();
        ticks++;
    }, 20);
    var ballCopyLoop = setInterval(function(){
        //ball.ballClone();
        //ball.pointClone();
        ball.connectingLineUpdate();
    }, 100);
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
