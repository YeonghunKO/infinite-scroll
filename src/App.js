import Posts from './components/posts.js';
import Filter from './components/filter.js';

import { request } from './utils/api.js';
import { debounce } from './utils/debounce.js';

import { addClass, removeClass } from './utils/template.js';

import { $loader, $filter } from './utils/doms.js';

import { LOADER_SHOW_CLASS, RENDER_TYPE } from './utils/constants.js';

export default function App({ $target }) {
  this.state = {
    LIMIT: 5,
    PAGE: 1,
    isSearching: false,
    allPostsStorage: [],
    word: null,
  };

  this.setState = (nextState, renderType) => {
    this.state = nextState;
    posts.setState(this.state, renderType);
  };

  new Filter({
    inputFilter: () => {
      const word = $filter.value.trim();
      // console.log(word);
      if (word === '') {
        this.state.isSearching = false;
        this.setState({ ...this.state, word }, RENDER_TYPE.FILTER);
        return;
      }
      this.state.isSearching = true;
      this.setState({ ...this.state, word }, RENDER_TYPE.FILTER);

      // posts.render()
    },
    onRefreshBtn: () => {
      this.state.isSearching = false;
      $filter.value = '';
      posts.showChosenPosts(this.state.allPostsStorage);
    },
  });

  const posts = new Posts({ $target, initialState: this.state });

  async function fetchData(limit, page) {
    const data = await request(limit, page);
    return data;
  }

  this.addPosts = async (limit, page) => {
    addClass($loader, LOADER_SHOW_CLASS);
    const newPostsStorage = await fetchData(limit, page);
    const updatedAllPostsStorage = [
      ...this.state.allPostsStorage,
      ...newPostsStorage,
    ];

    this.setState(
      {
        ...this.state,
        allPostsStorage: updatedAllPostsStorage,
      },
      RENDER_TYPE.ADD_POSTS
    );
    removeClass($loader, LOADER_SHOW_CLASS);
  };

  window.addEventListener('scroll', () => {
    if (!this.state.isSearching) {
      const totalHeight = document.body.offsetHeight;
      const { innerHeight, pageYOffset } = window;
      if (innerHeight + pageYOffset >= totalHeight - 10) {
        debounce(() => {
          this.addPosts(this.state.LIMIT, ++this.state.PAGE);
        }, 100);
      }
    }
  });

  this.addPosts(this.state.LIMIT, this.state.PAGE);
}
