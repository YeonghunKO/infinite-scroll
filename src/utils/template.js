const createElement = ({ type, classes, id }) => {
  const ele = document.createElement(type);
  if (classes) {
    classes.forEach(cls => {
      ele.classList.add(cls);
    });
  }

  if (id) {
    ele.setAttribute('id', id);
  }

  return ele;
};

const postTemplate = (id, title, body) => {
  const postContainer = createElement({
    type: 'div',
    classes: ['post-container'],
  });
  postContainer.setAttribute('data-id', id);
  postContainer.innerHTML = `
   <div class="post">
    <div class="number">${id}</div>
    <div class="post-info">
      <h2 class="post-title">${title}</h2>
      <p class="post-body">
       ${body}
      </p>
    </div>
   </div>    
    `;

  return postContainer;
};

const addClass = (ele, className) => {
  ele.classList.add(className);
};

const removeClass = (ele, className) => {
  ele.classList.remove(className);
};

const highLightedTemplate = matchedWord =>
  `<span id="highlighted">${matchedWord}</span>`;

export {
  createElement,
  postTemplate,
  addClass,
  removeClass,
  highLightedTemplate,
};
