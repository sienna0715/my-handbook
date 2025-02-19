/*
 * File       : ts/intro.ts
 * Author     : SION
 * Guideline  : STUDIO JT
 *
 * SUMMARY:
 * 1) IMPORT
 * 2) INTRO
 */



/* **************************************** *
 * IMPORT
 * **************************************** */
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
// import { ScrollTriggerOptions } from '../types/interfaces';

gsap.registerPlugin(ScrollTrigger);

/* **************************************** *
 * Run
 * **************************************** */
export default function intro() {

    // scrollImageAnimation();

    // const canvas = document.getElementById('intro__canvas') as HTMLCanvasElement;
    // const ctx = canvas.getContext('2d');

    // // Browser size = Canvas size
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;

    // // Image load
    // const image = new Image();
    // image.src = '/assets/images/forest.jpg';

    // image.onload = function() {
    //     // Once the image has been loaded, draw it on the canvas.
    //     ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
    // };

    // // Resize the canvas
    // window.addEventListener('resize', () => {
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    // // 이미지가 다시 그려지도록 합니다.
    // ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
    // });

}

/* ********************************* 
 * Scroll Image Animation
 * *********************************/
function scrollImageAnimation() {
    // 사용자의 스크롤 위치를 추적하고, 해당 스크롤 위치에 해당하는 이미지 프레임 결정
    // 시퀀스 별 로드해야할 이미지 매칭
    const html = document.documentElement;
    const canvas = document.getElementById('intro__canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    // Image Load
    const frameCount = 25;
    const currentFrame = (index: any) => (
        `/assets/images/forest/forest_${index.toString().padStart(2, '0')}.jpg`
    )

    // 3️⃣ 빠르게 스크롤 시, 모든 새로운 이미지와 새로운 네트워크 요청 시 지연 발생 방지를 위해 미리 load하기
    // 애니메이션 부드럽게 만들기
    // 이미지 시퀀스를 모두 다운로드 한다.
    const preloadImages = () => {
        for (let i = 1; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        }
    };

    const img = new Image();
    img.src = currentFrame(1);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    img.onload = function(){
        context?.drawImage(img, 0, 0);
    }

    // 2️⃣ 이미지를 업데이트하는 콜백 함수이다.
    const updateImage = (index: any) => {
        img.src = currentFrame(index);
        context?.drawImage(img, 0, 0); // 다음 이미지로 설정
    }

    // 1️⃣ 이벤트 리스너가 스크롤을 추적하여 로드할 이미지 계산
    window.addEventListener('scroll', () => {  
        const scrollTop = html.scrollTop; // scroll의 시작(맨 위) 값
        const scrollMax = html.scrollHeight - window.innerHeight; // document's scroll height - inner height = scroll의 끝(맨 아래) 값을 알 수 있다.
        const scrollFraction = scrollTop / scrollMax; // scroll의 시작 값 / scroll의 끝 값 = scroll 진행률 (0~1 사이의 값)

        // console.log('----전체 스크롤의 진행률', scrollFraction, Math.floor(scrollFraction * 100) + '%');

        // 위치에 따른 이미지 로드할 수 있도록 scroll 진행률을 index로 변환
        // Math.min을 하는 이유: 최대 프레임 수가 총 프레임 수를 초과하지 않기 위해
        const frameIndex = Math.min(
        frameCount - 1,
        Math.ceil(scrollFraction * frameCount) // 프레임(이미지)의 수만큼 곱하기
        );
        // console.log('현재 스크롤의 인덱스', frameIndex)
        
        /* ********************************* 
        * requestAnimationFrame이란?
        * 브라우저의 새로고침 빈도와 매치되어 WebGL의 비디오 카드 or 통합 그래픽을 사용하여
        * 렌더링한다. 이는 하드웨어 가속을 활성화시킨다. 즉, 이미지가 깜짝이지 않고 프레임 전환을
        * 매우 원활하게 할 수 있다.
        * 콜백함수를 매개변수로 받는다. 이미지를 업데이트하고 <canvas>에 새 이미지를 그리는 함수를 전달한다.
        * *********************************/
        requestAnimationFrame(() => updateImage(frameIndex + 1)); // 이벤트로 스크롤이 움직일 때 실행된다(이미지를 교체한다).
        // 이미지 시퀀스는 0001.jpg에서 시작하지만 스크롤 진행률은 0에서 시작되기 때문에
        // frame index에 1을 더해주어야 이미지 값과 진행률 값이 일치하게 된다.
    });

    preloadImages();
}



/* ********************************* 
 * THREE.JS - FISH ANIMATION
 * *********************************/
// export default function intro() {
//     // Renderer
//     const canvas = document.getElementById('intro__canvas') as HTMLCanvasElement | null;
//     if (!canvas) return;

//     const renderer = new THREE.WebGLRenderer({
//         canvas,
//         antialias: true,
//         alpha: true,
//     });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

//     // Scene
//     const scene = new THREE.Scene();
//     scene.background = null;

//     // Camera
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     camera.position.x = 0;
//     camera.position.y = -1.1;
//     camera.position.z = 4;
//     scene.add(camera);

//     // Light
//     const ambientLight = new THREE.AmbientLight('white', 0.5);
//     scene.add(ambientLight) ;

//     const directionalLight = new THREE.DirectionalLight('white', 1);
//     directionalLight.position.x = 1;
//     directionalLight.position.z =2;
//     scene.add(directionalLight);

//     // GLTF Loader
//     const loader = new GLTFLoader();
//     const models = [];

//     function loadModel(url: string, position: THREE.Vector3): void {
//         loader.load(
//             url, 
//             (gltf) => {
//                 const model = gltf.scene;
//                 model.position.copy(position);
//                 models.push(model);
//                 scene.add(model);
//         }, 
//             undefined, // 진행 상황을 알리는 콜백함수 (optional) 
//             (error) => {
//                 console.error(error);
//         });
//     }

//     loadModel('/assets/models/fish.glb', new THREE.Vector3(2, -2.5, -2));
//     loadModel('/assets/models/fish.glb', new THREE.Vector3(0, -4, -4));
//     loadModel('/assets/models/fish.glb', new THREE.Vector3(2, -3.5, 0));
//     loadModel('/assets/models/fish.glb', new THREE.Vector3(-2.5, -3.5, -5));
//     loadModel('/assets/models/fish.glb', new THREE.Vector3(-5, -5.5, -7.5));
//     loadModel('/assets/models/fish.glb', new THREE.Vector3(-2.5, -5, -1.5));

//     function animate() {
//         requestAnimationFrame(animate);
//         renderer.render(scene, camera);
//     }

//     // Browser Size Responsive 
//     function setSize() {
//         camera.aspect = window.innerWidth / window.innerHeight;
//         camera.updateProjectionMatrix();
//         renderer.setSize(window.innerWidth, window.innerHeight);
//         renderer.render(scene, camera);
//     }

//     // Event
//     window.addEventListener('resize', setSize);

//     // Animation
//     gsap.registerPlugin(ScrollTrigger);

//     ScrollTrigger.create({
//         trigger: '.intro__webgl',
//         start: 'top top',
//         end: 'bottom top',
//         scrub: true,            // 스크롤에 따라 애니메이션 진행
//         pin: true,              // 스크롤을 멈추고 요소 고정
//         onUpdate: (self) => {
//             const position = self.progress * 2 * Math.PI;
//             scene.traverse((child) => {
//                 if ((child as THREE.Mesh).isMesh) {
//                     child.position.x = -position * 0.5;
//                     child.position.y = -position * 0.5;
//                     child.position.z = -position * 0.5;
//                 }
//             })
//         }
//     } as ScrollTriggerOptions);

//     animate();
// }