document.addEventListener('DOMContentLoaded', () => {
  const progressBar = document.getElementById('progressBar');
  const sections = document.querySelectorAll('section');
  const body = document.body;
  const orbitPath = document.getElementById('orbitPath');
  const orbitActive = document.getElementById('orbitActive');
  const orionMarker = document.getElementById('orionMarker');
  const timelineSteps = document.querySelectorAll('.timeline-step');

  let pathLength = 0;
  if (orbitActive) {
    pathLength = orbitActive.getTotalLength();
    orbitActive.style.strokeDasharray = pathLength;
    orbitActive.style.strokeDashoffset = pathLength;
  }

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;

    if (progressBar) {
      progressBar.style.width = `${scrollPercent * 100}%`;
    }

    let currentSectionId = 'hero';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 200;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSectionId = section.id;
      }
    });
    body.setAttribute('data-section', currentSectionId);

    const parallaxEl = document.querySelector('.parallax');
    if (parallaxEl) {
      const speed = parseFloat(parallaxEl.getAttribute('data-speed')) || 0.1;
      parallaxEl.style.transform = `translateY(${scrollTop * speed}px)`;
    }

    updateTrajectoryAnimation();
  });

  function updateTrajectoryAnimation() {
    const timelineSection = document.getElementById('timeline');
    if (!timelineSection || !orbitActive || !orionMarker) return;

    const rect = timelineSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    let progress = (windowHeight - rect.top) / (rect.height + windowHeight / 2);
    progress = Math.max(0, Math.min(1, progress));

    const drawLength = pathLength * progress;
    orbitActive.style.strokeDashoffset = pathLength - drawLength;

    if (pathLength > 0) {
      const point = orbitActive.getPointAtLength(drawLength);
      orionMarker.setAttribute('cx', point.x);
      orionMarker.setAttribute('cy', point.y);
    }

    timelineSteps.forEach((step) => {
      const stepProgress = parseFloat(step.getAttribute('data-progress'));
      if (progress >= stepProgress - 0.1) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  let animatedNumbers = false;

  const numbersObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animatedNumbers) {
          animatedNumbers = true;
          animateStatNumbers();
        }
      });
    },
    { threshold: 0.4 }
  );

  const numbersSection = document.getElementById('numbers');
  if (numbersSection) {
    numbersObserver.observe(numbersSection);
  }

  function animateStatNumbers() {
    const numElements = document.querySelectorAll('.big-num');

    numElements.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 2000;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }

        if (isDecimal) {
          el.textContent = current.toFixed(1);
        } else {
          el.textContent = Math.floor(current).toLocaleString('en-US');
        }
      }, stepTime);
    });
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.section-heading, .editorial-label').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
  });
});