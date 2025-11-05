const spotlightItems = [
    { name: "Mercury", img: "./img/Mercury.png", description: "水星：太陽系中最小，且離太陽最近的行星。" },
    { name: "Venus", img: "./img/Venus.png", description: "金星：被濃密大氣層覆蓋，表面溫度極高，是地球的姊妹星。" },
    { name: "Earth", img: "./img/Earth.png", description: "地球：我們生活的藍色星球，是已知唯一擁有生命的行星。" },
    { name: "Mars", img: "./img/Mars.png", description: "火星：有著紅色外觀，是未來人類探索與殖民的潛在目標。" },
    { name: "Jupiter", img: "./img/Jupiter.png", description: "木星：太陽系中最大的行星，以其大紅斑著稱。" },
    { name: "Saturn", img: "./img/Saturn.png", description: "土星：以其壯觀、清晰的行星環系統聞名於世。" }, // 🚀 修正：將 : 改為 /
    { name: "Uranus", img: "./img/Uranus.png", description: "天王星：一顆冰巨星，以其極端傾斜的自轉軸獨樹一格。" },
    { name: "Neptune", img: "./img/Neptune.png", description: "海王星：距離太陽最遠的行星，有著強勁的風暴。" },
];

let images = [];
let imagesToLoad = spotlightItems.length;

function setupScrollTrigger() {
    const titlesContainer = document.querySelector(".spotlight-titles");
    const imagesContainer = document.querySelector(".spotlight-images");
    const spotlightHeader = document.querySelector(".spotlight-header");
    const titlesContainerElement = document.querySelector(".spotlight-titles-container");
    const introTextElement = document.querySelectorAll(".spotlight-intro-text");
    const imageElement = [];

    spotlightItems.forEach((item, index) => {
        const titleElement = document.createElement("h1");
        titleElement.textContent = item.name;
        titlesContainer.appendChild(titleElement);

        const imgWrapper = document.createElement("div");
        imgWrapper.className = "spotlight-img";
        const imgElement = images[index]; // Use preloaded image
        imgWrapper.appendChild(imgElement);
        imagesContainer.appendChild(imgWrapper);
        imageElement.push(imgWrapper);
    });

    const titleElements = titlesContainer.querySelectorAll("h1");
    let currentActiveIndex = 0;

    const config = {
        gap: 0.08,
        speed: 0.3,
        arcRadius: 500,
    };

    const containerWidth = window.innerWidth * 0.3;
    const containerHeight = window.innerHeight;
    const arcStartX = 0; // 從左側開始
    const arcStartY = -200;
    const arcEndY = containerHeight + 200;
    const arcControlPointX = arcStartX + config.arcRadius;
    const arcControlPointY = containerHeight / 2;

    function getBezierPosition(t) {
        const x =
            (1 - t) * (1 - t) * arcStartX +
            2 * (1 - t) * t * arcControlPointX +
            t * t * arcStartX;
        const y =
            (1 - t) * (1 - t) * arcStartY +
            2 * (1 - t) * t * arcControlPointY +
            t * t * arcEndY;
        return { x, y };
    }

    function getImgProgressState(index, overallProgress) {
        const startTime = index * config.gap;
        const endTime = startTime + config.speed;

        if (overallProgress < startTime) return -1;
        if (overallProgress > endTime) return 2;

        return (overallProgress - startTime) / config.speed;
    }

    imageElement.forEach((img) => gsap.set(img, { opacity: 0 }));

    ScrollTrigger.create({
        trigger: ".spotlight",
        start: "top top",
        end: `+=${window.innerHeight * 10}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
            const process = self.progress;

            if (process <= 0.2) {
                const animationProgress = process / 0.2;
                const moveDistance = window.innerWidth * 0.6;
                gsap.set(introTextElement[0], { x: -animationProgress * moveDistance });
                gsap.set(introTextElement[1], { x: animationProgress * moveDistance });
                gsap.set(introTextElement[0], { opacity: 1 - animationProgress });
                gsap.set(introTextElement[1], { opacity: 1 - animationProgress });
                gsap.set(".spotlight-bg-img", { transform: `scale(${animationProgress})` });
                gsap.set(".spotlight-bg-img img", { transform: `scale(${1.5 - animationProgress * 0.5})` });
                imageElement.forEach((img) => gsap.set(img, { opacity: 0 }));
                spotlightHeader.style.opacity = "0";
                gsap.set(titlesContainerElement, { "--before-opacity": 0, "--after-opacity": 0 });
                
                // 確保標題在開始前是完全隱藏的
                titleElements.forEach(title => {
                    title.style.opacity = "0"; 
                });
                
            } else if (process > 0.2 && process <= 0.25) {
                gsap.set(".spotlight-bg-img", { transform: "scale(1)" });
                gsap.set(".spotlight-bg-img img", { transform: "scale(1)" });
                gsap.set(introTextElement[0], { opacity: 0 });
                gsap.set(introTextElement[1], { opacity: 0 });
                imageElement.forEach((img) => gsap.set(img, { opacity: 0 }));
                
                // 🚀 修正: 在此區間讓斜線和所有標題同時出現
                spotlightHeader.style.opacity = "1";
                gsap.set(titlesContainerElement, { "--before-opacity": 1, "--after-opacity": 1 });
                
                titleElements.forEach(title => {
                    title.style.opacity = "0.5"; // 非活躍狀態
                });
                titleElements[0].style.opacity = "1"; // 預設第一個為活躍狀態
                currentActiveIndex = 0;
                
            } else if (process > 0.25 && process <= 0.95) {
                gsap.set(".spotlight-bg-img", { transform: "scale(1)" });
                gsap.set(".spotlight-bg-img img", { transform: "scale(1)" });
                gsap.set(introTextElement[0], { opacity: 0 });
                gsap.set(introTextElement[1], { opacity: 0 });
                spotlightHeader.style.opacity = "1";
                gsap.set(titlesContainerElement, { "--before-opacity": 1, "--after-opacity": 1 });

                const switchProgress = (process - 0.25) / 0.7;
                const viewportHeight = window.innerHeight;
                const titlesContainerHeight = titlesContainer.scrollHeight;
                const startPosition = viewportHeight;
                const targetPosition = -titlesContainerHeight;
                const totalDistance = startPosition - targetPosition;
                const currentY = startPosition - switchProgress * totalDistance;
                gsap.set(".spotlight-titles", { transform: `translateY(${currentY}px)` });

                imageElement.forEach((img, index) => {
                    const imageProgress = getImgProgressState(index, switchProgress);
                    if (imageProgress < 0 || imageProgress > 1) {
                        gsap.set(img, { opacity: 0 });
                    } else {
                        const pos = getBezierPosition(imageProgress);
                        gsap.set(img, { x: pos.x, y: pos.y - 75, opacity: 1 });
                    }
                });

                const ViewportMiddle = viewportHeight / 2;
                let closestIndex = 0;
                let closestDistance = Infinity;
                titleElements.forEach((title, index) => {
                    const titleRect = title.getBoundingClientRect();
                    const titleCenterY = titleRect.top + titleRect.height / 2;
                    const distanceFromCenter = Math.abs(titleCenterY - ViewportMiddle);
                    if (distanceFromCenter < closestDistance) {
                        closestDistance = distanceFromCenter;
                        closestIndex = index;
                    }
                });
                // 這裡保持不變，因為它們會瞬間切換
                if (closestIndex !== currentActiveIndex) {
                    if (titleElements[currentActiveIndex]) {
                        titleElements[currentActiveIndex].style.opacity = "0.5";
                    }
                    titleElements[closestIndex].style.opacity = "1";
                    currentActiveIndex = closestIndex;
                }
            } else if (process > 0.95) {
                spotlightHeader.style.opacity = "0";
                gsap.set(titlesContainerElement, { "--before-opacity": 0, "--after-opacity": 0 });
                
                // 🚀 修正: 在此區間讓所有標題瞬間隱藏
                titleElements.forEach(title => {
                    title.style.opacity = "0"; 
                });
            }
        },
    });

    ScrollTrigger.refresh();
}

const onLoad = () => {
    imagesToLoad--;
    if (!imagesToLoad) {
        console.log('All images loaded or failed');
        setupScrollTrigger();
    }
};

/* 在 outro 中生成所有星球縮圖（會包含你提供的那些圖片） */
function populateOutroWithThumbnails() {
    const outro = document.querySelector('.outro');
    if (!outro) return;

    // 只建立 gallery 容器
    outro.innerHTML = `
        <div class="planet-gallery" aria-label="Planet gallery"></div>
    `;
    const gallery = outro.querySelector('.planet-gallery');

    spotlightItems.forEach((item, index) => {
        const link = document.createElement('a');
        link.className = 'planet-thumb';
        link.href = `#planet-${index}`;
        link.setAttribute('aria-label', item.name);

        // 更新結構：加入簡介文字 (div.planet-info)
        link.innerHTML = `
            <figure>
                <img src="${item.img}" alt="${item.name}">
                <figcaption>${item.name}</figcaption>
            </figure>
            <div class="planet-info">
                <p>${item.description}</p>
            </div>
        `;
        gallery.appendChild(link);
    });
}

// --- 新增的按鈕元素 ---
const createBackButton = (lenisInstance) => {
    const btn = document.createElement('a');
    btn.href = "index.html"; // 您的目標首頁
    btn.className = 'back-to-earth-btn';
    btn.innerHTML = `
        <span class="text">BACK TO EARTH</span>
        <span class="icon" aria-hidden="true">🌐</span>
    `;
    document.body.appendChild(btn);

    // 點擊時平滑回到頂部 (同時導向 index.html)
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (lenisInstance) {
            // 使用 Lenis 進行平滑捲動
            lenisInstance.scrollTo(0, { duration: 1.5, easing: (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 });
        } else {
            // 使用原生平滑捲動
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // 延遲導航，讓平滑滾動完成
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500); 
    });
    
    return btn;
};

// --- 顯示/隱藏邏輯 ---
const handleBackToEarthButton = (lenisInstance) => {
    const btn = document.querySelector('.back-to-earth-btn');
    if (!btn) return;

    // 距離底部 1.5 個視窗高度時顯示
    const threshold = document.documentElement.scrollHeight - window.innerHeight * 1.5; 

    // 獲取當前捲動位置
    const currentScroll = lenisInstance ? lenisInstance.scroll : (window.scrollY || document.documentElement.scrollTop);

    if (currentScroll > threshold) {
        // 顯示按鈕 (透過 CSS .show 類名控制)
        btn.classList.add('show');
    } else {
        // 隱藏按鈕
        btn.classList.remove('show');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Lenis fallback
    let lenisInstance;
    if (typeof Lenis !== 'undefined') {
        lenisInstance = new Lenis();
        lenisInstance.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenisInstance.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    } else {
        console.error('Lenis is not defined. Falling back to native scrolling.');
        window.addEventListener('scroll', ScrollTrigger.update);
    }

    // Preload images
    for (let i = 0; i < spotlightItems.length; i++) {
        const img = new Image();
        img.onload = onLoad;
        img.onerror = () => {
            console.error('Failed to load image:', spotlightItems[i].img);
            onLoad();
        };
        img.src = spotlightItems[i].img;
        images.push(img);
    }

    populateOutroWithThumbnails();
    
    // 1. 🚀 修正：在 DOMContentLoaded 內創建按鈕，並傳遞 Lenis 實例
    createBackButton(lenisInstance);
    
    // 2. 🚀 修正：監聽捲動事件，並傳遞 Lenis 實例
    const scrollHandler = () => handleBackToEarthButton(lenisInstance);
    
    if (typeof Lenis !== 'undefined' && lenisInstance) {
        lenisInstance.on('scroll', scrollHandler);
    } else {
        window.addEventListener('scroll', scrollHandler);
    }
    
    // 立即執行一次，檢查初始位置
    scrollHandler(); 
});