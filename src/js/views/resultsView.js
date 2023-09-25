import View from './view.js';
import previewView from './previewView.js';

class ResultsView extends View{
    _parentElement = document.querySelector('.results');
    _defaultError = 'No recipes found! Please try again';

    _generateMarkup(){
        return this._data.map(result => previewView.render(result, false)).join('');
    }
}

export default new ResultsView();