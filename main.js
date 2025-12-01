import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import { grayscale } from 'three/tsl';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()

const loader = new GLTFLoader()

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)


renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


camera.position.z = 10

class Ball {
    static g = 0.01
    static groundLevel = -4
    constructor(startX, startY, startZ) {
        this.x = startX
        this.y = startY
        this.z = startZ
        this.velocityX = 0
        this.velocityY = 0
        this.radius = 1
        
        this.geo = new THREE.SphereGeometry(this.radius, 100, 100)
        this.material = new THREE.MeshBasicMaterial({color: "yellow"})
        this.threeuse = new THREE.Mesh(this.geo, this.material)
        this.threeuse.position.set(this.x, this.y, this.z)
        scene.add(this.threeuse)
    }

    update() {
        if (this.y < Ball.groundLevel && this.velocityY > 0.1) {
            console.log(this.velocityY)
            this.velocityY = - (0.8 * this.velocityY)
            this.y -= this.velocityY
            this.x += this.velocityX
            this.threeuse.position.y = this.y
            this.threeuse.position.x = this.x
            return
        } else if (this.y < Ball.groundLevel && this.velocityY < 0.1) {
            this.y = Ball.groundLevel
            this.velocityY = 0
            return
        }

        this.velocityY += Ball.g
        this.y -= this.velocityY
        this.x += this.velocityX
        this.threeuse.position.y = this.y
        this.threeuse.position.x = this.x
        return  
    }
}


let list = []

for (let i = 0; i < 10; i++) {
    list.push(new Ball(Math.random() * 20 - 10, Math.random() * 10, 0))
}

scene.background = new THREE.Color("teal")

function animate() {
    for (let i = 0; i < list.length; i++) {
        list[i].update()
        console.log(list[i].threeuse.position)
    }
    renderer.render(scene, camera)
}


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.setAnimationLoop(animate)