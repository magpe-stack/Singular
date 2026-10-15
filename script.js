// Registra o Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').catch((err) => {
    console.error('Falha ao registrar SW:', err);
  });
}

// Elementos do DOM
const htmlElement = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const modeRadios = document.querySelectorAll('input[name="mode"]');
const fileInput = document.getElementById('file-input');
const btnClear = document.getElementById('btn-clear');
const btnCopy = document.getElementById('btn-copy');
const btnSaveOffline = document.getElementById('btn-save-offline');
const btnExport = document.getElementById('btn-export');
const statsBar = document.getElementById('stats');

// Ícones SVG do tema
const sunIcon = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;

// Alternância de Tema Claro / Escuro
function setTheme(theme) {
  htmlElement.setAttribute('data-theme', theme);
  localStorage.setItem('singular_theme', theme);
  themeIcon.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
}

const savedTheme = localStorage.getItem('singular_theme') || 'dark';
setTheme(savedTheme);

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Lógica de Deduplicação
function processDeduplication() {
  const raw = inputText.value;
  if (!raw.trim()) {
    outputText.value = '';
    updateStats(0, 0);
    return;
  }

  const selectedMode = document.querySelector('input[name="mode"]:checked').value;
  let uniqueItems = [];
  let totalCount = 0;

  try {
    if (selectedMode === 'lines') {
      const lines = raw.split(/\r?\n/);
      totalCount = lines.length;
      uniqueItems = [...new Set(lines)];
      outputText.value = uniqueItems.join('\n');
    } else if (selectedMode === 'words') {
      const words = raw.match(/\S+/g) || [];
      totalCount = words.length;
      uniqueItems = [...new Set(words)];
      outputText.value = uniqueItems.join(' ');
    } else if (selectedMode === 'csv') {
      const lines = raw.split(/\r?\n/);
      totalCount = lines.length;
      uniqueItems = [...new Set(lines.map(l => l.trim()))];
      outputText.value = uniqueItems.join('\n');
    } else if (selectedMode === 'json') {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        totalCount = parsed.length;
        const stringified = parsed.map(item => typeof item === 'object' ? JSON.stringify(item) : item);
        const uniqueSet = [...new Set(stringified)];
        const restored = uniqueSet.map(item => {
          try { return JSON.parse(item); } catch { return item; }
        });
        outputText.value = JSON.stringify(restored, null, 2);
        uniqueItems = restored;
      } else {
        outputText.value = 'Erro: O JSON deve conter um Array no nível raiz.';
        updateStats(0, 0);
        return;
      }
    }
    updateStats(totalCount, uniqueItems.length);
  } catch (err) {
    outputText.value = 'Erro ao processar dados. Verifique a sintaxe inserida.';
    updateStats(0, 0);
  }
}

function updateStats(total, unique) {
  const removed = total - unique;
  statsBar.innerText = `Entrada: ${total} | Únicos: ${unique} | Removidos: ${removed}`;
}

// Event Listeners
inputText.addEventListener('input', processDeduplication);
modeRadios.forEach(radio => radio.addEventListener('change', processDeduplication));

// Leitura de Arquivo
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    inputText.value = evt.target.result;
    if (file.name.endsWith('.json')) {
      document.querySelector('input[value="json"]').checked = true;
    } else if (file.name.endsWith('.csv')) {
      document.querySelector('input[value="csv"]').checked = true;
    }
    processDeduplication();
  };
  reader.readAsText(file);
});

// Botão Limpar
btnClear.addEventListener('click', () => {
  inputText.value = '';
  outputText.value = '';
  updateStats(0, 0);
  localStorage.removeItem('singular_saved_data');
});

// Botão Copiar (Mãozinha)
btnCopy.addEventListener('click', () => {
  if (!outputText.value) return;
  navigator.clipboard.writeText(outputText.value).then(() => {
    btnCopy.style.transform = 'scale(1.2)';
    setTimeout(() => btnCopy.style.transform = 'scale(1)', 200);
  });
});

// Botão Salvar Offline (LocalStorage)
btnSaveOffline.addEventListener('click', () => {
  localStorage.setItem('singular_saved_data', inputText.value);
  btnSaveOffline.style.transform = 'scale(1.1)';
  setTimeout(() => btnSaveOffline.style.transform = 'scale(1)', 200);
});

// Restaurar Dados Offline
window.addEventListener('DOMContentLoaded', () => {
  const savedData = localStorage.getItem('singular_saved_data');
  if (savedData) {
    inputText.value = savedData;
    processDeduplication();
  }
});

// Botão Exportar Arquivo
btnExport.addEventListener('click', () => {
  if (!outputText.value) return;
  const selectedMode = document.querySelector('input[name="mode"]:checked').value;
  const ext = selectedMode === 'json' ? 'json' : selectedMode === 'csv' ? 'csv' : 'txt';
  
  const blob = new Blob([outputText.value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `singular-resultado.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
});
