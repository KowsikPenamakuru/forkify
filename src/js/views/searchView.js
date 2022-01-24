class SearchView {
  constructor() {
    this._parentEl = document.querySelector('.search');
  }

  getQuery() {
    const keyword = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return keyword;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    //   submit button will require prevent default
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}
export default new SearchView();
