import View from './view.js';
import icons from 'url:../../img/icons.svg'; //parcel v2

class PaginationView extends View{
    #currentPage;
    
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler){
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');

            if(!btn) return;

            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        })
    }

    _generateMarkup(){
        this.#currentPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

        //page 1, and there are other pages
        if(this.#currentPage === 1 && numPages > 1)
            return this._generateMarkupButtonNext();
        
        //last page
        if(this.#currentPage === numPages && numPages > 1)
            return this._generateMarkupButtonPrev();

        //other page
        if(this.#currentPage < numPages)
            return [this._generateMarkupButtonPrev(), this._generateMarkupButtonNext()].join(' ');

        //page 1, and there no are other pages
        return;
    }

    _generateMarkupButtonPrev(){
        return `
                <button class="btn--inline pagination__btn--prev" data-goto="${this.#currentPage - 1}">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                <span>${this.#currentPage - 1}</span>
                </button>
            `;
    }

    _generateMarkupButtonNext(){
        return `
                <button class="btn--inline pagination__btn--next" data-goto="${this.#currentPage + 1}">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                <span>${this.#currentPage + 1}</span>
                </button>
            `;
    }
}

export default new PaginationView();