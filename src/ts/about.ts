const wrapper = document.querySelector('.comparison-slider') as HTMLDivElement;
const dashedText = document.querySelector('.comparison-slider__item--dash') as HTMLDivElement;
const filledText = document.querySelector('.comparison-slider__item--fill') as HTMLDivElement;
const dragBtn = document.querySelector('.comparison-slider__controller-button') as HTMLButtonElement;

let isDragging = false;

dragBtn.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSliderPosition(e);
});

wrapper.addEventListener('mousemove', (e) => {
    if (isDragging) {
        updateSliderPosition(e);
    }
});

wrapper.addEventListener('mouseup', () => {
    isDragging = false;
});

function updateSliderPosition(e?: any) {
    const rect = wrapper.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1);
    const restPercentage = 100 - (percentage * 100);

    // console.log('rect', rect);
    // console.log('offsetX', offsetX);
    // console.log('percentage', percentage * 100);
    
    dragBtn.style.left = `${percentage * 100}%`;
    dashedText.style.clipPath = `inset(0 0 0 ${percentage * 100}%)`;
    filledText.style.clipPath = `inset(0 ${restPercentage}% 0 0)`;
}