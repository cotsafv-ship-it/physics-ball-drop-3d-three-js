import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls} from 'three/examples/jsm/Addons.js';

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
const floor = new THREE.GridHelper(2000, 500) // its a ratio where
const axis = new THREE.AxesHelper(100)


scene.add(floor)
scene.add(axis)

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const controls = new OrbitControls(camera, renderer.domElement)

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)



class Planet {
    static g = 6.6743e-11
    constructor(x, y, z, mass, radius, color) {
        this.x = x
        this.y = y
        this.z = z
        this.startX = x
        this.startZ = z
        this.mass = mass
        this.radius = radius
        this.color = color
        this.angle = 0
        this.geo = new THREE.SphereGeometry(this.radius)
        this.material = new THREE.MeshBasicMaterial({color: this.color})
        this.threeuse = new THREE.Mesh(this.geo, this.material)
        this.threeuse.position.set(this.x, this.y, this.z)
        scene.add(this.threeuse)
    } 
    update() {
        this.threeuse.position.set(this.x, this.y, this.z)
    }
}

class Moon {
    constructor(x, y, z, mass, radius, orbitRadius, color) {
        this.x = x
        this.y = y
        this.z = z
        this.radius = radius
        this.mass = mass
        this.orbitRadius = orbitRadius
        this.color = color
        this.angle = 0

        this.geo = new THREE.SphereGeometry(this.radius)
        this.material = new THREE.MeshBasicMaterial({color: this.color})
        this.threeuse = new THREE.Mesh(this.geo, this.material)
        this.threeuse.position.set(this.x, this.y, this.z)
        scene.add(this.threeuse)
    }

    update() {
        this.threeuse.position.set(this.x, this.y, this.z)
    }
}
const sun = new Planet(0, 0, 0, (1.9985 * 10**30), 10, "yellow")
const earth = new Planet(90, 0, 0, (5.5134 * 10**24), 3.5, "green")
const mercury = new Planet(15, 0, 0, 10, 0.9, "white")
const venus = new Planet(50, 0, 0, 10, 3.1, "orange")
const earthMoon = new Moon(90, 0, 10, 2, 1.4, 7, "white")

function rotateMoon(center, object) {
    const theta = object.angle / 180 * Math.PI
    object.x = center.x + object.orbitRadius * Math.sin(theta)
    object.z = center.z + object.orbitRadius * Math.cos(theta)

    object.angle += 3.65

    object.update()

}

function rotatePlanet(center, object) {
    const theta = object.angle / 180 * Math.PI
    const radius = Math.hypot(object.x - center.x, object.z - center.z)

    let velocity = Math.sqrt(Planet.g * object.mass / radius) // TODO: implement the relation to speed through angle increasing
    

    //orbit
    object.x = center.x + radius * Math.sin(theta)
    object.z = center.z + radius * Math.cos(theta)

    object.angle += 0.1
    object.update()
}



function animate() {
    //app
    rotatePlanet(sun, earth)
    rotatePlanet(sun, mercury)
    rotatePlanet(sun, venus)
    rotateMoon(earth, earthMoon)
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
