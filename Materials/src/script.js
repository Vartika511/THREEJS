import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


//Debug
const gui= new dat.GUI()


//Texture
const textureLoader =new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()


const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture= textureLoader.load('/textures/matcaps/8.png')
const gradientTexture= textureLoader.load('/textures/gradients/5.jpg')
gradientTexture.minFilter= THREE.NearestFilter
gradientTexture.magFilter= THREE.NearestFilter

const environmentMaptexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Object

// Basic Material
/* const material= new THREE.MeshBasicMaterial({
    map: doorColorTexture,
    color:'red',
    wireframe: true,
    opacity: 0.5,
    transparent:true,
    alphaMap: doorAlphaTexture,
    side: THREE.DoubleSide
}) */
/* 


// Normal Material
const material= new THREE.MeshNormalMaterial({
    //wireframe:true,
    //flatShading:true
}) */


//Matcap Material
/* 
const material=new THREE.MeshMatcapMaterial({
    matcap: matcapTexture
}) */


//Depth Material
/* const material=new THREE.MeshDepthMaterial()  */

//Lambert Material Only with lights
/* const material= new THREE.MeshLambertMaterial() */


//phong Material
/* const material=new THREE.MeshPhongMaterial({
    shininess:100,
    specular: new THREE.Color('red')
})
 */


//Toon material
/* const material= new THREE.MeshToonMaterial({
    gradientMap: gradientTexture
})
 */

//standard material
/* const material= new THREE.MeshStandardMaterial({
    //metalness: 0.5,
    //roughness: 0.65,
    map:doorColorTexture,
    aoMap:doorAmbientOcclusionTexture,
    aoMapIntensity:1,
    displacementMap:doorHeightTexture,
    displacementScale:0.05,
    metalnessMap:doorMetalnessTexture,
    roughnessMap:doorRoughnessTexture,
    normalMap:doorNormalTexture,
    alphaMap:doorAlphaTexture,
    transparent:true
}) */

//gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.001)
//gui.add(material, 'displacementScale').min(0).max(10).step(0.001) 


const material= new THREE.MeshStandardMaterial({
    metalness:0.7,
    roughness: 0.2,
    envMap:environmentMaptexture
})

gui.add(material, 'roughness').min(0).max(1).step(0.001)
gui.add(material, 'metalness').min(0).max(1).step(0.001)



const sphere= new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5,64,64),
    material
)
sphere.position.x=-1.3

const plane= new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1,1,100,100),
    material
)
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))




const torus= new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.1, 64, 128),
    material
    )
    torus.position.x=1.3
    scene.add(sphere,plane,torus)

torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))





//Lights
const ambientLight= new THREE.AmbientLight(0xffffff, 0.5)
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x=2
pointLight.position.y=3
pointLight.position.z=4
scene.add(ambientLight, pointLight)









/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()
    sphere.rotation.y=0.1*elapsedTime
    plane.rotation.y=0.1*elapsedTime
    torus.rotation.y=0.1*elapsedTime

    sphere.rotation.x=0.1*elapsedTime
    plane.rotation.x=0.1*elapsedTime
    torus.rotation.x=0.1*elapsedTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()