import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { saveRendererAndSceneState } from 'three/src/renderers/common/RendererUtils.js';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
//retrieve save state

if (sessionStorage.getItem("camX")){
    camera.position.set(parseFloat(sessionStorage.getItem("camX")), parseFloat(sessionStorage.getItem("camY")), parseFloat(sessionStorage.getItem("camZ")))
} else {
    camera.position.set(0, 0, 20)
}

const renderer = new THREE.WebGLRenderer()

const loader = new GLTFLoader()
const floor = new THREE.GridHelper(200, 50)
const roof = new THREE.GridHelper(200, 50)
roof.position.y = 20
scene.add(floor)
scene.add(roof)
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const controls = new OrbitControls(camera, renderer.domElement)

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

let hit = 0


class Ball {
    static g = 0.1
    static groundLevel = 0
    constructor(startX, startY, startZ) {
        this.x = startX
        this.y = startY
        this.z = startZ
        this.velocityX = 0
        this.velocityY = 10
        this.radius = 1
        this.roofLevel = roof.position.y
        this.geo = new THREE.SphereGeometry(this.radius, 100, 100)
        this.material = new THREE.MeshBasicMaterial({color: "yellow"})
        this.threeuse = new THREE.Mesh(this.geo, this.material)
        this.threeuse.position.set(this.x, this.y, this.z)
        scene.add(this.threeuse)
    }

    update() {
        this.velocityY += Ball.g
        this.y -= this.velocityY
        
        this.x += this.velocityX

        //y collision floor
        if (this.y - this.radius < Ball.groundLevel && this.velocityY > 0.15) {
            this.y = Ball.groundLevel + this.radius
            this.velocityY *= -0.8
        } else if (this.y - this.radius < Ball.groundLevel && this.velocityY < 0.15) {
            this.y = Ball.groundLevel + this.radius
            this.velocityY = 0
        }

        //y collision roof
        this.roofLevel = roof.position.y
        if (this.y + this.radius >  this.roofLevel) {
            this.y = this.roofLevel - this.radius
            this.velocityY *= -0.8
            console.log("roof hit time:" + hit, "current velocity: " + this.velocityY)
            hit += 1
        }
        

        this.threeuse.position.y = this.y
        this.threeuse.position.x = this.x


    }
}


let list = []

for (let i = 0; i < 1; i++) {
    list.push(new Ball(0, 10, 0))
}



function animate() {
    for (let i = 0; i < list.length; i++) {
        list[i].update()
    }



    sessionStorage.setItem("camX", camera.position.x)
    sessionStorage.setItem("camY", camera.position.y)
    sessionStorage.setItem("camZ", camera.position.z)
    controls.update()
    renderer.render(scene, camera)
}


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
});

renderer.setAnimationLoop(animate)
