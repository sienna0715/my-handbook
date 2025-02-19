/* /ts/intro.ts line 121 */
export interface ScrollTriggerOptions {
    trigger: HTMLElement | string; // 스크롤 트리거 요소
    start: string;                 // 시작 지점 설정
    end: string;                   // 끝 지점 설정
    scrub: boolean | number;       // 스크롤링 동기화 설정
    onUpdate: (self: ScrollTrigger) => void; // 업데이트 이벤트 핸들러
}

/* /ts/gsap.ts buildGrid() */
export interface BuildGridOptions {
    grid: [number, number];
    width: number;
    gutter: number;
    className:string;
    parent: string | HTMLElement;
    onCellClick?: (e: MouseEvent) => void;
}

/* /ts/gsap.ts buildGrid() line 97 */
export interface BoxProperties extends HTMLDivElement {
    index?: number;
}