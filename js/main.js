import '/js/pdf-loader.js';
import { setupPdfDownload } from './pdf-loader.js';

function findEditableElements(root) {
  return root.querySelectorAll(
    `h1, h2, h3, h4, p, span, address, .lang-list-item-name, .interests-item, .exp-item, a`
  );
}

function hasOnlyText(node) {
  const childNodes = node.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    const child = childNodes[i];
    if (
      child.nodeType !== Node.TEXT_NODE &&
      !(child.nodeType === Node.ELEMENT_NODE && child.tagName === 'BR')
    ) {
      return false;
    }
  }
  return true;
}

function assignUniqueIds(elements) {
  elements.forEach((el, index) => {
    if (!el.hasAttribute('data-edit-id')) {
      el.setAttribute('data-edit-id', `editable-${index}`);
    }
  });
}

function loadSavedValues(elements) {
  elements.forEach(el => {
    const id = el.getAttribute('data-edit-id');
    if (!id) return;
    const saved = localStorage.getItem(id);
    if (saved !== null) {
      el.textContent = saved;

      if (el.tagName.toLowerCase() === 'a') {
        if (saved.trim().length > 0) {
          el.setAttribute('href', 'mailto:' + saved.trim());
        }
      }
    }
  });
}

function makeEditable(element) {
  element.style.cursor = 'pointer';
  element.addEventListener('dblclick', function handler() {
    if (!hasOnlyText(this)) {
      return;
    }
    const oldText = this.textContent;
    const textAreaElement = document.createElement('textarea');
    textAreaElement.value = oldText.trim();

    textAreaElement.classList.add('editing');

    textAreaElement.style.resize = 'vertical';
    textAreaElement.style.width = 100 + '%';
    textAreaElement.style.height = this.offsetHeight + 10 + 'px';
    textAreaElement.style.fontSize = getComputedStyle(this).fontSize;
    textAreaElement.style.fontFamily = getComputedStyle(this).fontFamily;
    textAreaElement.style.boxSizing = 'border-box';

    this.textContent = '';
    this.appendChild(textAreaElement);
    textAreaElement.focus();
    textAreaElement.select();

    function saveElement() {
      const value = textAreaElement.value.trim();
      element.textContent = value.length > 0 ? value : oldText;

      if (element.tagName.toLowerCase() === 'a') {
        if (value.length > 0) {
          element.setAttribute('href', 'mailto:' + value);
        }
      }

      const id = element.getAttribute('data-edit-id');
      if (id) {
        localStorage.setItem(id, element.textContent);
      }

      element.addEventListener('dblclick', handler);
    }

    textAreaElement.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        saveElement();
      }
      if (e.key === 'Escape') {
        element.textContent = oldText;
        element.addEventListener('dblclick', handler);
      }
    });

    textAreaElement.addEventListener('blur', saveElement);
    this.removeEventListener('dblclick', handler);
  });
}

window.addEventListener('DOMContentLoaded', function () {
  const editableElements = findEditableElements(document);
  assignUniqueIds(editableElements);
  loadSavedValues(editableElements);
  editableElements.forEach(makeEditable);
  setupPdfDownload();
});
