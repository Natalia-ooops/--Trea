// 卡片数据 - 正念鼓励语句（小红书风格）
const quotes = [
    "接纳不完美的自己才是最大的自由啊",
    "愿你的心灵如花般绽放，无惧风雨",
    "生活不会辜负每一份努力和坚持",
    "温柔对待自己，是治愈的开始",
    "阳光落在身上，愿你也成为光",
    "每一次呼吸都是与自己和解的机会",
    "放慢脚步，感受当下的美好",
    "你的价值不需要任何人的认可",
    "内心的平静是最珍贵的财富",
    "做自己的太阳，无需依靠别人的光",
    "生活总有起伏，保持平静的心",
    "愿你被这个世界温柔以待",
    "每一天都是新的开始，充满可能",
    "学会爱自己，是最长情的告白",
    "心若向阳，无谓悲伤"
];

// 卡片标题
const titles = [
    "心灵治愈",
    "阳光心态",
    "内心平静",
    "自我接纳",
    "生活感悟",
    "温柔时光",
    "心灵花园",
    "阳光正念",
    "内心对话",
    "自我疗愈"
];

// 初始化卡片容器
const cardsContainer = document.getElementById('cardsContainer');

// 卡片数量
const CARD_COUNT = 5;

// 卡片消失的阈值距离（像素）
const DISAPPEAR_THRESHOLD = 100;

// 存储所有卡片元素
let cards = [];

// 拖拽相关变量
let isDragging = false;
let startY = 0;
let currentY = 0;
let currentCard = null;
let cardIndex = 0;

// 初始化函数
async function initCards() {
    // 清空容器
    cardsContainer.innerHTML = '';
    cards = [];
    
    // 创建初始卡片
    for (let i = 0; i < CARD_COUNT; i++) {
        await createCard();
    }
    
    // 添加事件监听
    addEventListeners();
}

// 创建单个卡片
async function createCard() {
    // 创建卡片元素
    const card = document.createElement('div');
    card.className = 'card';
    
    // 使用可靠的图片源替代Unsplash
    // 使用Picsum Photos作为替代，它提供可靠的随机图片服务
    const imageUrl = `https://picsum.photos/400/300?random=${Math.random()}`;
    
    // 创建卡片内容
    const randomTitleIndex = Math.floor(Math.random() * titles.length);
    const randomQuoteIndex = Math.floor(Math.random() * quotes.length);
    
    // 设置卡片HTML内容
    card.innerHTML = `
        <img class="card-image" src="${imageUrl}" alt="风景图片">
        <div class="card-shadow"></div>
        <div class="card-content">
            <h2 class="card-title">${titles[randomTitleIndex]}</h2>
            <p class="card-quote">${quotes[randomQuoteIndex]}</p>
            <a href="#" class="card-button">$ Invest in Future</a>
        </div>
    `;
    
    // 将卡片添加到容器
    cardsContainer.appendChild(card);
    cards.push(card);
    
    // 等待图片加载完成后提取颜色
    const img = card.querySelector('.card-image');
    img.onload = () => {
        extractColorAndApplyShadow(img, card);
    };
    
    // 添加图片加载错误处理
    img.onerror = () => {
        console.error('图片加载失败');
        // 设置默认背景色
        card.style.backgroundColor = '#f0f0f0';
        // 添加默认阴影
        const shadow = card.querySelector('.card-shadow');
        if (shadow) {
            shadow.style.background = 'rgba(0, 0, 0, 0.1)';
        }
        // 添加默认按钮
        const cardContent = card.querySelector('.card-content');
        const button = document.createElement('a');
        button.className = 'card-button';
        button.href = '#';
        button.textContent = '查看更多';
        button.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        cardContent.appendChild(button);
    };
    
    return card;
}

// 从图片中提取主色调并应用到卡片阴影
function extractColorAndApplyShadow(img, card) {
    try {
        // 创建Canvas来分析图片颜色
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1;
        canvas.height = 1;
        
        // 绘制图片到Canvas并获取像素数据
        ctx.drawImage(img, 0, 0, 1, 1);
        const pixelData = ctx.getImageData(0, 0, 1, 1).data;
        
        // 提取RGB值
        const r = pixelData[0];
        const g = pixelData[1];
        const b = pixelData[2];
        
        // 应用颜色到卡片阴影
        const shadow = card.querySelector('.card-shadow');
        shadow.style.background = `rgba(${r}, ${g}, ${b}, 0.3)`;
        
        // 为卡片添加微妙的边框颜色
        card.style.boxShadow = `0 10px 30px rgba(${r}, ${g}, ${b}, 0.3)`;
        
        // 调整按钮颜色
        const cardContent = card.querySelector('.card-content');
        const button = document.createElement('a');
        button.className = 'card-button';
        button.href = '#';
        button.textContent = '查看更多';
        button.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.2)`;
        cardContent.appendChild(button);
    } catch (error) {
        console.error('提取颜色失败:', error);
    }
}

// 添加事件监听器
function addEventListeners() {
    // 只为顶部卡片添加拖拽事件
    if (cards.length > 0) {
        const topCard = cards[0];
        
        // 鼠标事件
        topCard.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        
        // 触摸事件（移动设备）
        topCard.addEventListener('touchstart', startDrag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', endDrag);
    }
}

// 开始拖拽
function startDrag(e) {
    if (cards.length === 0) return;
    
    isDragging = true;
    currentCard = cards[0];
    currentCard.classList.add('dragging');
    
    // 获取起始Y坐标
    startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    currentY = startY;
    
    // 阻止默认行为（防止文本选择等）
    e.preventDefault();
}

// 拖拽中
function drag(e) {
    if (!isDragging || !currentCard) return;
    
    // 获取当前Y坐标
    const y = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    const deltaY = y - startY;
    
    // 更新当前Y坐标
    currentY = y;
    
    // 限制只能向下拖动
    if (deltaY > 0) {
        // 应用变换
        currentCard.style.transform = `translateY(${deltaY}px)`;
        
        // 根据拖动距离调整透明度
        const opacity = 1 - Math.min(deltaY / DISAPPEAR_THRESHOLD, 0.5);
        currentCard.style.opacity = opacity;
        
        // 调整阴影
        const shadow = currentCard.querySelector('.card-shadow');
        if (shadow) {
            shadow.style.transform = `translateY(${deltaY * 0.5}px) scale(${1 + deltaY * 0.003})`;
            shadow.style.opacity = Math.max(0, 0.3 - deltaY * 0.002);
        }
        
        // 调整其他卡片的位置
        updateOtherCardsPosition(deltaY);
    }
    
    // 阻止默认行为
    e.preventDefault();
}

// 结束拖拽
function endDrag(e) {
    if (!isDragging || !currentCard) return;
    
    isDragging = false;
    
    // 计算拖动距离
    const deltaY = currentY - startY;
    
    // 如果拖动距离超过阈值，则移除卡片
    if (deltaY > DISAPPEAR_THRESHOLD) {
        removeTopCard();
    } else {
        // 否则恢复卡片位置
        resetCardPosition();
    }
    
    // 移除拖动类
    currentCard.classList.remove('dragging');
    currentCard = null;
    
    // 阻止默认行为
    if (e) e.preventDefault();
}

// 更新其他卡片的位置
function updateOtherCardsPosition(deltaY) {
    // 计算移动比例（0-1之间）
    const moveRatio = Math.min(deltaY / DISAPPEAR_THRESHOLD, 1);
    
    // 更新其他卡片的位置
    for (let i = 1; i < cards.length; i++) {
        const card = cards[i];
        const baseTransform = getBaseTransform(i);
        const targetTransform = getBaseTransform(i - 1);
        
        // 计算当前应该的变换
        const currentTranslateY = baseTransform.translateY + (targetTransform.translateY - baseTransform.translateY) * moveRatio;
        const currentScale = baseTransform.scale + (targetTransform.scale - baseTransform.scale) * moveRatio;
        const currentOpacity = baseTransform.opacity + (targetTransform.opacity - baseTransform.opacity) * moveRatio;
        
        // 应用变换
        card.style.transform = `translateY(${currentTranslateY}px) scale(${currentScale})`;
        card.style.opacity = currentOpacity;
        card.style.zIndex = 5 - i;
    }
}

// 获取卡片基础变换
function getBaseTransform(index) {
    switch (index) {
        case 0:
            return { translateY: 0, scale: 1, opacity: 1 };
        case 1:
            return { translateY: 15, scale: 0.95, opacity: 0.9 };
        case 2:
            return { translateY: 30, scale: 0.9, opacity: 0.8 };
        case 3:
            return { translateY: 45, scale: 0.85, opacity: 0.7 };
        case 4:
            return { translateY: 60, scale: 0.8, opacity: 0.6 };
        default:
            return { translateY: 60, scale: 0.8, opacity: 0.6 };
    }
}

// 重置卡片位置
function resetCardPosition() {
    if (!currentCard) return;
    
    // 移除内联样式，恢复CSS类控制的样式
    currentCard.style.transform = '';
    currentCard.style.opacity = '';
    
    // 重置阴影
    const shadow = currentCard.querySelector('.card-shadow');
    if (shadow) {
        shadow.style.transform = '';
        shadow.style.opacity = '';
    }
    
    // 重置其他卡片
    for (let i = 1; i < cards.length; i++) {
        const card = cards[i];
        card.style.transform = '';
        card.style.opacity = '';
    }
}

// 移除顶部卡片并添加新卡片
async function removeTopCard() {
    if (cards.length === 0) return;
    
    // 获取顶部卡片
    const topCard = cards[0];
    
    // 添加消失动画类
    topCard.classList.add('disappearing');
    
    // 从数组中移除
    cards.shift();
    
    // 创建新卡片并添加到末尾
    await createCard();
    
    // 延迟后从DOM中移除顶部卡片
    setTimeout(() => {
        topCard.remove();
        
        // 重新添加事件监听器
        addEventListeners();
    }, 500);
}

// 初始化
window.addEventListener('DOMContentLoaded', initCards);