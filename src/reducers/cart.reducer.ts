
function generateProductQuantity(products) {
    let quantity = 0;
    if (products.length > 0) {
        for (let i = 0; i <= products.length - 1; i++) {
            quantity += (products[i].quantity);
        }
    } else {
        quantity = 1;
    }
    return quantity;
}

function generateProductPrice(products, payload, usePayloadValue) {
    let total = 0;
    for (let i = 0; i < products.length; i++) {
        total += ((products[i].price * products[i].quantity));
    }

    if (usePayloadValue) {
        return (total + payload.price);
    } else {
        return total;
    }
}

function updateQuantity(quantity) {
    const qty = quantity + 1;
    return qty;
}

function removeProducts(products: Array<any>, payload: any) {
    return products.filter((product) => {
        return product.code !== payload.code;
    })
}

function adjustProductQuantity(products: Array<any>, payload: any) {
    const items = removeProducts(products, payload);
    return generateProductQuantity(items);
}

function adjustCartPrice(products: Array<any>, payload: any) {
    const items = removeProducts(products, payload);
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total += ((items[i].price * items[i].quantity));
    }
    return total;
}

// The default state for our cart
const initialState = {
  products: [],
  quantity: 0,
  price: 0,
  total: 0
}

export default function cartReducer(state = initialState, action) {

  switch (action.type) {

      // Add a product
      case 'cart/added':

          return {
              ...state,
              products: [
                  ...state.products,
                  action.payload.products
              ],
              quantity: generateProductQuantity(state.products),
              price: generateProductPrice(state.products, action.payload.products, true),
          }

      // Update existing product
      case 'cart/updated':

          return {
              ...state,
              products: state.products.map(
                  (product) => product.code === action.payload.products.code ? {...product, quantity: updateQuantity(product.quantity)}
                                          : product
              ),
              // Now calculate the correct values for each state property using our previously defined functions
              quantity: generateProductQuantity(state.products),
              price: generateProductPrice(state.products, action.payload.products, true),
          }


      // Remove existing product
      case 'cart/deleted':

          return {
              ...state,
              products: removeProducts(state.products, action.payload.products),
              quantity: adjustProductQuantity(state.products, action.payload.products),
              price: adjustCartPrice(state.products, action.payload.products),
          }


      // Return the default state
      default:
          return state
  }
}
