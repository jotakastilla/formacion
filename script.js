const revealItems = document.querySelectorAll('.reveal');
let scrollLockDepth = 0;
let scrollLockY = 0;

const lockPageScroll = () => {
  if (scrollLockDepth === 0) {
    scrollLockY = window.scrollY || window.pageYOffset || 0;
    document.body.classList.add('is-scroll-locked');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollLockY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }
  scrollLockDepth += 1;
};

const unlockPageScroll = () => {
  if (scrollLockDepth === 0) return;
  scrollLockDepth -= 1;
  if (scrollLockDepth === 0) {
    document.body.classList.remove('is-scroll-locked');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollLockY);
  }
};

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 45, 280)}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const carousel = document.querySelector('.studio-carousel');
if (carousel) {
  const slides = carousel.querySelectorAll('.carousel-slide');
  const dots = carousel.querySelectorAll('.dot');
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');
  let current = 0;
  let timer;
  let touchStartX = 0;
  let touchEndX = 0;

  const setSlide = (index) => {
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    current = index;
  };

  const next = () => setSlide((current + 1) % slides.length);
  const prev = () => setSlide((current - 1 + slides.length) % slides.length);

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  if (slides.length > 1) {
    timer = setInterval(next, 4200);
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', () => {
      timer = setInterval(next, 4200);
    });

    carousel.addEventListener(
      'touchstart',
      (event) => {
        touchStartX = event.changedTouches[0]?.clientX || 0;
      },
      { passive: true }
    );

    carousel.addEventListener(
      'touchend',
      (event) => {
        touchEndX = event.changedTouches[0]?.clientX || 0;
        const delta = touchEndX - touchStartX;
        if (Math.abs(delta) < 36) return;
        if (delta < 0) next();
        if (delta > 0) prev();
      },
      { passive: true }
    );
  }
}

const bonusModal = document.querySelector('#bonusModal');
const openBonusBtn = document.querySelector('[data-open-bonus]');
if (bonusModal && openBonusBtn) {
  const closeBonusItems = bonusModal.querySelectorAll('[data-close-bonus]');

  const openModal = () => {
    bonusModal.hidden = false;
    lockPageScroll();
  };

  const closeModal = () => {
    bonusModal.hidden = true;
    unlockPageScroll();
  };

  openBonusBtn.addEventListener('click', openModal);
  document.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('[data-open-bonus]')) {
      openModal();
    }
  });
  closeBonusItems.forEach((item) => item.addEventListener('click', closeModal));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !bonusModal.hidden) {
      closeModal();
    }
  });
}

const studioModal = document.querySelector('#studioModal');
if (studioModal) {
  const closeStudioItems = studioModal.querySelectorAll('[data-close-studio]');
  const prevStudioBtn = studioModal.querySelector('[data-studio-prev]');
  const nextStudioBtn = studioModal.querySelector('[data-studio-next]');
  const studioImage = studioModal.querySelector('#studioGalleryImage');
  const studioThumbs = studioModal.querySelectorAll('.studio-thumb');
  const studioPhotos = [
    {
      src: 'assets/studio-5.png',
      alt: 'Set de grabación en sofá en Local Reset Studios'
    },
    {
      src: 'assets/studio-2.png',
      alt: 'Zona de entrevista del estudio profesional'
    },
    {
      src: 'assets/studio-4.jpg',
      alt: 'Producción de videopodcast con dos participantes'
    },
    {
      src: 'assets/studio-1.jpg',
      alt: 'Estación de trabajo y control de audio en el estudio'
    },
    {
      src: 'assets/studio-3.jpg',
      alt: 'Configuración de iluminación y set de grabación'
    }
  ];
  let studioCurrent = 0;
  let studioTouchStartX = 0;
  let studioTouchEndX = 0;

  const updateStudioImage = (index) => {
    studioCurrent = (index + studioPhotos.length) % studioPhotos.length;
    const photo = studioPhotos[studioCurrent];
    if (studioImage) {
      studioImage.src = photo.src;
      studioImage.alt = photo.alt;
    }
    studioThumbs.forEach((thumb, thumbIndex) => {
      thumb.classList.toggle('is-active', thumbIndex === studioCurrent);
    });
  };

  const openStudioModal = () => {
    studioModal.hidden = false;
    lockPageScroll();
    updateStudioImage(studioCurrent);
  };

  const closeStudioModal = () => {
    studioModal.hidden = true;
    unlockPageScroll();
  };

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest('[data-open-studio-gallery]');
    if (!trigger) return;
    event.preventDefault();
    openStudioModal();
  });

  closeStudioItems.forEach((item) => item.addEventListener('click', closeStudioModal));

  if (prevStudioBtn) {
    prevStudioBtn.addEventListener('click', () => updateStudioImage(studioCurrent - 1));
  }

  if (nextStudioBtn) {
    nextStudioBtn.addEventListener('click', () => updateStudioImage(studioCurrent + 1));
  }

  studioThumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const index = Number(thumb.dataset.studioIndex || 0);
      updateStudioImage(index);
    });
  });

  if (studioImage) {
    studioImage.addEventListener(
      'touchstart',
      (event) => {
        studioTouchStartX = event.changedTouches[0]?.clientX || 0;
      },
      { passive: true }
    );

    studioImage.addEventListener(
      'touchend',
      (event) => {
        studioTouchEndX = event.changedTouches[0]?.clientX || 0;
        const delta = studioTouchEndX - studioTouchStartX;
        if (Math.abs(delta) < 36) return;
        if (delta < 0) updateStudioImage(studioCurrent + 1);
        if (delta > 0) updateStudioImage(studioCurrent - 1);
      },
      { passive: true }
    );
  }

  document.addEventListener('keydown', (event) => {
    if (studioModal.hidden) return;
    if (event.key === 'Escape') closeStudioModal();
    if (event.key === 'ArrowRight') updateStudioImage(studioCurrent + 1);
    if (event.key === 'ArrowLeft') updateStudioImage(studioCurrent - 1);
  });
}

const chatWidget = document.querySelector('#quickChat');
if (chatWidget) {
  const chatLaunch = chatWidget.querySelector('.chat-launch');
  const chatPanel = chatWidget.querySelector('.chat-panel');
  const chatClose = chatWidget.querySelector('.chat-close');
  const chatMessages = chatWidget.querySelector('#chatMessages');
  const chatForm = chatWidget.querySelector('#chatForm');
  const chatInput = chatWidget.querySelector('#chatInput');
  const quickButtons = chatWidget.querySelectorAll('[data-chat-prompt]');
  let chatInitialized = Boolean(chatMessages && chatMessages.children.length);

  const addMessage = (text, role = 'bot') => {
    if (!chatMessages) return;
    const bubble = document.createElement('p');
    bubble.className = `chat-bubble chat-bubble--${role}`;
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const getBotReply = (message) => {
    const text = message.toLowerCase();
    const isBeginner = /principiante|empiezo|empezando|sin experiencia|novato/.test(text);
    const isPro = /profesional|experiencia|ya tengo|ya hago|avanzado/.test(text);
    const joinCta = 'Si te encaja, te recomiendo reservar plaza desde el registro.';

    if (/hola|buenas|hello|hey/.test(text)) {
      return '¡Hola! Te ayudo con dudas de la formación de podcast, radio y videopodcast: precio, fechas, contenido, estudio, episodio piloto o reserva.';
    }

    if (/precio|cuesta|coste|invers|pagar|pago/.test(text)) {
      if (/dos|2|plazos|fraccion/.test(text)) {
        return `El precio actual es 490 €. Sobre pago en dos veces, lo revisamos contigo al solicitar información. ${joinCta}`;
      }
      return `El precio de lanzamiento es 490 € e incluye 12 horas, prácticas reales, estudio profesional, episodio piloto y materiales para podcast, radio y videopodcast. ${joinCta}`;
    }

    if (/plaza|plazas|cupo|aforo/.test(text)) {
      return 'Actualmente trabajamos con plazas limitadas y grupo reducido para asegurar parte práctica. Ahora mismo se muestran 10 plazas en la landing.';
    }

    if (/fecha|fechas|fin de semana|abril|mayo|junio|cuando/.test(text)) {
      return `Organizamos fines de semana entre abril y mayo (y también estamos abriendo junio en la web). Puedes indicar tu preferencia en el registro (sábado + domingo). ${joinCta}`;
    }

    if (/stream|online|remoto|distancia|youtube/.test(text)) {
      return 'Sí, hay opción en streaming para personas registradas, con seguimiento en directo y realización multicámara.';
    }

    if (/donde|dónde|ubicaci|estudio|direccion|dirección/.test(text)) {
      return 'La formación se realiza en Local Reset Studios. En la sección "¿Dónde lo haremos?" tienes acceso directo al mapa.';
    }

    if (/programa|temario|contenido|aprende|aprender|que incluye|qué incluye|curso/.test(text)) {
      if (isBeginner) {
        return `No necesitas experiencia previa. Te llevamos paso a paso en idea, guion, comunicación, grabación, edición y publicación para podcast, radio y formato digital. ${joinCta}`;
      }
      if (isPro) {
        return `Si ya tienes experiencia, te ayudará a subir nivel en realización multicámara, flujo de producción, IA aplicada a radio y calidad final de publicación. ${joinCta}`;
      }
      return `Es una formación intensiva de 12 horas (sábado + domingo): estrategia, guion, grabación real, edición, adaptación a videopodcast y crecimiento. ${joinCta}`;
    }

    if (/piloto|episodio|graba|grabaci[oó]n/.test(text)) {
      return 'El episodio piloto está incluido, pero no se graba durante el fin de semana del curso: se agenda después según disponibilidad del estudio (hasta 1 hora, solo o con invitado).';
    }

    if (/equipo|c[aá]mara|micro|material|llevar/.test(text)) {
      return 'No necesitas traer equipo. El estudio dispone de cámaras 4K, microfonía profesional, iluminación y realización multicámara.';
    }

    if (/quien|quién|imparte|jonathan/.test(text)) {
      return 'Imparte Jonathan Castilla, diseñador sonoro y productor con más de 20 años de experiencia en radio y podcasting profesional.';
    }

    if (/reserv|inscrip|apuntar|matric|registro/.test(text)) {
      return `Para reservar plaza solo tienes que completar el registro y te contactamos para cierre y fechas. ${joinCta}`;
    }

    return 'Ahora mismo solo puedo ayudarte con información de la formación (precio, fechas, programa, estudio, episodio piloto o reserva) para podcast, radio y videopodcast.';
  };

  const openChat = () => {
    if (!chatPanel || !chatLaunch) return;
    chatPanel.hidden = false;
    chatLaunch.setAttribute('aria-expanded', 'true');
    if (!chatInitialized) {
      addMessage('¡Hola! Soy el asistente automático. Te ayudo con dudas rápidas sobre la formación.');
      chatInitialized = true;
    }
    if (chatInput) chatInput.focus();
  };

  const closeChat = () => {
    if (!chatPanel || !chatLaunch) return;
    chatPanel.hidden = true;
    chatLaunch.setAttribute('aria-expanded', 'false');
  };

  const sendUserMessage = (value) => {
    const message = value.trim();
    if (!message) return;
    addMessage(message, 'user');
    const reply = getBotReply(message);
    window.setTimeout(() => addMessage(reply, 'bot'), 320);
  };

  if (chatLaunch) {
    chatLaunch.addEventListener('click', () => {
      if (chatPanel && !chatPanel.hidden) closeChat();
      else openChat();
    });
  }

  if (chatClose) {
    chatClose.addEventListener('click', closeChat);
  }

  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (event) => {
      event.preventDefault();
      sendUserMessage(chatInput.value);
      chatInput.value = '';
    });
  }

  quickButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const prompt = button.getAttribute('data-chat-prompt') || '';
      sendUserMessage(prompt);
    });
  });
}
