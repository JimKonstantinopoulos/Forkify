import icons from 'url:../../img/icons.svg'; //parcel v2

export default class View{
    _data;
    render(data, render = true){
        this._data = data;
        const markup = this._generateMarkup();

        if(!render) return markup;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data){
        console.log(data);
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const newMarkup = this._generateMarkup();

        //Takes a string and convers it to a temporary DOM without applying it
        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));
        
        //Updates text content
        newElements.forEach((newEl, i) =>{
            const curEl = curElements[i];
            //Checking if the old and new nodes have different content and if they surely have text inside
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '')
                curEl.textContent = newEl.textContent;

        //Updates attribute content
            if(!newEl.isEqualNode(curEl))
                Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
        });
    }

    _clear(){
        this._parentElement.innerHTML = '';
    }

    renderSpinner(){
        const markup = `
          <div class="spinner">
            <svg>
                <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderError(message = this._defaultError){
        const markup = `
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
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderSuccess(message = this._defaultSuccess){
        const markup = `
            <div class="message">
                <div>
                <svg>
                    <use href="${icons}#icon-alert-smile"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}