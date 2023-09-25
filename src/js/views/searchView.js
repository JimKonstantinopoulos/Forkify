class SearchView{
    #parentElement = document.querySelector('.search');
    
    addHandlerSearch(handler){
        this.#parentElement.addEventListener('submit', (e)=>{
            e.preventDefault();
            handler();
        });
    }
    
    getQuery(){
        const query = this.#parentElement.querySelector('.search__field').value;
        this.#clearInput();
        return query;
    }


    #clearInput(){
        this.#parentElement.querySelector('.search__field').value = '';
    }
}

export default new SearchView();