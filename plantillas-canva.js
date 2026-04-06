const cats = document.querySelector('#canvaCategories');
const gallery = document.querySelector('#canvaGallery');

document.querySelectorAll('[data-scroll-cats]').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!cats) return;
    const dir = Number(btn.getAttribute('data-scroll-cats')) || 1;
    cats.scrollBy({ left: dir * 340, behavior: 'smooth' });
  });
});

document.querySelectorAll('[data-scroll-gallery]').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!gallery) return;
    const dir = Number(btn.getAttribute('data-scroll-gallery')) || 1;
    gallery.scrollBy({ left: dir * 420, behavior: 'smooth' });
  });
});
