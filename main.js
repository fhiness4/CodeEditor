document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  const htmlEditor = document.getElementById('html-editor');
  const cssEditor = document.getElementById('css-editor');
  const jsEditor = document.getElementById('js-editor');
  const preview = document.getElementById('preview');
  const runBtn = document.getElementById('run-btn');
  const formatBtn = document.getElementById('format-btn');
  const tabs = document.querySelectorAll('.tab');
  const editorContainers = document.querySelectorAll('.editor-container');
  const editorLabels = document.querySelectorAll('.editor-label');
  const resizer = document.getElementById('resizer');
  
  // Current active tab
  let activeTab = 'html';
  
  // Switch tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      activeTab = tabName;
      
      // Show corresponding editor and label
      editorContainers.forEach((container, index) => {
        if (index === getTabIndex(tabName)) {
          container.style.display = 'block';
          editorLabels[index].style.display = 'flex';
        } else {
          container.style.display = 'none';
          editorLabels[index].style.display = 'none';
        }
      });
    });
  });
  
  function getTabIndex(tabName) {
    switch (tabName) {
      case 'html':
        return 0;
      case 'css':
        return 1;
      case 'js':
        return 2;
      default:
        return 0;
    }
  }
  
  // Run code
  function runCode() {
    const htmlCode = htmlEditor.value;
    const cssCode = cssEditor.value;
    const jsCode = jsEditor.value;
    
    const previewDocument = preview.contentDocument || preview.contentWindow.document;
    
    previewDocument.open();
    previewDocument.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>${cssCode}</style>
                    </head>
                    <body>
                        ${htmlCode}
                        <script>${jsCode}<\/script>
                    </body>
                    </html>
                `);
    previewDocument.close();
  }
  
  // Format code (basic implementation)
  function formatCode() {
    if (activeTab === 'html') {
      htmlEditor.value = formatHTML(htmlEditor.value);
    } else if (activeTab === 'css') {
      cssEditor.value = formatCSS(cssEditor.value);
    } else if (activeTab === 'js') {
      jsEditor.value = formatJS(jsEditor.value);
    }
  }
  
  // Basic formatters
  function formatHTML(code) {
    // Simple HTML formatting (in a real app, use a library like js-beautify)
    return code
      .replace(/</g, '\n<')
      .replace(/>/g, '>\n')
      .replace(/\n\n/g, '\n')
      .trim();
  }
  
  function formatCSS(code) {
    // Simple CSS formatting
    return code
      .replace(/{/g, ' {\n  ')
      .replace(/;/g, ';\n  ')
      .replace(/}/g, '\n}\n')
      .replace(/\s+}/g, '\n}');
  }
  
  function formatJS(code) {
    // Simple JS formatting
    return code
      .replace(/;/g, ';\n')
      .replace(/{/g, ' {\n')
      .replace(/}/g, '\n}\n')
      .replace(/\n\n/g, '\n');
  }
  
  // Resize panels (only for desktop)
  if (window.innerWidth > 768) {
    resizer.addEventListener('mousedown', function(e) {
      e.preventDefault();
      
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
      
      function resize(e) {
        const container = document.querySelector('.container');
        const editorPanel = document.querySelector('.editor-panel');
        const previewPanel = document.querySelector('.preview-panel');
        
        const containerRect = container.getBoundingClientRect();
        const x = e.clientX - containerRect.left;
        
        const editorWidth = (x / containerRect.width) * 100;
        const previewWidth = 100 - editorWidth;
        
        editorPanel.style.width = `${editorWidth}%`;
        previewPanel.style.width = `${previewWidth}%`;
      }
      
      function stopResize() {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
      }
    });
  }
  
  // Event listeners
  runBtn.addEventListener('click', runCode);
  formatBtn.addEventListener('click', formatCode);
  
  // Auto-run on changes with debounce
  let timeout;
  
  function scheduleRun() {
    clearTimeout(timeout);
    timeout = setTimeout(runCode, 800);
  }
  
  htmlEditor.addEventListener('input', scheduleRun);
  cssEditor.addEventListener('input', scheduleRun);
  jsEditor.addEventListener('input', scheduleRun);
  
  // Initial run
  runCode();
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
      // Mobile layout - ensure full width
      document.querySelector('.editor-panel').style.width = '100%';
      document.querySelector('.preview-panel').style.width = '100%';
    } else {
      // Desktop layout - reset to 50% each
      document.querySelector('.editor-panel').style.width = '50%';
      document.querySelector('.preview-panel').style.width = '50%';
    }
  });
  
});