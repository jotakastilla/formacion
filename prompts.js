const copyButtons = document.querySelectorAll('.copy-prompt');
const promptBlocks = document.querySelectorAll('.prompt-card .template-pre');

copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const index = Number(button.getAttribute('data-copy-target'));
    const target = promptBlocks[index];
    if (!target) return;

    try {
      await navigator.clipboard.writeText(target.textContent.trim());
      const original = button.textContent;
      button.textContent = 'Copiado';
      setTimeout(() => {
        button.textContent = original;
      }, 1200);
    } catch {
      alert('No se pudo copiar automáticamente. Copia el texto manualmente.');
    }
  });
});
