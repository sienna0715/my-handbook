/*
 * File       : ts/gsap.ts
 * Author     : SION
 * Guideline  : STUDIO JT
 *
 * SUMMARY:
 * 1) Import
 * 2) Stagger
 */



/* **************************************** *
 * Import
 * **************************************** */
import { gsap } from 'gsap';
import { BuildGridOptions, BoxProperties } from '../types/interfaces';

/* **************************************** *
 * Run
 * **************************************** */
export default function gsapStagger() {
    main();
}

/* **************************************** *
 * Stagger
 * **************************************** */
/**
 * GSAP Stagger
 *
 * @version 1.0.0
 * @since 2024-11-08
 * 
 */

function main() {
    // 1️⃣ grid 크기 지정
    const grid: [number, number] = [5, 13]; // [rows, columns]
    const tl = gsap.timeline(); 
    
    // 현재 Option checked 값 저장 / 선언
    const checkedOptions: NodeListOf<HTMLInputElement> = document.querySelectorAll('.control-vertical input');
    let currentForm: string | number = "center", 
        currentAxis: null | string = null, 
        currentEase: string = "none";
    
    checkedOptions.forEach((el) => {
        el.addEventListener('click', () => {
            if (el.checked === true && el.id !== 'index') {
                if(el.name === 'from') {currentForm = el.value;}
                if(el.name === 'axis') {currentAxis = el.value;}
                if(el.name === 'ease') {currentEase = el.value;}
                
                updateAnimation();
            } else if ( el.checked === true && el.id === 'index') {
                updateIndex(el.value);
            }
        });
    });
    
    // 2️⃣ box 호출
    buildGrid({ grid: grid, width: 700, gutter: 15, className: 'box', parent: '#boxContainer', onCellClick: onCellClick});
    
    // 5️⃣ animateBoxes 호출
    animateBoxes();

    // 3️⃣ box 생성하기 📦
    /** 
     * @example 
     * vars = {
     *    grid: grid, 
     *    width: 1000, 
     *    gutter: 15, 
     *    className: "box", 
     *    parent: "#container", 
     *    onCellClick: onCellClick
     * } 
     */
    function buildGrid(vars: BuildGridOptions): HTMLElement {
        vars = vars || {};
        
        const container = document.createElement('div'),
              rows = vars.grid[0] || 5,
              cols = vars.grid[1] || 5, 
              width = vars.width || 100,
              gutter = vars.gutter || 1,
              className = vars.className || '',
              parent = (typeof vars.parent === 'string')
                        ? document.querySelector(vars.parent) as HTMLElement
                        : vars.parent
                            ? vars.parent
                            : document.body,
              colsWidth = (width - cols * gutter) / cols, // 열 너비를 구하는 공식
              css = `
                    margin: 0 ${gutter / width * 100}% ${gutter / width * 100}% 0;
                    width: ${colsWidth / width * 100}%
              `,
              // margin: 요소 간의 간격(gutter)을 컨테이너 대비 백분율한 값
              // width: 각 열의 너비를 컨테이너 너비 대비 백분율한 값
              cellTotal = rows * cols;
    
        let box: BoxProperties;
    
        for (let i = 0; i < cellTotal; i++) {
            box = document.createElement('div');
            box.style.cssText = css; // 인라인 스타일 선언
            box.setAttribute("class", className);
            box.setAttribute("data-index", `${i}`);
            (box as BoxProperties).index = i;
    
            // onCellClick 호출
            if (vars.onCellClick) {
                box.addEventListener('click', vars.onCellClick);
            }
    
            container.appendChild(box);
        }
    
        container.style.cssText = `width: ${width}px; padding: ${gutter}px 0 0 ${gutter}px;`
        parent?.appendChild(container);
    
        return container;
    }
    
    // 4️⃣ animate 함수 작성
    function animateBoxes(from: any = currentForm, axis: any = currentAxis, ease: any = currentEase) {
        tl.to('.box', {
            duration: 1,
            scale: 0.1,
            y: 60,
            ease: ease,
            yoyo: true,
            repeat: 1,
            stagger: {
                // each: 0.1,
                amount: 1.5,
                grid: grid,
                from: from,
                axis: axis,
                ease: ease
            }
        });
    }
    
    // 6️⃣ onCellClick 함수 작성
    function onCellClick(e: MouseEvent) {
        const target = e.target as HTMLElement & { index?: any };
    
        updateIndex(target.index);
    }
    
    // 7️⃣ updateAnimation 함수 작성
    function updateAnimation() {
        tl.seek(0).clear(); // 재생 위치를 0초로 이동(=애니메이션의 시작 부분) 후, 타임라인에 추가된 모든 애니메이션과 콜백을 제거 => 초기화
        animateBoxes(currentForm, currentAxis, currentEase);
    }
    
    // 8️⃣ updateFrom 함수 작성
    function updateIndex(value: number | string) {
        const target = document.getElementById('index') as HTMLInputElement;
        const targetText = document.getElementById('fromIndex');
        target.value = String(value);
        currentForm = value;
    
        target!.checked = true;
        targetText!.textContent = `index: ${currentForm}`;
    
        animateBoxes(currentForm);
    }
}
