import { $main, $noPosts } from '../utils/doms.js';

import {
  postTemplate,
  addClass,
  removeClass,
  highLightedTemplate,
} from '../utils/template.js';

import { isChanged } from '../utils/compare.js';

import { RENDER_TYPE, POST_SHOW_CLASS } from '../utils/constants.js';

export default function Posts({ $target, initialState }) {
  this.state = initialState;

  this.setState = (nextState, renderType) => {
    this.state = nextState;
    this.render(renderType);
  };

  this.render = renderType => {
    switch (renderType) {
      case RENDER_TYPE.ADD_POSTS:
        const vDOM = document.createDocumentFragment();
        this.state.allPostsStorage.forEach(post => {
          if (
            $main.querySelector(`.post-container[data-id="${post.id}"]`) ===
            null
          ) {
            const { id, title, body } = post;
            const postContainer = postTemplate(id, title, body);
            vDOM.appendChild(postContainer);
          }
        });
        $target.append(vDOM);
        break;
      case RENDER_TYPE.FILTER:
        const { word } = this.state;
        const selectedPosts = this.searchWords(word);
        const highlightedPosts = this.highlightPosts(word, selectedPosts);
        this.showChosenPosts(highlightedPosts);
        break;
      default:
        console.log('invalid render type');
        break;
    }
  };

  this.highLightWord = ($postEle, postEleId, highlightedPosts) => {
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
  };

  this.showChosenPosts = selectedPosts => {
    addClass($noPosts, POST_SHOW_CLASS);
    const allPostsElementsArr = document.querySelectorAll('.post-container');
    const selectedPostIds = selectedPosts.map(post => post.id);

    allPostsElementsArr.forEach($postEle => {
      const { id } = $postEle.dataset;
      if (selectedPostIds.includes(Number(id))) {
        removeClass($postEle, POST_SHOW_CLASS);
        this.highLightWord($postEle, id, selectedPosts);
      } else {
        // 안보이는 건 hightlight제거할 필요 없음.(안보이니깐)
        // 보이기 시작하면 알아서 parsing되니깐
        addClass($postEle, POST_SHOW_CLASS);
      }
    });
    if (!selectedPosts.length) {
      removeClass($noPosts, POST_SHOW_CLASS);
    }
  };

  this.searchWords = word => {
    const selectedPosts = [];
    if (word === '') {
      return selectedPosts;
    }
    this.state.allPostsStorage.forEach(post => {
      const { title, body } = post;
      if (title.search(word) >= 0 || body.search(word) >= 0) {
        selectedPosts.push(post);
      }
    });
    return selectedPosts;
  };

  this.highlightPosts = (word, selectedPosts) => {
    if (word.length) {
      const searchWord = new RegExp(word, 'gi');
      const highlighted = selectedPosts.map(post => {
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
      return highlighted;
    } else {
      return this.state.allPostsStorage;
    }
  };
}
