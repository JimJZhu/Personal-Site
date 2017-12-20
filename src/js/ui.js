$(document).ready(() => {
  // Add smooth scrolling to all links
  $('a').on('click', (event) => {
    // Make sure this.hash has a value before overriding default behavior
    if (document.hash !== '') {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      const docHash = document.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of millis it takes to scroll
      $('html, body').animate(
        {
          scrollTop: $(docHash).offset().top,
        },
        800,
        () => {
          // Add hash (#) to URL when done scrolling (default click behavior)
          window.location.hash = docHash;
        },
      );
    } // End if
  });
});

((window, document) => {
  const layout = document.getElementById('layout');
  const menu = document.getElementById('menu');
  const menuLink = document.getElementById('menuLink');
  const content = document.getElementById('main');

  function toggleClass(element, className) {
    const classes = element.className.split(/\s+/);
    const len = classes.length;
    let i = 0;

    for (; i < len; i += 1) {
      if (classes[i] === className) {
        classes.splice(i, 1);
        break;
      }
    }
    // The className is not found
    if (len === classes.length) {
      classes.push(className);
    }

    element.className = classes.join(' ');
  }

  function toggleAll(e) {
    const active = 'active';

    e.preventDefault();
    toggleClass(layout, active);
    toggleClass(menu, active);
    toggleClass(menuLink, active);
  }

  menuLink.onclick = (e) => {
    toggleAll(e);
  };

  content.onclick = (e) => {
    if (menu.className.indexOf('active') !== -1) {
      toggleAll(e);
    }
  };
})(window, window.document);
