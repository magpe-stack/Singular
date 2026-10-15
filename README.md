# Singular - Removedor de Duplicados PWA

**Singular** é um Progressive Web App (PWA) minimalista, rápido e privativo para remoção de itens duplicados em texto simples, listas CSV e arquivos JSON. Trabalha inteiramente no cliente (navegador), sem enviar dados para servidores externos.

---

## 📱 O que é um PWA?
Um **PWA (Progressive Web App)** é uma aplicação web construída com tecnologias padrão (HTML, CSS, JS), mas que oferece uma experiência muito similar à de um aplicativo nativo. 
- **Funciona offline** graças ao cache do Service Worker.
- Pode ser **instalado diretamente** na tela inicial do celular ou no desktop sem passar por lojas de aplicativos.
- Rápido, leve e com atualização instantânea.

---

## 🚀 Como usar o site

1. **Entrada de Dados:** Cole o texto diretamente no painel esquerdo ou clique no botão de upload (ícone de pasta/bandeja) para carregar arquivos `.txt`, `.csv` ou `.json`.
2. **Escolha do Modo:**
   - **Linhas:** Remove linhas repetidas.
   - **Palavras:** Remove palavras duplicadas no texto.
   - **CSV:** Trata e remove entradas repetidas por linha em arquivos CSV.
   - **JSON:** Processa arrays JSON e elimina objetos ou valores repetidos.
3. **Copiar Resultado:** Clique no botão principal com o ícone da mãozinha para copiar a lista única para a área de transferência.
4. **Botoes Adicionais (Ícones):**
   - **Limpar (Lixeira):** Limpa as caixas de entrada e memória.
   - **Salvar Offline (Disquete):** Salva o texto atual no armazenamento local do seu navegador para não perder ao fechar a aba.
   - **Exportar (Download):** Baixa o resultado deduplicado como arquivo `.txt`, `.csv` ou `.json`.

---

## 💻 Como instalar no PC (Windows, macOS, Linux)

### Via Google Chrome / Microsoft Edge / Brave:
1. Acesse o site no navegador.
2. Na barra de endereço (à direita), clique no ícone de **Instalar Singular** (ou um símbolo de `+` / computador).
3. Confirme clicando em **Instalar**.
4. O Singular agora aparecerá na sua lista de aplicativos do sistema e na área de trabalho.

---

## 📱 Como instalar no Celular

### No Android (Google Chrome):
1. Acesse o site no Chrome.
2. Toque no menu de três pontos no canto superior direito.
3. Toque em **Adicionar à tela inicial** (ou **Instalar aplicativo**).

### No iOS / iPhone (Safari):
1. Acesse o site no Safari.
2. Toque no botão **Compartilhar** (quadrado com seta apontando para cima).
3. Role para baixo e selecione **Adicionar à Tela de Início**.

---

## 🛠️ Como executar localmente

Como o PWA utiliza Service Workers, ele requer um servidor HTTP local para funcionar corretamente (o protocolo `file://` bloqueia Service Workers por segurança).

1. Abra a pasta do projeto no terminal ou VS Code.
2. Execute um servidor local simples, por exemplo:
   - **Com Python 3:**
     ```bash
     python -m http.server 8000
     ```
   - **Com Node.js (npx http-server):**
     ```bash
     npx http-server . -p 8000
     ```
3. Acesse `http://localhost:8000` no seu navegador.
