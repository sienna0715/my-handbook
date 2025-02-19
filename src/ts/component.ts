/*
 * File       : ts/component.ts
 * Author     : SION
 * Guideline  : STUDIO JT
 *
 * SUMMARY:
 * 1) Import
 * 2) Run
 * 3) UI Function
 */



/* **************************************** *
 * Run
 * **************************************** */
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';


/* **************************************** *
 * Run
 * **************************************** */
document.addEventListener('DOMContentLoaded', () => { 
    const loadTask = [
        loadUI('/components/tab.html').catch(error => {
            console.error('Faild to load tab UI:', error);
        }),
        loadUI('/components/accordion.html').catch(error => {
            console.error('Faild to load accordion UI:', error);
        }),
        loadUI('/components/form.html').catch(error => {
            console.error('Faild to load accordion UI:', error);
        }),
        loadUI('/components/carousel.html').catch(error => {
            console.error('Faild to load accordion UI:', error);
        }),
        loadUI('/components/toggle.html').catch(error => {
            console.error('Faild to load accordion UI:', error);
        }),
        loadUI('/components/loader.html').catch(error => {
            console.error('Faild to load accordion UI:', error);
        }),
    ]; 

    Promise.all(loadTask)
        .then(() => {
            component();
            pagination();
        })
        .catch( err => {
            console.error(err);
        })
});

export default function component() {
    dropDown();
    filterTag();
    filterCheckbox();
    modal();
    tab();
    accordion();
    form();
    carousel();
    toggle();
    totalNum();
}



/* **************************************** *
 * Mutation Observer
 * **************************************** */
// Select the node that will be observed for mutations
const targetNode = document.body;

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = (mutationList: any) => {

    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            console.log("A child node has been added or removed.");
            filterPost();
        }
    }
    
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);



/* **************************************** *
 * UI Function
 * **************************************** */
/**
 * Load UI Components
 *
 * @version 1.0.0
 * @since 2024-11-25
 * @example loadUI('/components/tab.html')
 * 
 */

async function loadUI(url: string): Promise<void> {
    const res = await fetch(url);
    const category = url.replace(/^\/components\//, '').replace(/\.html$/, '');

    if (!res.ok) {
        throw new Error('Network response was not ok');
    }

    const html: string = await res.text();
    const parentElement: HTMLElement | null = document.querySelector(`.modal__layout.${category}`);

    if (parentElement) {
        parentElement.innerHTML = html
            .replace(/<meta[^>]*>/gi, '') // <meta> 태그 제거
            .replace(/<title>.*<\/title>/i, ''); // <title> 태그 제거
    } else {
        // console.error('Header element not found');
    }
    
}



/**
 * Pagination
 *
 * @version 1.0.0
 * @since 2024-12-20
 * @example 
 * 
 */

const itemsPerPage = 4; // 한 페이지에 표시할 아이템 수
let currentPage = 1; // 현재 페이지

function pagination() {
   
    displayItems(itemsPerPage);
    triggerPagination();
    
}

// 1. 데이터를 페이지 단위로 나누기
function sliceIntoChunks(itemsPerPage: number) {
    const posts = document.querySelectorAll('.content__post');
    const postsArr = Array.from(posts); // NodeList to Array
    const paginatedItems: HTMLElement[][] = [];

    if (!posts) return [];

    for (let i = 0; i < postsArr.length; i += itemsPerPage) {
        paginatedItems.push(postsArr.slice(i, i + itemsPerPage) as HTMLElement[]);
    }

    return paginatedItems;
}

// 2. 페이지별로 아이템 표시
function displayItems(itemsPerPage: number) {
    const chunks = sliceIntoChunks(itemsPerPage);

    // undefined 방지
    if (!chunks || chunks.length === 0) {
        console.error('No chunks available');
        return;
    }

    // console.log('chunk', chunks);

    if (currentPage === 1) {
        chunks[0].forEach((chunk) => {
            (chunk as HTMLLIElement).style.display = 'block';
            (chunk as HTMLLIElement).dataset.show = 'true';
        });
    }

    if (currentPage > 1) {
        // 청크 배열의 갯수와 현재 페이지와 같으면 버튼 숨기기
        if (currentPage === chunks.length) {
            document.querySelector('.pagination__btn')?.remove();
        };

        chunks[currentPage - 1].forEach((chunk) => {
            (chunk as HTMLLIElement).style.display = 'block';
            (chunk as HTMLLIElement).dataset.show = 'true';
            document.querySelector('body')?.addEventListener('click', () => {
                (chunk as HTMLLIElement).dataset.show = 'true';
            });
        });
    }
    /* 🔥 노트
     * display: block/none 방식은 필터링 함수와 충돌을 일으키고 있다.
     * 필터링을 사용하지 않고 있을 때, 페이지네이션이 동작하는 방법과
     * 필터링이 적용된 상태에서 페이지네이션이 동작하는 방식 모두 필요하다.
     * => diplayItems를 기준으로 필터링을 적용하면 된다!!
     * 
     * 더이상 불러올 페이지가 없으면 show more 버튼은 사라져야 한다.
     * 
     * filtering 될 때는 페이지와 상관없이 요소를 찾아서 출력해야 한다.
     * 필터링이 적용되지 않으면 다시 현재 페이지에 속하는 데이터 말고는 data-show를 false 또는 제거해야 한다.
     * =>
     */
}

// 3. 페이지네이션 버튼
function triggerPagination() {
    const pagination = document.querySelector('.pagination') as HTMLDivElement;

    if (!pagination) return;

    pagination.innerHTML = '';

    const showBtn = document.createElement('button');
    showBtn.className = 'secondary__btn secondary__btn--fill pagination__btn';
    showBtn.textContent = 'Show more';
    pagination.appendChild(showBtn);

    showBtn.addEventListener('click', () => {
        currentPage++;
        displayItems(itemsPerPage);
    });
}



/**
 * Search & Filter Tag
 *
 * @version 1.0.0
 * @since 2024-11-14
 * @example 
 * 
 */

function filterTag() {
    const form = document.querySelector('.filter__search') as HTMLFormElement;
    const wrapper = document.querySelector('.filter__result') as HTMLDivElement;
    const clearBtn = document.querySelector('.filter__clear-btn') as HTMLButtonElement;
    const target = document.getElementById('filter__search-field') as HTMLInputElement;
    let datas: string[] = JSON.parse(sessionStorage.getItem('tags') || '[]');

    if(form) {
        form!.addEventListener('submit', (e) => {
            e.preventDefault();
    
            if (target.value.trim() === '') return; 
    
            saveSession(target!.value);
    
            createTag(target!.value);
    
            // input reset
            target!.value = '';

            deleteTag();
        });
    }
    
   // 새로고침 시에도 데이터 유지
    window.onload = function() {
        datas.forEach(el => {
            createTag(el);
        });

        deleteTag();
    }

    // 태그 전체 제거
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            datas = [];
            sessionStorage.removeItem('tags');

            wrapper.textContent = '';
        });
    }

    // 태그 제거
    function deleteTag() {
        const tagBtn = document.querySelectorAll('.filter__tag') as NodeListOf<HTMLButtonElement>;

        tagBtn.forEach((el) => {
            el.addEventListener('click', () => {
                const target = el.textContent?.trim();

                if (target) deleteSession(target);
                el.remove();
            });
        })
    }

    // Create Tag
    function createTag(tag: string) {
        const element = document.createElement('button');
        
        element.classList.add('filter__tag')
        element.innerHTML = `
            <span>${tag}</span>
            <i class="filter__remove-icon fa-solid fa-xmark"></i>
        `;
        wrapper.appendChild(element);
    }
    

    // Save in sessionStorage
    function saveSession(data: string) {
        data = data.toLocaleLowerCase();

        if (!datas.includes(data)) {
            datas.push(data);
            sessionStorage.setItem('tags', JSON.stringify(datas));
        }
    }

    // Delete in SessionStorage
    function deleteSession(data: string) {
        const targetIdx = datas.indexOf(`${data}`);

        datas.splice(targetIdx, 1);
        sessionStorage.setItem('tags', JSON.stringify(datas));
    }
}

/**
 * checked value of checkbox
 *
 * @version 1.0.0
 * @since 2024-11-19
 * @updated 2024-11-21
 * @example 
 * 
 */

function filterCheckbox() {
    let datas: string[] = JSON.parse(sessionStorage.getItem('checked') || '[]');

    document.querySelectorAll('.sub-menu__item input[type="checkbox"]').forEach((el: any) => {

        // 새로고침해도 checked 상태 유지하기
        if (datas.includes(el.value)) {
            el.checked = true;
        }
        
        el.addEventListener('change', () => {
            const siblingText = el.nextElementSibling?.textContent.toLowerCase();

            if (el.checked) {
                if (!datas.includes(siblingText)) {
                    datas.push(siblingText);
                }
            } else {
                datas = datas.filter((data) => data !== siblingText);
            }

            sessionStorage.setItem('checked', JSON.stringify(datas));

            filterPost();
        });
    });
}



/**
 * Fitering Post
 *
 * @version 1.0.0
 * @since 2024-11-19
 * @updated 2024-11-21
 * @example 
 * 
 */

function filterPost() {
    const posts = document.querySelectorAll('.content__post') as NodeListOf<HTMLDivElement>;
    const loadedPosts = Array.from(posts).filter(post => post.dataset.show === "true");
    let getTagData: string[] = JSON.parse(sessionStorage.getItem('tags') || '[]');
    let getCheckedData: string[] = JSON.parse(sessionStorage.getItem('checked') || '[]');
    let filteredPost = 0; // 필터링된 포스트 수
    const totalFilter = [...getTagData, ...getCheckedData];
     
    loadedPosts.forEach((post: any) => {   

        if (totalFilter.length > 0 && totalFilter.includes(post.dataset['category'])) {
            // console.log('find post!!')
            post.style.display = 'block';

            filteredPost++;
        } else if (totalFilter.length > 0 && !totalFilter.includes(post.dataset['category'])) {
            // console.log('Not find post...')
            post.style.display = 'none'
        } else {
            post.style.display = 'block';
        }
    });

    if (totalFilter.length > 0 && filteredPost === 0) {
        document.querySelector('.content__list')?.classList.add('no-matching__post');
    } else  {
        document.querySelector('.content__list')?.classList.remove('no-matching__post');
    }
}



/**
 * Modal
 *
 * @version 1.0.0
 * @since 2024-11-18
 * @example 
 * 
 */
function modal() {
    const body = document.querySelector('body');
    const target = document.querySelectorAll('.content__post');
    
    if (body!.classList.contains('component-page')) {

        target.forEach((el) => {
            const item = el.querySelector('.content__item') as HTMLDivElement;
            const modal = el.querySelector('.modal__container') as HTMLDivElement;
            // const content = el.querySelector('.modal__content') as HTMLDivElement;
            const closeBtn = el.querySelector('.close__btn') as HTMLDivElement;
            
            // OPEN
            item.addEventListener('click', () => {
                modal.style.display = 'block';
                body!.classList.add('modal-open');
            });

            // CLOSE Button
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                body!.classList.remove('modal-open');
            });

            // CLOSE clicked background
            // modal.addEventListener('click', (e) => {
            //     const target = e.target as HTMLDivElement;

            //     if (target !== content) {
            //         target.style.display = 'none';
            //         body!.classList.remove('modal-open');
            //     }
            // });
        });

    }
}



/**
 * Dropdown
 *
 * @version 1.0.0
 * @since 2024-11-13
 * @example 
 * 
 */

function dropDown() {
    const targertBtn = document.querySelectorAll('.dropdown__btn') as NodeListOf<HTMLSpanElement>;
    
    targertBtn.forEach((el) => {
        let isOpen: boolean = true;

        el.addEventListener('click', () => {
            const parent = el.closest('.menu__item') as HTMLLIElement;
            const target = parent!.querySelector('.sub-menu__list') as HTMLUListElement;

            isOpen = !isOpen;
    
            if (isOpen) {
                el.style.transform = 'rotate(0deg)';
                target!.style.display = 'block';
            } else {
                el.style.transform = 'rotate(180deg)'
                target!.style.display = 'none';
            }
        });

    });
}



/**
 * Tab
 *
 * @version 1.0.0
 * @since 2024-11-25
 * @example 
 * 
 */
function tab() {
    const tabs: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.tab__menu button');
    const tabContents: NodeListOf<HTMLDivElement> = document.querySelectorAll('.tab__content');
    const underline = document.querySelector('.tab__underline') as HTMLDivElement;

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const targetId: string | null = tab.getAttribute('data-tab');
            
            // Delete 'active' class in all tab
            tabs.forEach(t => t.classList.remove('tab--active'));

            // Hide Content
            tabContents.forEach(content => {
                content.style.display = 'none';
              });

            // Active clicked current tab
            tab.classList.add('tab--active');

            // Display Content
            const targetContent = document.getElementById(`${targetId}`);

            if (targetContent) {
                targetContent.style.display = 'block';
            }

            // Move underline
            const itemRect = tab.getBoundingClientRect();
            const listRect = (tab.parentNode as HTMLDivElement)?.getBoundingClientRect();

            underline.style.width = `${itemRect.width}px`;
            underline.style.transform = `translateX(${itemRect.left - listRect.left}px)`;
        });
    });

    // init active underline
    const initialTab = document.querySelector('.tab--active') || tabs[0];

    if (initialTab) {
        const initItemRect = initialTab.getBoundingClientRect();
        const listRect = (initialTab.parentNode as HTMLDivElement)?.getBoundingClientRect();

        underline.style.width = `${initItemRect}px`;
        underline.style.transform = `translateX(${initItemRect.left - listRect.left}px)`;
        initialTab.classList.add('tab--active');
    }
}



/**
 * accordion
 *
 * @version 1.0.0
 * @since 2024-11-26
 * @example 
 * 
 */

function accordion() {
    const items = document.querySelectorAll('.accordion__item') as NodeListOf<HTMLLIElement>;

    items.forEach((item) => {
        const head = item.querySelector('.accordion__head') as HTMLDivElement;
        const toggleBtn = item.querySelector('.toggle__btn') as HTMLSpanElement;
        const toggleIcon = toggleBtn.querySelector('.icon') as HTMLElement;
        const content = item.querySelector('.accordion__content') as HTMLDivElement;
        
        // // first item active
        // if (index === 0 && item.classList.contains('accordion--active')) {
        //     content.style.maxHeight = content.scrollHeight + 'rem';
        // }
       
        head.addEventListener('click', () => {
            item.classList.toggle('accordion--active');

            const isActive = item.classList.contains('accordion--active');
            if (isActive) {
                toggleIcon.classList.replace('fa-plus', 'fa-minus');
                content.style.maxHeight = content.scrollHeight + 'rem';
            } else {
                toggleIcon.classList.replace('fa-minus', 'fa-plus');
                content.style.maxHeight = '0';
            }
        });
    });

}



/**
 * Form
 *
 * @version 1.0.0
 * @since 2024-11-27
 * @example 
 * 
 */
function form() {
    const form = document.querySelector('.form__container') as HTMLFormElement;
    const submitBtn = document.querySelector('.form__action') as HTMLInputElement;

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault(); 

        validation();

        if (validation()) {
            form.submit();
        }
    });
    
}

function validation() {
    const nameValue = document.getElementById('data[0]') as HTMLInputElement;
    const phoneValue = document.getElementById('data[1]') as HTMLInputElement;
    const emailValue = document.getElementById('data[2]') as HTMLInputElement;

    const checkedString = /^[a-zA-Z가-힣]+$/;
    const checkedNum = /^[0-9]+$/;
    const checkEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let isData1, isData2, isData3;

    // Name
    if (!checkedString.test(nameValue.value) || nameValue.value.trim() === '') {
        nameValue.closest('.form__entry')!.classList.add('form__data--error');
        nameValue.focus();

        isData1 = false;
    } else {
        nameValue.closest('.form__entry')!.classList.remove('form__data--error');
        nameValue.nextElementSibling!.textContent = '';

        isData1 = true;
    }

    // Phone Number
    if (!checkedNum.test(phoneValue.value) || phoneValue.value.trim() === '') {
        phoneValue.closest('.form__entry')!.classList.add('form__data--error');
        phoneValue.nextElementSibling!.textContent = 'Please write only in numbers.';
        phoneValue.focus();

        isData2 = false;
    } else {
        phoneValue.closest('.form__entry')!.classList.remove('form__data--error');
        phoneValue.nextElementSibling!.textContent = '';

        isData2 = true;
    }

    // Email
    if (!checkEmail.test(emailValue.value) || emailValue.value.trim() === '') {
        emailValue.closest('.form__entry')!.classList.add('form__data--error');
        emailValue.nextElementSibling!.textContent = 'Please write only in numbers.';
        emailValue.focus();

        isData3 = false;
    } else {
        emailValue.closest('.form__entry')!.classList.remove('form__data--error');
        emailValue.nextElementSibling!.textContent = '';

        isData3 = true;
    }

    if (isData1 && isData2 && isData3) {
        return true;
    } else {
        return false;
    }
}



/**
 * Carousel
 *
 * @version 1.0.0
 * @since 2024-11-29
 * @example 
 * 
 */
function carousel() {
    new Swiper('.swiper', {
        modules: [Navigation, Pagination, Autoplay],
        effect: 'coverflow',
        // swiper 3D 속성 지정
        coverflowEffect: {
            depth: 380,            // 숫자가 커지면 중앙을 point로 잡고 perspective로 원근법이 적용
            modifier: 1,         // 중앙에 있는 active된 슬라이드의 이미지가 맨 위 레이어처럼 표시
            rotate: 0,           // 중앙에 있는 이미지를 제와한 양쪽 슬라이드 회전 각도 (0: 회전하지 않도록 함)
            slideShadows: false, // 기본적으로 적용되어있는 shadow 그라데이션을 false로 해제
            stretch: 0,          // 슬라이드 간 거리
        },
        centeredSlides: true,
        slidesPerView: 5, // 한 번에 보여질 슬라이드 수
        spaceBetween: 0, // 슬라이드 간 간격 (px)
        loop: true, // 무한 루프

        // 네비게이션 버튼
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // 페이지네이션
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
      
        // 자동 재생
        autoplay: {
            delay: 3000, // 3초마다 슬라이드 변경
            disableOnInteraction: false, // 사용자 조작 후에도 자동 재생 유지
            pauseOnMouseEnter: false, // 마우스 호버 시 일시 중지 비활성화
        },

        // 반응형
        breakpoints: {
            640: {
              slidesPerView: 2, // 화면 너비 640px 이상
            },
            1024: {
              slidesPerView: 3, // 화면 너비 1024px 이상
            },
          },
      });
      
}



/**
 * Toggle
 *
 * @version 1.0.0
 * @since 2024-12-02
 * @example 
 * 
 */
function toggle() {
    const wrapper = document.querySelector('.modal__layout.toggle') as HTMLDivElement;
    const target = document.querySelector('.toggle_btn') as HTMLDivElement;

    target.addEventListener('click', () => {
        const switchVal = document.getElementById('switch') as HTMLInputElement;

        if (switchVal.checked) {
            wrapper.style.background = 'var(--color-gray3)';
        } else {
            wrapper.style.background = 'var(--color-white)';
        }
    });
}


function totalNum() {
    const total = document.querySelector('.total__num') as HTMLSpanElement;
    const posts = document.querySelectorAll('.content__post') as NodeListOf<HTMLLIElement>;

    total.textContent = `${posts.length} posts`;
}