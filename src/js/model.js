// import {async} from 'regeneration-runtime';
import {API_URL, RES_PER_PAGE} from './config.js';
import {getJSon} from './helpers.js';

export const state = {
    recipe: {},
    search: {
      query: '',
      results: [],
      page: 1,
      resultsPerPage: RES_PER_PAGE
    },
    bookmarks: []
};

export const loadRecipe = async function(id){
  try {
    const data = await getJSon(`${API_URL}${id}`);
    
    const {recipe} = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      imageUrl: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients
    };

    if(state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else
      state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function(query){
  try {
    state.search.query = query;
    const data = await getJSon(`${API_URL}?search=${query}`);
    
    if(data.data.recipes.length === 0) throw new Error();
    
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        imageUrl: rec.image_url
      };
    });
    state.search.page = 1;
    //Save query for page loading
    localStorage.setItem('query', JSON.stringify(query));

  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function(page = state.search.page){
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  //0 to 9 and not 0 to 10 cause slice stops one number behind
  return state.search.results.slice(start, end);
};

export const updateServings = function(newServings){
  state.recipe.ingredients.forEach(ing =>{
    ing.quantity = ing.quantity * (newServings / state.recipe.servings);
  });

  state.recipe.servings = newServings;
};

export const persistBookmarks = function(){
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe){
  //Add to bookmark
  state.bookmarks.push(recipe);

  //Mark recipe as bookmarked
  if(recipe.id === state.recipe.id)
    state.recipe.bookmarked = true;

  persistBookmarks();
};

export const removeBookmark = function(id){
  //Find the bookmarked recipe via id
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //Remove recipe from bookmarks array
  if(id === state.recipe.id)
    state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function(){
  const bookmarks = localStorage.getItem('bookmarks');
  const query = localStorage.getItem('query');

  if(bookmarks)
    state.bookmarks = JSON.parse(bookmarks);

  if(query)
    state.search.query = JSON.parse(query);
};

init();