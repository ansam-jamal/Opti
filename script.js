// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const desktopNavbar = document.getElementById('desktop-navbar');
const mobileHeader = document.getElementById('mobile-header');

let isMenuOpen = false;

// فتح/إغلاق القائمة
mobileMenuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    isMenuOpen = false;
  } else {
    mobileMenu.classList.add('open');
    isMenuOpen = true;
  }
});

document.addEventListener('click', (e) => {
  if (isMenuOpen && !mobileMenu.contains(e.target) && e.target !== mobileMenuBtn) {
    mobileMenu.classList.remove('open');
    isMenuOpen = false;
  }
});

// منع إغلاق القائمة عند النقر داخلها
mobileMenu.addEventListener('click', (e) => {
  e.stopPropagation();
});

// إغلاق القائمة عند النقر على رابط
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = this.getAttribute('data-target');

    // إغلاق القائمة
    mobileMenu.classList.remove('open');
    isMenuOpen = false;

    // التوجيه
    if (target === 'home') {
      window.location.href = 'index.html';
    } else if (target === 'about') {
      window.location.href = 'index.html#about';
    } else if (target === 'contact') {
      window.location.href = 'index.html#contact';
    }
  });
});

// إغلاق القائمة تلقائيًا عند توسيع الشاشة
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    mobileMenu.classList.remove('open');
    isMenuOpen = false;
  }
});

// منع إغلاق القائمة عند النقر داخلها
mobileMenu.addEventListener('click', (e) => {
  e.stopPropagation();
});

// إغلاق القائمة عند النقر خارجها
document.addEventListener('click', (e) => {
  if (isMenuOpen && !mobileHeader.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
    isMenuOpen = false;
  }
});

// --- Face Shape Analysis Script ---
const video = document.getElementById('video');
const loadingContainer = document.getElementById('loadingContainer');
const progressCircle = document.getElementById('progressCircle');
const faceShapeResult = document.getElementById('faceShapeResult');
const resultsSection = document.getElementById('resultsSection');
const faceShapeTitle = document.getElementById('faceShapeTitle');
const recommendationText = document.getElementById('recommendationText');
const glassesGrid = document.getElementById('glassesGrid');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const welcomeModal = document.getElementById('welcomeModal');
const welcomeGender = document.getElementById('welcomeGender');
const welcomeAge = document.getElementById('welcomeAge');
const startAppBtn = document.getElementById('startAppBtn');

let ws = null;
let currentSessionId = null;
let detectedFaceShape = null;
let userGender = '';
let userAge = '';
let isProcessing = false;

const faceGlassesMapping = {
  'oval': [
    { 'name': 'Aviator', 'mainImage': 'images/aviator.png', 'additionalImages': ['images/Av1.png', 'images/Av2.png'], 'url': 'https://8m927.zappar.io/8576652900376330933/1.0.6/' },
    { 'name': 'Wayfarer', 'mainImage': 'images/warfarer.png', 'additionalImages': ['images/Wa1.png', 'images/Wa2.png'], 'url': 'https://8m927.zappar.io/270444070075388133/1.0.2/' },
    { 'name': 'Browline', 'mainImage': 'images/browline.png', 'additionalImages': ['images/Br1.png', 'images/Br2.png'], 'url': 'https://8m927.zappar.io/7848710460982949928/1.0.2/' },
    { 'name': 'Geometric', 'mainImage': 'images/geometric.png', 'additionalImages': ['images/Go1.png', 'images/Go2.png'], 'url': 'https://8m927.zappar.io/6782183001895966014/1.0.3/' },
    { 'name': 'Cat Eye', 'mainImage': 'images/cateye.png', 'additionalImages': ['images/Ca1.png', 'images/Ca2.png'], 'url': 'https://8m927.zappar.io/5579294278545221962/1.0.3/' },
    { 'name': 'Rectangle', 'mainImage': 'images/rectangle.png', 'additionalImages': ['images/Re1.png', 'images/Re2.png'], 'url': 'https://8m927.zappar.io/3806282430033659633/1.0.2/' },
    { 'name': 'Square', 'mainImage': 'images/square.png', 'additionalImages': ['images/Sq1.png', 'images/Sq2.png'], 'url': 'https://8m927.zappar.io/1494221415688502733/1.0.2/' },
    { 'name': 'Round', 'mainImage': 'images/round.png', 'additionalImages': ['images/Ro1.png', 'images/Ro2.png'], 'url': 'https://8m927.zappar.io/2810764190350714028/1.0.1/' },
    { 'name': 'Oval', 'mainImage': 'images/oval.png', 'additionalImages': ['images/Ov1.png', 'images/Ov2.png'], 'url': 'https://8m927.zappar.io/6323650033745908436/1.0.2/' }
  ],
  'heart': [
    { 'name': 'Cat Eye', 'mainImage': 'images/cateye.png', 'additionalImages': ['images/Ca1.png', 'images/Ca2.png'], 'url': 'https://8m927.zappar.io/5579294278545221962/1.0.3/' },
    { 'name': 'Rectangle', 'mainImage': 'images/rectangle.png', 'additionalImages': ['images/Re1.png', 'images/Re2.png'], 'url': 'https://8m927.zappar.io/3806282430033659633/1.0.2/' },
    { 'name': 'Wayfarer', 'mainImage': 'images/warfarer.png', 'additionalImages': ['images/Wa1.png', 'images/Wa2.png'], 'url': 'https://8m927.zappar.io/270444070075388133/1.0.2/' },
    { 'name': 'Browline', 'mainImage': 'images/browline.png', 'additionalImages': ['images/Br1.png', 'images/Br2.png'], 'url': 'https://8m927.zappar.io/7848710460982949928/1.0.2/' },
    { 'name': 'Oval', 'mainImage': 'images/oval.png', 'additionalImages': ['images/Ov1.png', 'images/Ov2.png'], 'url': 'https://8m927.zappar.io/6323650033745908436/1.0.2/' }
  ],
  'round': [
    { 'name': 'Aviator', 'mainImage': 'images/aviator.png', 'additionalImages': ['images/Av1.png', 'images/Av2.png'], 'url': 'https://8m927.zappar.io/8576652900376330933/1.0.6/' },
    { 'name': 'Geometric', 'mainImage': 'images/geometric.png', 'additionalImages': ['images/Go1.png', 'images/Go2.png'], 'url': 'https://8m927.zappar.io/6782183001895966014/1.0.3/' },
    { 'name': 'Rectangle', 'mainImage': 'images/rectangle.png', 'additionalImages': ['images/Re1.png', 'images/Re2.png'], 'url': 'https://8m927.zappar.io/3806282430033659633/1.0.2/' },
    { 'name': 'Square', 'mainImage': 'images/square.png', 'additionalImages': ['images/Sq1.png', 'images/Sq2.png'], 'url': 'https://8m927.zappar.io/1494221415688502733/1.0.2/' }
  ],
  'square': [
    { 'name': 'Aviator', 'mainImage': 'images/aviator.png', 'additionalImages': ['images/Av1.png', 'images/Av2.png'], 'url': 'https://8m927.zappar.io/8576652900376330933/1.0.6/' },
    { 'name': 'Wayfarer', 'mainImage': 'images/warfarer.png', 'additionalImages': ['images/Wa1.png', 'images/Wa2.png'], 'url': 'https://8m927.zappar.io/270444070075388133/1.0.2/' },
    { 'name': 'Browline', 'mainImage': 'images/browline.png', 'additionalImages': ['images/Br1.png', 'images/Br2.png'], 'url': 'https://8m927.zappar.io/7848710460982949928/1.0.2/' },
    { 'name': 'Round', 'mainImage': 'images/round.png', 'additionalImages': ['images/Ro1.png', 'images/Ro2.png'], 'url': 'https://8m927.zappar.io/2810764190350714028/1.0.1/' },
    { 'name': 'Oval', 'mainImage': 'images/oval.png', 'additionalImages': ['images/Ov1.png', 'images/Ov2.png'], 'url': 'https://8m927.zappar.io/6323650033745908436/1.0.2/' },
    { 'name': 'Cat Eye', 'mainImage': 'images/cateye.png', 'additionalImages': ['images/Ca1.png', 'images/Ca2.png'], 'url': 'https://8m927.zappar.io/5579294278545221962/1.0.3/' }
  ],
  'oblong': [
    { 'name': 'Aviator', 'mainImage': 'images/aviator.png', 'additionalImages': ['images/Av1.png', 'images/Av2.png'], 'url': 'https://8m927.zappar.io/8576652900376330933/1.0.6/' },
    { 'name': 'Wayfarer', 'mainImage': 'images/warfarer.png', 'additionalImages': ['images/Wa1.png', 'images/Wa2.png'], 'url': 'https://8m927.zappar.io/270444070075388133/1.0.2/' },
    { 'name': 'Browline', 'mainImage': 'images/browline.png', 'additionalImages': ['images/Br1.png', 'images/Br2.png'], 'url': 'https://8m927.zappar.io/7848710460982949928/1.0.2/' },
    { 'name': 'Round', 'mainImage': 'images/round.png', 'additionalImages': ['images/Ro1.png', 'images/Ro2.png'], 'url': 'https://8m927.zappar.io/2810764190350714028/1.0.1/' },
    { 'name': 'Oval', 'mainImage': 'images/oval.png', 'additionalImages': ['images/Ov1.png', 'images/Ov2.png'], 'url': 'https://8m927.zappar.io/6323650033745908436/1.0.2/' },
    { 'name': 'Geometric', 'mainImage': 'images/geometric.png', 'additionalImages': ['images/Go1.png', 'images/Go2.png'], 'url': 'https://8m927.zappar.io/6782183001895966014/1.0.3/' }
  ],
};

const faceShapeNames = {
  'oval': 'Oval Face',
  'heart': 'Heart Face',
  'round': 'Round Face',
  'square': 'Square Face',
  'oblong': 'Oblong Face'
};

async function initCamera() {
  try {
    const constraints = {
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
  } catch (err) {
    alert("Unable to access camera: " + err.message);
  }
}

function captureImage() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.9);
  });
}

// WebSocket Functions
function connectWebSocket() {
  return new Promise((resolve, reject) => {
    ws = new WebSocket('wss://face-shape-dn2q.onrender.com/ws/classify');

    ws.onopen = () => {
      console.log('WebSocket connected');
      resolve();
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      reject(error);
    };

    ws.onclose = (event) => {
      console.log('WebSocket disconnected, attempting to reconnect...');
      setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };
  });
}

async function sendImagesViaWebSocket(images) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    await connectWebSocket();
  }

  // إنشاء معرف جلسة جديد إذا لم يكن موجودًا
  currentSessionId = currentSessionId || generateSessionId();

  // إرسال البيانات الأولية
  ws.send(JSON.stringify({
    gender: userGender,
    age: userAge,
    session_id: currentSessionId
  }));

  // إرسال الصور واحدة تلو الأخرى
  for (const imageBlob of images) {
    const arrayBuffer = await imageBlob.arrayBuffer();
    ws.send(arrayBuffer);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // انتظار الرد من الخادم
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve(null);
    }, 10000); // مهلة 10 ثواني

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.success && data.face_shape) {
          clearTimeout(timeout);
          resolve(data);
        } else if (data.error) {
          clearTimeout(timeout);
          console.error('Server error:', data.error);
          resolve(null);
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };
  });
}

function generateSessionId() {
  return 'session_' + Math.random().toString(36).substr(2, 9);
}

// HTTP Fallback Function
async function _sendBatchImagesToServer(images) {
  const url = 'https://face-shape-dn2q.onrender.com/ws/classify';
  const formData = new FormData();

  images.forEach((imageBlob, index) => {
    formData.append('files', imageBlob, `face_${index}.jpg`);
  });

  formData.append('session_id', currentSessionId);
  formData.append('gender', userGender);
  formData.append('age', userAge);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    if (response.ok) {
      const responseBody = await response.json();
      return responseBody;
    } else {
      throw new Error(`Failed with status: ${response.status}`);
    }
  } catch (e) {
    throw new Error(`Error sending request: ${e.message}`);
  }
}

async function startCapture() {
  if (isProcessing) return;
  isProcessing = true;

  if (!userGender || !userAge) {
    alert("Please complete the welcome form first.");
    isProcessing = false;
    return;
  }

  // إعادة تعيين العناصر
  startBtn.style.display = 'none'; // إخفاء زر البداية أثناء المعالجة
  resultsSection.style.display = 'none';
  faceShapeResult.style.opacity = '0';
  faceShapeResult.innerText = '';

  // بدء الرسوم المتحركة
  loadingContainer.style.display = 'flex';
  startInfiniteAnimation();

  try {
    // التقاط الصور
    const images = await Promise.all(
      Array(5).fill().map(async () => {
        const blob = await captureImage();
        return blob;
      })
    );

    // إرسال الصور للتحليل
    let result = null;
    try {
      result = await sendImagesViaWebSocket(images);
    } catch (err) {
      console.error("WebSocket error, falling back to HTTP:", err);
      result = await _sendBatchImagesToServer(images);
    }

    // معالجة النتيجة
    if (!result || !result.face_shape) {
      throw new Error("Classification failed");
    }

    detectedFaceShape = result.face_shape.toLowerCase();
    faceShapeResult.innerText = faceShapeNames[detectedFaceShape];
    faceShapeResult.style.opacity = '1';

    // عرض النتائج
    resultsSection.style.display = 'block';
    faceShapeTitle.innerHTML = faceShapeNames[detectedFaceShape];
    recommendationText.innerHTML = "We've selected glasses that will perfectly complement your face shape.";
    renderGlassesForFaceShape(detectedFaceShape);
    startBtn.style.display = 'block'; // إظهار زر البداية بدلاً من restart

  } catch (error) {
    console.error("Error during classification:", error);
    faceShapeResult.innerText = "Detection Failed";
    faceShapeResult.style.opacity = '1';
    resultsSection.style.display = 'block';
    faceShapeTitle.innerHTML = "Classification Failed";
    recommendationText.innerHTML = "Please try again with better lighting and positioning.";
    startBtn.style.display = 'block'; // إظهار زر البداية في حالة الخطأ
  } finally {
    // إيقاف الرسوم المتحركة بعد ظهور النتيجة أو الخطأ
    stopInfiniteAnimation();
    loadingContainer.style.display = 'none';
    isProcessing = false;
    window.scrollTo(0, 0);
  }
}


function startInfiniteAnimation() {
  const container = document.querySelector('.circular-progress');
  container.style.background = `
    conic-gradient(
      from 0deg,
      var(--accent-color) 0deg,
      var(--accent-color) 180deg,
      transparent 180deg,
      transparent 360deg
    )
  `;
  container.style.animation = 'rotate 1.5s linear infinite';
  progressCircle.innerText = '';
}

function stopInfiniteAnimation() {
  const container = document.querySelector('.circular-progress');
  container.style.animation = 'none';
}

function renderGlassesForFaceShape(faceShape) {
  const glasses = faceGlassesMapping[faceShape];
  glassesGrid.innerHTML = '';
  glasses.forEach((glasses, index) => {
    const card = document.createElement('div');
    card.className = 'glasses-card';
    let slidesHTML = `
      <div class="glasses-slide">
        <img src="${glasses.mainImage}" alt="${glasses.name}">
      </div>
    `;
    glasses.additionalImages.forEach(img => {
      slidesHTML += `
        <div class="glasses-slide">
          <img src="${img}" alt="${glasses.name}">
        </div>
      `;
    });
    card.innerHTML = `
      <div class="glasses-slider" id="slider-${index}">
        <div class="glasses-slides">
          ${slidesHTML}
        </div>
        <div class="slider-arrow prev" onclick="moveSlide(${index}, -1)">
          <i class="fas fa-chevron-left"></i>
        </div>
        <div class="slider-arrow next" onclick="moveSlide(${index}, 1)">
          <i class="fas fa-chevron-right"></i>
        </div>
        <div class="slider-controls" id="controls-${index}">
        </div>
      </div>
      <div class="glasses-info">
        <h3>${glasses.name}</h3>
        <button class="glasses-btn" onclick="window.open('${glasses.url}', '_blank')">Try On</button>
      </div>
    `;
    glassesGrid.appendChild(card);
    initSlider(index, glasses.additionalImages.length + 1);
  });
}

function initSlider(index, totalSlides) {
  const controls = document.getElementById(`controls-${index}`);
  controls.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
    dot.setAttribute('data-index', i);
    dot.onclick = () => goToSlide(index, i);
    controls.appendChild(dot);
  }
}

function moveSlide(index, direction) {
  const slider = document.getElementById(`slider-${index}`);
  const slides = slider.querySelector('.glasses-slides');
  const totalSlides = slides.children.length;
  let currentIndex = parseInt(slider.getAttribute('data-current') || 0);
  currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
  updateSlider(index, currentIndex);
}

function goToSlide(index, slideIndex) {
  updateSlider(index, slideIndex);
}

function updateSlider(index, slideIndex) {
  const slider = document.getElementById(`slider-${index}`);
  const slides = slider.querySelector('.glasses-slides');
  const dots = slider.querySelectorAll('.slider-dot');
  slides.style.transform = `translateX(-${slideIndex * 100}%)`;
  slider.setAttribute('data-current', slideIndex);
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === slideIndex);
  });
}

function validateForm() {
  let isValid = true;
  const genderError = document.getElementById('genderError');
  const ageError = document.getElementById('ageError');
  genderError.style.display = 'none';
  ageError.style.display = 'none';
  welcomeGender.classList.remove('input-error');
  welcomeAge.classList.remove('input-error');

  if (!welcomeGender.value) {
    genderError.style.display = 'block';
    welcomeGender.classList.add('input-error');
    isValid = false;
  }
  if (!welcomeAge.value) {
    ageError.style.display = 'block';
    welcomeAge.classList.add('input-error');
    isValid = false;
  }
  return isValid;
}

function startApp() {
  if (!validateForm()) {
    return;
  }
  userGender = welcomeGender.value;
  userAge = welcomeAge.value;
  welcomeModal.style.display = 'none';
  initCamera();
}

function restartClassification() {
  // إخفاء النتائج
  resultsSection.style.display = 'none';

  // إظهار مؤشر التحميل
  loadingContainer.style.display = 'flex';
  startInfiniteAnimation();

  // إعادة تعيين النتيجة
  faceShapeResult.style.opacity = '0';
  faceShapeResult.innerText = '';

  // إعادة تعيين المتغيرات
  isProcessing = false;
  detectedFaceShape = null;

  // بدء التحليل الجديد
  setTimeout(() => {
    startCapture();
  }, 1);

  // التمرير لأعلى الصفحة
  window.scrollTo(0, 0);
}

// إغلاق اتصال WebSocket عند مغادرة الصفحة
window.addEventListener('beforeunload', () => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
});

window.onload = () => {
  welcomeModal.style.display = 'flex';
  startAppBtn.addEventListener('click', startApp);
  restartBtn.addEventListener('click', restartClassification);
  welcomeAge.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      startApp();
    }
  });
};

// جعل الدوال متاحة عالميًا للاستدعاء من HTML
window.moveSlide = moveSlide;
window.goToSlide = goToSlide;
window.restartClassification = restartClassification;