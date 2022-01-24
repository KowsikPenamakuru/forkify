import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  render(data, renderMarkup = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const html = this._generateMarkup();
    console.log(html);
    if (!renderMarkup) return html;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newDomElements = Array.from(newDom.querySelectorAll('*'));
    const currDomElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    newDomElements.forEach((newEle, i) => {
      const currEl = currDomElements[i];
      // using .innerHTML
      /*       if (!currEl.isEqualNode(newEle)) {
        currEl.innerHTML = newEle.innerHTML;
      } */

      if (
        !currEl.isEqualNode(newEle) &&
        newEle.firstChild?.nodeValue.trim() !== ''
      ) {
        currEl.textContent = newEle.textContent;
      }

      if (!currEl.isEqualNode(newEle)) {
        Array.from(newEle.attributes).forEach(attr =>
          currEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const html = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  renderError(message = this._errorMessage) {
    const html = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  renderMessage(message = this._message) {
    const html = `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }
}
