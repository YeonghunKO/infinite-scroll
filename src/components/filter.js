import { $filter, $refreshBtn } from '../utils/doms.js';

export default function Filter({ inputFilter, onRefreshBtn }) {
  $filter.addEventListener('input', inputFilter);

  $refreshBtn.addEventListener('click', onRefreshBtn);

  //   this.render = () => {};
}
