import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

/* as long ias lightningIsPulsing is false, lightningIsFlashing will ALWAYS be false.
 * when lightningIsPulsing is true, lightningIsFlashing will randomly switch between true and false
 */
let lightningIsPulsing = false;
let lightningIsFlashing = false;
const PULSE_PROBABILITY = 0.135;
const FLASH_PROBABILITY = 0.25;
const MIN_TIME_BETWEEN_PULSES = 0.5;
const MAX_TIME_BETWEEN_PULSES = 3.0;
const MIN_TIME_BETWEEN_FLASHES = 0.04;
const MAX_TIME_BETWEEN_FLASHES = 0.3;
const MIN_PULSE_DURATION = 1.0;
const MAX_PULSE_DURATION = 4.0;
const MIN_FLASH_DURATION = 0.04;
const MAX_FLASH_DURATION = 0.2;

let startFlashAt = 0.0;
let endFlashAt = 0.0;
let startPulseAt = 0.0;
let endPulseAt = 0.0;

const FLASH_COLOR = new THREE.Color(0xFFFFFF);
const BLACK_COLOR = new THREE.Color(0x003141);

// *** LIGHTNING FUNCTIONS ***

function handleLightning(timeInSeconds){
    if(lightningIsPulsing){
        if(timeInSeconds >= endPulseAt){
            lightningIsPulsing = false;
            lightningIsFlashing = false;
            ambientLight.intensity = 0;
            scene.background = BLACK_COLOR;
            startPulseAt = timeInSeconds + Math.random() * (MAX_TIME_BETWEEN_PULSES - MIN_TIME_BETWEEN_PULSES) + MIN_TIME_BETWEEN_PULSES;
        } else {
            if(lightningIsFlashing){
                if (timeInSeconds >= endFlashAt){
                    ambientLight.intensity = 0;
                    scene.background = BLACK_COLOR;
                    startFlashAt = timeInSeconds + Math.random() * (MAX_TIME_BETWEEN_FLASHES - MIN_TIME_BETWEEN_FLASHES) + MIN_TIME_BETWEEN_FLASHES;
                    lightningIsFlashing = false;
                    console.log("timeInSeconds")
                }
            } else {
                if(timeInSeconds >= startFlashAt){
                    console.log("Starting flash");
                    lightningIsFlashing = true;
                    let flash_power = (Math.random() + 0.1) * 0.8;
                    ambientLight.intensity = 25 * flash_power;
                    scene.background = new THREE.Color(flash_power, flash_power, flash_power);
                    endFlashAt = timeInSeconds + Math.random() * (MAX_FLASH_DURATION - MIN_FLASH_DURATION) + MIN_FLASH_DURATION;
                }
            }
        }
    } else {
        if(timeInSeconds >= startPulseAt){
            lightningIsPulsing = true;
            endPulseAt = timeInSeconds + Math.random() * (MAX_PULSE_DURATION - MIN_PULSE_DURATION) + MIN_PULSE_DURATION;
            startFlashAt = timeInSeconds + Math.random() * (MAX_TIME_BETWEEN_FLASHES - MIN_TIME_BETWEEN_FLASHES) + MIN_TIME_BETWEEN_FLASHES;
        }
    }
}





const NUMBER_TRIS_TO_GENERATE = 40;
const RANDOM_POINT_RANGE = 50;
const TIME_BETWEEN_GENERATED_TRIS = 0.02;
const TRIANGLE_SPEED = 0.04;
const MAX_ROTATION_SPEED = 2.0 * Math.PI * 0.7;
let triGenerationCounter = 0.0

const modelLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const coinTex = textureLoader.load('monero_texture_small.png');
const coinNormal = textureLoader.load('monero_coin_normal.png');
const coinBumpMap = textureLoader.load('monero_coin_bump.png')
coinTex.flipY = false;
coinBumpMap.flipY = false;
coinNormal.flipY = false;
const coinMaterial = new THREE.MeshPhongMaterial()
//coinMaterial.normalMap = coinNormal;
coinMaterial.bumpMap = coinBumpMap;
coinMaterial.map = coinTex;
coinMaterial.bumpScale = 0.3;
coinMaterial.shininess = 27;
coinMaterial.specular = new THREE.Color(0xBBFFBA);
let displayCoin;
let lastFrameTime = 0.0;

function generateRandomHexColor(){
    // An array of 3 strings each with a 2-digit hex color
    let colorHexString = "0x";
    for(let i = 0; i < 3; i++){
        const digit1 = Math.trunc(Math.random() * 16.0);
        const digit2 = Math.trunc(Math.random() * 16.0);
        colorHexString += digit1.toString(16) + digit2.toString(16);
    }
}

const fov = 75;
const initialAspectRatio = window.innerWidth / window.innerHeight;
const nearClipPlane = 0.1;
const farClipPlane = 1000;
const CAMERA_Z_POS = 10;
const CAMERA_Y_POS = -15;

const CAMERA_ORBIT_DISTANCE = 1;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(fov, initialAspectRatio, nearClipPlane, farClipPlane);

camera.position.z = CAMERA_Z_POS;
camera.position.y = CAMERA_Y_POS;
//scene.add(cube);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
//scene.add(particles);

const MAX_COINS = 15000;
const GRAVITY = 25;
const COIN_GENERATION_RATE = 5000.0; //Generate 20 coins per second
const HORIZONTAL_GENERATION_RANGE = 40;
const POSITION_RANGE = 100;

let lastCoinTime = 0.0
let oldestCoinIndex = 0;

let dummy = new THREE.Object3D();

/*
 * Each coin property is added to the array as an object with the following format:
 * {
 *      rotationAxis: Vector3,
 *      rotationRate: float,
 *      fallRate: float
 * }
 */
let coinProperties = [];
let coinMesh;

modelLoader.load('coin_primitive.glb', function(glb){
    const coinBasis = glb.scene.children[0];
    displayCoin = new THREE.Mesh(coinBasis.geometry.clone(), coinMaterial);
    scene.add(displayCoin);
    displayCoin.position.z = CAMERA_Z_POS +4;
    const OFFSET = 2;
    coinMesh = new THREE.InstancedMesh(coinBasis.geometry.clone(), coinMaterial, MAX_COINS);
    dummy.position.x = 0;
    dummy.position.y = 0;
    dummy.position.z = 0;
    dummy.updateMatrix();
    for(let i = 0; i < MAX_COINS; i++){
        coinMesh.setMatrixAt(i, dummy.matrix);
    }
    coinMesh.instanceMatrix.needsUpdate = true;
    scene.add(coinMesh);
})

let coinCount = 0;

function initializeCoin(coinIndex, time){
    // Reset the coin
    dummy.position.set(
        HORIZONTAL_GENERATION_RANGE * Math.random() - HORIZONTAL_GENERATION_RANGE / 2,
        HORIZONTAL_GENERATION_RANGE * Math.random() - HORIZONTAL_GENERATION_RANGE / 2,
        HORIZONTAL_GENERATION_RANGE * Math.random() - HORIZONTAL_GENERATION_RANGE / 2
    );
    let positionX = Math.random() * POSITION_RANGE - POSITION_RANGE/2.0;
    let positionZ = Math.random() * POSITION_RANGE - POSITION_RANGE/2.0;
    dummy.rotation.set(dummy.rotation.setFromVector3(new THREE.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360)));
    dummy.position.set(positionX, 0, positionZ);
    dummy.updateMatrix();
    coinMesh.setMatrixAt(coinIndex, dummy.matrix);
    // Create a random Vector3 rotation axis
    const rotationAxis = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    // Create a random rotation rate
    const rotationRate = Math.random() * MAX_ROTATION_SPEED;
    // Set fall rate to 0; it is updated every frame by gravity
    const fallRate = 0;
    // Set the coin property
    if(coinProperties.length < coinIndex + 1){
        // We are creating a brand new coin
        coinProperties = [...coinProperties, {
            rotationAxis: rotationAxis,
            rotationRate: rotationRate,
            positionX: positionX,
            positionZ: positionZ,
            aliveTime: 0
        }]
    } else {
        // Updating existing coin
        coinProperties[coinIndex] = {
            rotationAxis: rotationAxis,
            rotationRate: rotationRate,
            positionX: positionX,
            positionZ: positionZ,
            aliveTime: 0
        }
    }
}

function updateCoins(time, elapsedTime){

    if(displayCoin !== undefined){
        displayCoin.rotation.x = Math.PI/4.0;
    }

    if(coinMesh !== undefined){

        let shouldUpdateCurrentCoin = false;

        if(time - lastCoinTime > 1.0 / COIN_GENERATION_RATE){
            shouldUpdateCurrentCoin = true;
            lastCoinTime = time;
            //create a new coin and, if the maximum number of coins already exists, "renew" the last coin in the list
            if(coinCount === MAX_COINS){
                // to save resources just designate an old coin as the "new" coin and reset its position, rotation, 

                initializeCoin(oldestCoinIndex, time);

                if(oldestCoinIndex === MAX_COINS - 1){
                     oldestCoinIndex = 0;
                } else {
                    oldestCoinIndex++;
                }
            } else {
                // We have to manually create a new coin
                coinCount++;
                initializeCoin(coinCount - 1, time);
            }
        }

        for(let i = 0; i < coinCount - 1; i++){
            if(shouldUpdateCurrentCoin || i != oldestCoinIndex){
                let timeSquared = coinProperties[i].aliveTime * coinProperties[i].aliveTime;
                dummy.position.set(coinProperties[i].positionX,-0.5 * GRAVITY * timeSquared, coinProperties[i].positionZ);
                dummy.rotation.set(0,0,0);
                coinProperties[i].aliveTime += elapsedTime;
                try{
                    dummy.rotateOnWorldAxis(coinProperties[i].rotationAxis, coinProperties[i].rotationRate * time);
                } catch(e){
                    break;
                }
                dummy.updateMatrix();
                coinMesh.setMatrixAt(i, dummy.matrix);
            }
        }
        coinMesh.instanceMatrix.needsUpdate = true;
    }
}

const light = new THREE.PointLight(new THREE.Color(0xFFFFFF));
const ambientLight = new THREE.AmbientLight(new THREE.Color(0xAACCFF));
light.position.z = -10;
light.intensity = 0.4;
scene.add(light);
scene.add(ambientLight);
//scene.background = new THREE.Color(0x888888);


function animate(time){
    requestAnimationFrame(animate);
 
    const timeInSeconds = time * 0.001;
    handleLightning(timeInSeconds);
    const elapsedTimeInSeconds = timeInSeconds - lastFrameTime;

    updateCoins(timeInSeconds, elapsedTimeInSeconds);

    renderer.render(scene, camera);
    lastFrameTime = timeInSeconds;
}

document.body.appendChild(renderer.domElement);
animate(0.0);