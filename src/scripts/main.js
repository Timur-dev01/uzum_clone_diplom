import { renderAllProducts } from '../components/Card.js';

const bannerCarousel = (selector, interval = 2000) => {
  const container = document.querySelector(selector);
  const slidesContainer = container.querySelector('.banner-carousel__slides');
  const slides = slidesContainer.querySelectorAll('img');
  const prevBtn = container.querySelector('.banner-carousel__btn--prev');
  const nextBtn = container.querySelector('.banner-carousel__btn--next');
  const dotsContainer = container.querySelector('.banner-carousel__dots');
  let currentIndex = 0;
  let dots = [];
  let autoSlide;

  const update = () => {
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  };

  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    update();
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    update();
  };

  const goToSlide = index => {
    currentIndex = index;
    update();
  };

  const createDots = () => {
    slides.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
  };

  const startAutoSlide = () => {
    autoSlide = setInterval(nextSlide, interval);
  };

  const stopAutoSlide = () => {
    clearInterval(autoSlide);
  };

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  container.addEventListener('mouseenter', stopAutoSlide);
  container.addEventListener('mouseleave', startAutoSlide);

  createDots();
  update();
  startAutoSlide();
};

bannerCarousel('.banner-carousel', 2500);

renderAllProducts();


const scrollUpBtn = document.querySelector('.for_up');
window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    scrollUpBtn.style.display = 'flex';
  } else {
    scrollUpBtn.style.display = 'none';
  }
});
scrollUpBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
