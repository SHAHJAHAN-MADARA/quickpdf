/* Shared UI helpers used across QuickPDF pages */
(function () {
  // Mobile nav toggle
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        links.classList.toggle('open');
      });
    }

    // Year in footer
    var y = document.querySelector('[data-year]');
    if (y) y.textContent = new Date().getFullYear();
  });

  window.QP = window.QP || {};

  QP.toast = function (msg, isErr) {
    var t = document.createElement('div');
    t.className = 'toast' + (isErr ? ' err' : '');
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { t.remove(); }, 300);
    }, 3200);
  };

  QP.fmtBytes = function (b) {
    if (!b && b !== 0) return '';
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    if (b < 1073741824) return (b / 1048576).toFixed(1) + ' MB';
    return (b / 1073741824).toFixed(2) + ' GB';
  };

  QP.download = function (blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { a.remove(); URL.revokeObjectURL(url); }, 100);
  };

  // Dropzone factory
  QP.dropzone = function (el, opts) {
    opts = opts || {};
    var accept = opts.accept || '';
    var multiple = opts.multiple !== false;
    var onFiles = opts.onFiles || function () {};

    var input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = multiple;
    input.style.display = 'none';
    el.appendChild(input);

    el.addEventListener('click', function (e) {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
      input.click();
    });
    input.addEventListener('change', function () {
      if (input.files && input.files.length) {
        onFiles(Array.from(input.files));
        input.value = '';
      }
    });
    ['dragenter', 'dragover'].forEach(function (ev) {
      el.addEventListener(ev, function (e) { e.preventDefault(); el.classList.add('drag'); });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      el.addEventListener(ev, function (e) { e.preventDefault(); el.classList.remove('drag'); });
    });
    el.addEventListener('drop', function (e) {
      var files = Array.from(e.dataTransfer.files || []);
      if (accept) {
        files = files.filter(function (f) {
          if (accept.includes('pdf')) return f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
          if (accept.includes('image')) return f.type.startsWith('image/');
          return true;
        });
      }
      if (files.length) onFiles(files);
    });
  };
})();
