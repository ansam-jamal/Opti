// Navbar functionality
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

// فتح/إغلاق القائمة عند النقر على الزر
mobileMenuBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // منع الانتشار لتجنب إغلاق القائمة فورًا
  navLinks.classList.toggle('active');
});

// إغلاق القائمة عند النقر خارجها
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('active') && 
      !navLinks.contains(e.target) && 
      e.target !== mobileMenuBtn) {
    navLinks.classList.remove('active');
  }
});

// منع إغلاق القائمة عند النقر داخلها
navLinks.addEventListener('click', (e) => {
  e.stopPropagation();
});

    // Navigation functionality
    const navLinksAll = document.querySelectorAll('.nav-link');

    navLinksAll.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-target');

        // Hide all sections
        document.getElementById('home').style.display = 'none';
        document.getElementById('glasses-gallery').style.display = 'none';
        document.getElementById('face-shapes-section').style.display = 'none';
        document.getElementById('about-section').style.display = 'none';
        document.getElementById('contact-section').style.display = 'none';

        // Show target section
        if (target === 'home') {
          document.getElementById('home').style.display = 'block';
        } else {
          document.getElementById(`${target}-section`).style.display = 'block';
        }

        // Close mobile menu if open
        navLinks.classList.remove('active');

        // Scroll to top
        window.scrollTo(0, 0);
      });
    });

    // Glasses data and functionality
    const glassesList = [
      { 'name': 'Aviator', 'mainImage': 'images/aviator.png', 'additionalImages': ['images/Av1.png', 'images/Av2.png'], 'url': 'https://8m927.zappar.io/8576652900376330933/1.0.6/' },
      { 'name': 'Wayfarer', 'mainImage': 'images/warfarer.png', 'additionalImages': ['images/Wa1.png', 'images/Wa2.png'], 'url': 'https://8m927.zappar.io/270444070075388133/1.0.2/' },
      { 'name': 'Browline', 'mainImage': 'images/browline.png', 'additionalImages': ['images/Br1.png', 'images/Br2.png'], 'url': 'https://8m927.zappar.io/7848710460982949928/1.0.2/' },
      { 'name': 'Geometric', 'mainImage': 'images/geometric.png', 'additionalImages': ['images/Go1.png', 'images/Go2.png'], 'url': 'https://8m927.zappar.io/6782183001895966014/1.0.3/' },
      { 'name': 'Cat Eye', 'mainImage': 'images/cateye.png', 'additionalImages': ['images/Ca1.png', 'images/Ca2.png'], 'url': 'https://8m927.zappar.io/5579294278545221962/1.0.3/' },
      { 'name': 'Rectangle', 'mainImage': 'images/rectangle.png', 'additionalImages': ['images/Re1.png', 'images/Re2.png'], 'url': 'https://8m927.zappar.io/3806282430033659633/1.0.2/' },
      { 'name': 'Square', 'mainImage': 'images/square.png', 'additionalImages': ['images/Sq1.png', 'images/Sq2.png'], 'url': 'https://8m927.zappar.io/1494221415688502733/1.0.2/' },
      { 'name': 'Round', 'mainImage': 'images/round.png', 'additionalImages': ['images/Ro1.png', 'images/Ro2.png'], 'url': 'https://8m927.zappar.io/2810764190350714028/1.0.1/' },
      { 'name': 'Oval', 'mainImage': 'images/oval.png', 'additionalImages': ['images/Ov1.png', 'images/Ov2.png'], 'url': 'https://8m927.zappar.io/6323650033745908436/1.0.2/' }
    ];

    const faceGlassesMapping = {
      'oval': glassesList,
      'heart': glassesList.filter(g => ['Cat Eye', 'Rectangle', 'Wayfarer', 'Browline', 'Oval'].includes(g.name)),
      'round': glassesList.filter(g => ['Aviator', 'Geometric', 'Rectangle', 'Square'].includes(g.name)),
      'square': glassesList.filter(g => ['Aviator', 'Wayfarer', 'Browline', 'Round', 'Oval', 'Cat Eye'].includes(g.name)),
      'oblong': glassesList.filter(g => ['Aviator', 'Wayfarer', 'Browline', 'Round', 'Oval', 'Geometric'].includes(g.name))
    };

    const faceShapeNames = {
      'oval': 'Oval Face',
      'heart': 'Heart Face',
      'round': 'Round Face',
      'square': 'Square Face',
      'oblong': 'Oblong Face'
    };

 
    function renderGlasses() {
      const container = document.getElementById('glasses-grid');
      container.innerHTML = '';
      glassesList.forEach((glasses, index) => {
        const card = document.createElement('div');
        card.className = 'glasses-card';
        let slidesHTML = `<div class="glasses-slide"><img src="${glasses.mainImage}" alt="${glasses.name}"></div>`;
        glasses.additionalImages.forEach(img => {
          slidesHTML += `<div class="glasses-slide"><img src="${img}" alt="${glasses.name}"></div>`;
        });
        card.innerHTML = `
          <div class="glasses-slider" id="slider-${index}">
            <div class="glasses-slides">${slidesHTML}</div>
            <div class="slider-arrow prev" onclick="moveSlide(${index}, -1)"><i class="fas fa-chevron-left"></i></div>
            <div class="slider-arrow next" onclick="moveSlide(${index}, 1)"><i class="fas fa-chevron-right"></i></div>
            <div class="slider-controls" id="controls-${index}"></div>
          </div>
          <div class="glasses-info">
            <h3>${glasses.name}</h3>
            <button class="glasses-btn" onclick="window.open('${glasses.url}', '_blank')">Try On</button>
          </div>
        `;
        container.appendChild(card);
        initSlider(index, glasses.additionalImages.length + 1);
      });
    }

    function renderGlassesForFaceShape(faceShape) {
      const glasses = faceGlassesMapping[faceShape];
      const container = document.getElementById('glasses-grid');
      container.innerHTML = '';
      glasses.forEach((glasses, index) => {
        const card = document.createElement('div');
        card.className = 'glasses-card';
        let slidesHTML = `<div class="glasses-slide"><img src="${glasses.mainImage}" alt="${glasses.name}"></div>`;
        glasses.additionalImages.forEach(img => {
          slidesHTML += `<div class="glasses-slide"><img src="${img}" alt="${glasses.name}"></div>`;
        });
        card.innerHTML = `
          <div class="glasses-slider" id="slider-${index}">
            <div class="glasses-slides">${slidesHTML}</div>
            <div class="slider-arrow prev" onclick="moveSlide(${index}, -1)"><i class="fas fa-chevron-left"></i></div>
            <div class="slider-arrow next" onclick="moveSlide(${index}, 1)"><i class="fas fa-chevron-right"></i></div>
            <div class="slider-controls" id="controls-${index}"></div>
          </div>
          <div class="glasses-info">
            <h3>${glasses.name}</h3>
            <button class="glasses-btn" onclick="window.open('${glasses.url}', '_blank')">Try On</button>
          </div>
        `;
        container.appendChild(card);
        initSlider(index, glasses.additionalImages.length + 1);
      });
    }

    function renderFaceShapes() {
      const container = document.getElementById('face-shapes-grid');
      container.innerHTML = '';
      const faceShapes = [
        { name: 'Heart', image: 'images/heart-face.png', type: 'heart' },
        { name: 'Oblong', image: 'images/oblong-face.png', type: 'oblong' },
        { name: 'Oval', image: 'images/oval-face.png', type: 'oval' },
        { name: 'Round', image: 'images/round-face.png', type: 'round' },
        { name: 'Square', image: 'images/square-face.png', type: 'square' }
      ];
      faceShapes.forEach(shape => {
        const card = document.createElement('div');
        card.className = 'face-shape-card';
        card.innerHTML = `
          <img src="${shape.image}" alt="${shape.name}" class="face-shape-image">
          <div class="face-shape-info">
            <h3>${shape.name}</h3>
            <button class="face-shape-btn" onclick="showGlassesForFaceShape('${shape.type}')">View Glasses</button>
          </div>
        `;
        container.appendChild(card);
      });
    }

    function showGlassesForFaceShape(faceShape) {
      document.getElementById('face-shapes-section').style.display = 'none';
      document.getElementById('glasses-gallery').style.display = 'block';
      document.getElementById('gallery-title').textContent = `${faceShapeNames[faceShape]} Glasses`;
      document.getElementById('back-to-shapes-btn').style.display = 'inline-block';
      renderGlassesForFaceShape(faceShape);
      window.scrollTo(0, 0);
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

    document.getElementById('try-glasses-btn').addEventListener('click', function () {
      document.getElementById('home').style.display = 'none';
      document.getElementById('glasses-gallery').style.display = 'block';
      document.getElementById('face-shapes-section').style.display = 'none';
      document.getElementById('gallery-title').textContent = 'All Glasses Collection';
      document.getElementById('gallery-title').style.color = 'var(--accent-color)';
      document.getElementById('back-to-shapes-btn').style.display = 'none';
      renderGlasses();
      window.scrollTo(0, 0);
    });

    document.getElementById('analyze-btn').addEventListener('click', function () {
      window.location.href = 'face-shape.html';
    });

    document.getElementById('browse-btn').addEventListener('click', function () {
      document.getElementById('home').style.display = 'none';
      document.getElementById('glasses-gallery').style.display = 'none';
      document.getElementById('face-shapes-section').style.display = 'block';
      renderFaceShapes();
      window.scrollTo(0, 0);
    });

    document.getElementById('back-to-shapes-btn').addEventListener('click', function (e) {
      e.preventDefault();
      document.getElementById('glasses-gallery').style.display = 'none';
      document.getElementById('face-shapes-section').style.display = 'block';
      window.scrollTo(0, 0);
    });

    // Initialize page based on hash
    window.addEventListener('load', function () {
      const hash = window.location.hash.substring(1); // Remove the #

      // Hide all sections first
      document.getElementById('home').style.display = 'none';
      document.getElementById('glasses-gallery').style.display = 'none';
      document.getElementById('face-shapes-section').style.display = 'none';
      document.getElementById('about-section').style.display = 'none';
      document.getElementById('contact-section').style.display = 'none';

      // Show the appropriate section
      if (hash === 'about') {
        document.getElementById('about-section').style.display = 'block';
      } else if (hash === 'contact') {
        document.getElementById('contact-section').style.display = 'block';
      } else {
        document.getElementById('home').style.display = 'block';
      }
    });

    // Make slider functions global
    window.moveSlide = moveSlide;
    window.goToSlide = goToSlide;
    window.showGlassesForFaceShape = showGlassesForFaceShape;