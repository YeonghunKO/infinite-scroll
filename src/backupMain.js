import { request } from './utils/api.js';
import {
  postTemplate,
  addClass,
  removeClass,
  highLightedTemplate,
} from './utils/template.js';

import { isChanged } from './utils/compare.js';

let LIMIT = 5;
let PAGE = 1;
let isSearching = false;
const allPostsStorage = [];
const chosenPosts = [];

const $main = document.querySelector('.main');
const $loader = document.querySelector('.loader');
const $filter = document.querySelector('.filter');
const $noPosts = document.querySelector('.no-posts');
const $refreshBtn = document.querySelector('.fa-redo-alt');

function highLightWord($postEle, postEleId, highlightedPosts) {
  // changedPost에 의해 title , body 선별적으로 변경

  highlightedPosts.forEach(highLightpost => {
    if (highLightpost.id === parseInt(postEleId)) {
      const originalPostTitle = $postEle.querySelector('.post-title');
      const orginalPostBody = $postEle.querySelector('.post-body');

      // title , body 둘중에 하이라이트 된것만 rendering 됨.
      if (isChanged(originalPostTitle, highLightpost.title)) {
        originalPostTitle.innerHTML = highLightpost.title;
      }

      if (isChanged(orginalPostBody, highLightpost.body)) {
        orginalPostBody.innerHTML = highLightpost.body;
      }
    }
  });
}

function showChosenPosts(selectedPosts) {
  addClass($noPosts, 'invisible');
  const allPostsElementsArr = document.querySelectorAll('.post-container');
  const selectedPostIds = selectedPosts.map(post => post.id);

  allPostsElementsArr.forEach($postEle => {
    const { id } = $postEle.dataset;
    if (selectedPostIds.includes(Number(id))) {
      removeClass($postEle, 'invisible');
      highLightWord($postEle, id, selectedPosts);
    } else {
      addClass($postEle, 'invisible');
    }
  });
  if (!selectedPosts.length) {
    removeClass($noPosts, 'invisible');
  }
}

function searchWords(word) {
  const selectedPosts = [];
  console.log('word: ', word);
  if (word === '') {
    isSearching = false;
    return selectedPosts;
  }
  // e.preventDefault();
  isSearching = true;
  allPostsStorage.forEach(post => {
    const { title, body } = post;
    if (title.search(word) >= 0 || body.search(word) >= 0) {
      selectedPosts.push(post);
    }
  });
  console.log('selectedPosts: ', selectedPosts);
  return selectedPosts;
}

function highlightPosts(word, selectedPosts) {
  if (word.length) {
    const searchWord = new RegExp(word, 'gi');
    const highlighted = selectedPosts.map(post => {
      // title, body 둘중에 뭐가 바뀌었는지 찾기.
      return {
        id: post.id,
        title: post.title.replace(searchWord, matchedWord =>
          highLightedTemplate(matchedWord)
        ),
        body: post.body.replace(searchWord, matchedWord =>
          highLightedTemplate(matchedWord)
        ),
      };
    });
    console.log('highlighted: ', highlighted);
    return highlighted;
  } else {
    return allPostsStorage;
  }
}

async function fetchData(limit, page) {
  const data = await request(limit, page);
  return data;
}

async function showPosts(limit, page) {
  const posts = await fetchData(limit, page);
  allPostsStorage.push(...posts);

  const vDOM = document.createDocumentFragment();
  posts.forEach(post => {
    const { id, title, body } = post;
    const postContainer = postTemplate(id, title, body);
    vDOM.appendChild(postContainer);
  });
  $main.append(vDOM);
}

window.addEventListener('scroll', async function (e) {
  if (!isSearching) {
    const totalHeight = document.body.offsetHeight;
    const { innerHeight, pageYOffset } = window;
    if (innerHeight + pageYOffset >= totalHeight) {
      addClass($loader, 'show');
      await showPosts(LIMIT, ++PAGE);
      removeClass($loader, 'show');
    }
  }
});

// $form.addEventListener('submit', searchWords);

$filter.addEventListener('input', function () {
  const word = this.value.trim();
  const selectedPosts = searchWords(word);
  const highlightedPosts = highlightPosts(word, selectedPosts);
  showChosenPosts(highlightedPosts);
});

$refreshBtn.addEventListener('click', () => {
  isSearching = false;
  $filter.value = '';
  showChosenPosts(allPostsStorage);
});

showPosts(LIMIT, PAGE);

// db에 value가 있으면 그걸 display, 없으면 새로 ele를 만들고 db에 저장.
// https://bitsofco.de/a-one-line-solution-to-highlighting-search-matches/
// 에 있는 방법으로 replace한뒤에 text-decoration으로 물결표시되게 해봐라
