import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()

const loader = new GLTFLoader()
const gridhelper = new THREE.GridHelper(200, 50)
scene.add(gridhelper)
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const controls = new OrbitControls(camera, renderer.domElement)

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


camera.position.z = 10

class Ball {
    static g = 0.1
    static groundLevel = 0
    static rightwall = -15
    constructor(startX, startY, startZ) {
        this.x = startX
        this.y = startY
        this.z = startZ
        this.velocityX = 0
        this.velocityY = -10
        this.radius = 1
        
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

        //y collision
        if (this.y - this.radius < Ball.groundLevel && this.velocityY > 0.15) {
            this.y = Ball.groundLevel + this.radius
            this.velocityY *= -0.8
        } else if (this.y - this.radius < Ball.groundLevel && this.velocityY < 0.15) {
            this.y = Ball.groundLevel + this.radius
            this.velocityY = 0
        }

        
        

        this.threeuse.position.y = this.y
        this.threeuse.position.x = this.x


    }
}


let list = []

for (let i = 0; i < 1; i++) {
    list.push(new Ball(0, 0, 0))
}



function animate() {
    for (let i = 0; i < list.length; i++) {
        list[i].update()
    }

    controls.update()
    renderer.render(scene, camera)
}


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
});

renderer.setAnimationLoop(animate)
