/*
 * File       : ts/motion.ts
 * Author     : SION
 * Guideline  : STUDIO JT
 *
 * SUMMARY:
 * 1) Import
 * 2) Motion
 */



/* **************************************** *
 * Import
 * **************************************** */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { ScrollTriggerOptions } from '../types/interfaces';



/* **************************************** *
 * Run
 * **************************************** */
export default function motion() {
    contentModel();
}


/* **************************************** *
 * Motion
 * **************************************** */
function contentModel() {
    // Renderer
    const canvas = document.getElementById('motionCanvas') as HTMLCanvasElement | null;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
    });

    renderer.setSize(canvas.clientWidth , canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.x = 0;
    camera.position.y = 1;
    camera.position.z = 2;
    scene.add(camera);

    // Light
    const ambientLight = new THREE.AmbientLight('white', 0.5);
    scene.add(ambientLight) ;

    const directionalLight = new THREE.DirectionalLight('white', 1);
    directionalLight.position.x = 1;
    directionalLight.position.z = 2;
    scene.add(directionalLight);

    // GLTF Loader
    const loader = new GLTFLoader();
    const models = [];

    function loadModel(url: string, position: THREE.Vector3): void {
        loader.load(
            url, 
            (gltf) => {
                const model = gltf.scene;
                model.position.copy(position);
                models.push(model);
                scene.add(model);
        }, 
            undefined, // 진행 상황을 알리는 콜백함수 (optional) 
            (error) => {
                console.error(error);
        });
    }

    loadModel('../assets/models/bird.glb', new THREE.Vector3(0, 0, 0));

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    // Browser Size Responsive 
    function setSize() {
        camera.aspect = canvas!.clientWidth / canvas!.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }

    // Event
    window.addEventListener('resize', setSize);

    // Animation
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,            // 스크롤에 따라 애니메이션 진행
        onUpdate: (self) => {
            const rotation = self.progress * 5 * Math.PI;
            scene.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    child.rotation.z = rotation;
                }
            })
        }
    } as ScrollTriggerOptions);

    animate();
}