import { combineReducers } from 'redux';
// import downloadsReducer from './downoads.reducer';
// import productsReducer from './products.reducer';
import cartReducer from './cart.reducer';


const rootReducer = combineReducers({
    // downloads: downloadsReducer,
    // products: productsReducer,
    cart: cartReducer
});

export default rootReducer;
