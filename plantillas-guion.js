const runBtn = document.querySelector('#runAssistant');
const scriptInput = document.querySelector('#scriptInput');
const targetMinutesInput = document.querySelector('#targetMinutes');
const scriptTypeSelect = document.querySelector('#scriptType');
const resultBox = document.querySelector('#assistantResult');
const summaryList = document.querySelector('#assistantSummary');
const fixesList = document.querySelector('#assistantFixes');
const fxList = document.querySelector('#assistantFx');

function fillList(node, items) {
  node.innerHTML = '';
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    node.appendChild(li);
  });
}

function splitSentences(text) {
  return text
    .split(/[.!?]\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function suggestFx(type, text) {
  const t = text.toLowerCase();
  const suggestions = [];

  if (type === 'entrevista') {
    suggestions.push('Añade sintonía corta (2-3s) al inicio y salida suave para cambios de bloque.');
    suggestions.push('Inserta un golpe sonoro breve antes de preguntas clave para marcar ritmo.');
  }
  if (type === 'marca') {
    suggestions.push('Usa firma sonora de marca al inicio/cierre para reforzar identidad.');
    suggestions.push('Aplica música de fondo muy ligera en bloque de historia o caso real.');
  }
  if (type === 'solo') {
    suggestions.push('Introduce stingers sutiles entre secciones para evitar bloque plano.');
  }

  if (t.includes('historia') || t.includes('caso')) {
    suggestions.push('Refuerza el bloque narrativo con ambiente suave y limpieza de silencios.');
  }
  if (t.includes('cta') || t.includes('reserva') || t.includes('compra')) {
    suggestions.push('Antes del CTA, baja música y deja voz limpia para máxima claridad.');
  }

  if (!suggestions.length) {
    suggestions.push('Aplica una intro breve, cortes limpios y cierre musical de 4-6 segundos.');
  }
  return suggestions;
}

if (runBtn && scriptInput && targetMinutesInput && scriptTypeSelect && resultBox) {
  runBtn.addEventListener('click', () => {
    const text = scriptInput.value.trim();
    const targetMinutes = Number(targetMinutesInput.value || 0);
    const type = scriptTypeSelect.value;

    if (!text) {
      alert('Pega primero tu guion para activar el ayudante.');
      return;
    }

    const words = text.split(/\s+/).filter(Boolean).length;
    const estimated = Math.max(1, Math.round((words / 150) * 10) / 10);
    const recommendedMinWords = targetMinutes > 0 ? targetMinutes * 150 : null;
    const recommendedMaxWords = targetMinutes > 0 ? targetMinutes * 180 : null;
    const sentences = splitSentences(text);
    const longSentences = sentences.filter((s) => s.split(/\s+/).length > 28).length;
    const hasColdOpen = /cold open|gancho|hook/i.test(text);
    const hasIntro = /intro|apertura|bienvenid/i.test(text);
    const hasOutro = /cierre|resumen|conclusi/i.test(text);
    const hasTransition = /transici|pasamos|siguiente bloque/i.test(text);
    const hasCTA = /cta|llamada a la acci|suscr|comparte|reserva/i.test(text);
    const hasCues = /\[(music|sfx|pause|timestamp)/i.test(text);

    const summary = [
      `Palabras detectadas: ${words}`,
      `Duración estimada de locución: ${estimated} minutos`,
      targetMinutes > 0
        ? `Objetivo marcado: ${targetMinutes} min (${estimated > targetMinutes ? 'por encima' : 'dentro o por debajo'} del objetivo)`
        : 'No hay objetivo de duración definido'
    ];
    if (recommendedMinWords && recommendedMaxWords) {
      summary.push(`Rango recomendado para ${targetMinutes} min: ${recommendedMinWords}-${recommendedMaxWords} palabras.`);
    }

    const fixes = [];
    if (longSentences > 0) {
      fixes.push(`Hay ${longSentences} frases largas. Recomendación: dividir frases para mejorar ritmo y respiración.`);
    } else {
      fixes.push('Ritmo de frase correcto: no se detectan bloques excesivamente largos.');
    }
    if (!hasColdOpen) {
      fixes.push('Añade un cold open o gancho de 30-60 segundos para atrapar desde el inicio.');
    }
    if (!hasIntro) {
      fixes.push('Añade una apertura clara (quién eres, para quién es el episodio y qué se van a llevar).');
    }
    if (!hasTransition) {
      fixes.push('Incluye transiciones entre bloques para evitar saltos bruscos y mantener ritmo.');
    }
    if (!hasOutro) {
      fixes.push('Incluye cierre con resumen de ideas y llamada a la acción final.');
    }
    if (!hasCTA) {
      fixes.push('Falta CTA explícito: indica acción concreta al oyente al final.');
    }
    if (!hasCues) {
      fixes.push('Añade cues técnicos: [MUSIC], [SFX], [PAUSE], [TIMESTAMP] para facilitar producción.');
    }
    if (!/pregunta|entrevista/i.test(text) && type === 'entrevista') {
      fixes.push('Para formato entrevista: prepara 3 preguntas de contexto, 3 de profundidad y 1 de cierre.');
    }
    if (fixes.length < 3) {
      fixes.push('Revisa muletillas y repeticiones para dejar un mensaje más directo y profesional.');
    }

    const fx = suggestFx(type, text);

    fillList(summaryList, summary);
    fillList(fixesList, fixes);
    fillList(fxList, fx);
    resultBox.hidden = false;
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
