import View from './view';
import icons from 'url:../../img/icons.svg';
import { RES_PER_PAGE } from '../config';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(`The numPages is ${numPages}`);
    return this._generateMarkupPreview(currPage, numPages);
  }

  _generateMarkupPreview(currPage, numPages) {
    const nextButton = `
    <button data-goto="${
      currPage + 1
    }" class="btn--inline pagination__btn--next">
        <span>Page ${currPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
  `;
    const prevButton = `
  <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currPage - 1}</span>
  </button>`;

    // Page 1, and there are other pages
    if (currPage === 1 && numPages > 1) return nextButton;
    // Last page
    if (currPage === numPages && numPages > 1) return prevButton;
    // Other page
    if (currPage < numPages && currPage > 1)
      return `${prevButton}${nextButton}`;
    // Page 1, thre are not other pages
    return '';
  }

  addHandlerButton(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();
