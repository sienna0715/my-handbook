/*
 * File       : ts/index.ts
 * Author     : SION
 * Guideline  : STUDIO JT
 *
 * SUMMARY:
 * 1) Import
 * 2) RUN
 * 3) Global
 */



/* **************************************** *
 * Import
 * **************************************** */
import intro from './intro';
import motion from './motion';
import { gsap } from 'gsap';
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

/* **************************************** *
 * RUN
 * **************************************** */
intro();
motion();
scrollDown();
progressBar();

scrollVisibility('.feature-intro__float-item');

document.addEventListener('DOMContentLoaded', () => { 
    loadHTML('/components/header.html').catch(error => {
        console.error('Faild to load header:', error);
    });
});

document.addEventListener('DOMContentLoaded', () => { 
    loadHTML('/components/footer.html').catch(error => {
        console.error('Faild to load footer:', error);
    });
});



/* **************************************** *
 * Global
 * **************************************** */
/**
 * Load Header & Footer
 *
 * @version 1.0.0
 * @since 2024-10-30
 * 
 */

async function loadHTML(url: string): Promise<void> {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const html: string = await res.text();

    // HEADER
    const headerElement: HTMLElement | null = document.getElementById('header');

    if (headerElement && html.includes('header__inner')) {
        headerElement.innerHTML = html
            .replace(/<meta[^>]*>/gi, '') // <meta> 태그 제거
            .replace(/<title>.*<\/title>/i, ''); // <title> 태그 제거
    } else {
        // console.error('Header element not found');
    }

    // FOOTER
    const footerElement: HTMLElement | null = document.getElementById('footer');

    if (footerElement && html.includes('footer__container')) {
        footerElement.innerHTML = html
            .replace(/<meta[^>]*>/gi, '') // <meta> 태그 제거
            .replace(/<title>.*<\/title>/i, ''); // <title> 태그 제거
    } else {
        // console.error('Footer element not found');
    }
    
}



/**
 * Intersection Observer Instance
 *
 * @version 1.0.0
 * @since 2024-11-06
 * @example scrollVisibility('.app')
 * 
 */

function scrollVisibility(target: string) {
    const observers = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // console.log(entry)
        if(entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        } else {
          // entry.target.classList.remove('fade-in');
        }
      });
    }, { threshold: 0.1 });
  
    // 관찰 대상 지정
    const targets = document.querySelectorAll(target);
    targets.forEach((element) => {
      observers.observe(element);
    });
  }



/**
 * Intersection Observer Instance
 *
 * @version 1.0.0
 * @since 2024-11-20
 * @example
 * 
 */

function scrollDown() {
    const scrollDownBtn = document.querySelector('.scroll-down__btn');

    // animation
    gsap.to('.arrow-icon', { duration: 1.5, autoAlpha: 0, repeat: -1, repeatDelay: 0.5, stagger: { each: 0.5, repeat: -1 } });

    // event
    scrollDownBtn?.addEventListener('click', () => {
        const target = document.getElementById('featureIntro');

        // 부드럽게 스크롤 이동
        target?.scrollIntoView({
            behavior: "smooth", // 부드러운 스크롤
            block: "start"      // 섹션의 시작 부분으로 이동
        });
    });
}



/**
 * Smooth scroll with gsap
 *
 * @version 1.0.0
 * @since 2024-12-17
 * @author sion (cf. STUDIO-JT (NICO))
 * @requires gsap.js
 * @requires ScrollToPlugin.js
 */
// ScrollToPlugin을 GSAP에 등록
gsap.registerPlugin(ScrollToPlugin);

function scrollSmooth(event: WheelEvent): void {
    event.preventDefault();

    if (document.body.classList.contains("modal-open")) return;

    let scrollTime: number     = 1;
    let distanceOffset: number = 2.5;
    let scrollDistance: number = ( window.innerHeight / distanceOffset ); // 383.6
    let delta: number          = -event.deltaY / 100;
    let scrollTop: number   = window.scrollY;
    let finalScroll: number = scrollTop - delta * scrollDistance;
    // console.log('스크롤 위치', scrollTop);
    // console.log('스크롤 이동🚗', finalScroll);
    
    // gsap.killTweensOf(window); // 기존 애니메이션을 중단

    // 🔥 ψ(｀∇´)ψ target을 제대로 설정해야 동작한다!!!!
    // 브라우저의 기본 동작이 여전히 개입하고 있을 가능성을 배제하기 위함!
    gsap.to(document.documentElement || document.body, {
        duration: scrollTime,
        scrollTo: { y: finalScroll, autoKill: true },
        ease: "power3.out",
        overwrite: "auto",
        // onComplete: () => {
        //     console.log("애니메이션 완료, 최종 위치:", window.scrollY);
        // },
        // onInterrupt: () => {
        //     console.log("애니메이션이 중단되었습니다.");
        // },
    });
}

// 이벤트 리스너 추가 (wheel 이벤트)
window.addEventListener("wheel", scrollSmooth, { passive: false });




/**
 * progress bar
 *
 * @version 1.0.0
 * @since 2024-12-19
 * @example 
 * 
 */
function progressBar(): void {
    if (! document.body.classList.contains('animation-page')) return;

    document.addEventListener('DOMContentLoaded', (): void => {
        // Create and append the custom scroll bar element
        const scrollBarHTML: HTMLDivElement = document.createElement('div');
        scrollBarHTML.className = 'progress-bar__thumb';
        scrollBarHTML.innerHTML = '<span class="en-text--04"></span>';

        const container = document.querySelector('.animation-page .progress-bar') as HTMLDivElement;
        container.appendChild(scrollBarHTML);

        // Scroll event listener
        window.addEventListener('scroll', (): void => {
            const scrollAmount: number = window.scrollY;
            const documentHeight: number = document.documentElement.scrollHeight;
            const windowHeight: number = window.innerHeight;
            const scrollPercent: number = (scrollAmount / (documentHeight - windowHeight)) * 100;
            const roundScroll: number = Math.round(scrollPercent);

            // Update the scroll bar width and text
            scrollBarHTML.style.width = `${scrollPercent}%`;
            (scrollBarHTML.querySelector('span') as HTMLSpanElement).textContent = `${roundScroll.toString()}%`;
        });

        // Change image at 100% charge
        document.addEventListener('scroll', (): void => {
            const warningImg = document.querySelector('.animation__warning img') as HTMLImageElement;
            
            if ( (scrollBarHTML.querySelector('span') as HTMLSpanElement).textContent === '100%' ) {
                warningImg.setAttribute('src', '/assets/images/myface-after.png');
            } else {
                warningImg.setAttribute('src', '/assets/images/myface.png');
            }
        });
    });
}