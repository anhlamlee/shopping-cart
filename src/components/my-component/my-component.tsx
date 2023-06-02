import { Component, getAssetPath, h, Host, State } from '@stencil/core';
import store from '../../store/store';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
  assetsDirs: ['../assets']
})
export class MyComponent {
  @State() products = [
    {
      id: 0,
      name: 'Mèo cây nhà lá vườn',
      code: '#1',
      image: getAssetPath('../assets/cat1.jpg'),
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In mattis nulla at ullamcorper tincidunt. Praesent aliquam massa at sagittis interdum',
      price: 10.00,
      displayed: true
    },
    {
        id: 1,
        name: 'Mèo Anh lông dài',
        code: '#2',
        image: getAssetPath('../assets/cat2.jpg'),
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In mattis nulla at ullamcorper tincidunt. Praesent aliquam massa at sagittis interdum',
        price: 20.00,
        displayed: true
    },
    {
        id: 2,
        name: 'Mèo hoang',
        code: '#3',
        image: getAssetPath('../assets/cat3.jpg'),
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In mattis nulla at ullamcorper tincidunt. Praesent aliquam massa at sagittis interdum',
        price: 30.00,
        displayed: true
    }
  ];

  @State() cartItems: any;

  private currency = '£';

  componentDidLoad() {
    this.listenForStateChanges();
  }

  private listenForStateChanges(): void {
    store.subscribe(() => {
      const state = store.getState();
      this.cartItems = state.cart;
    });
  }

  private addToCart(product: any): void {
    if (this.cartItems !== undefined) {
      if (this.cartItems.hasOwnProperty('products') && this.cartItems.products.length > 0) {
        const match = this.cartItems.products.filter((item) => {
          return item.name.indexOf(product.name) > -1;
        });
        if (match.length > 0) {
          let products = this.generateProductListing(product, product.quantity);
          store.dispatch({ type: 'cart/updated', payload: { products: products } });
        } else {
          let products = this.generateProductListing(product, 1);
          store.dispatch({ type: 'cart/added', payload: { products: products } });
        }
      } else {
        let products = this.generateProductListing(product, 1);
        store.dispatch({ type: 'cart/added', payload: { products: products } });
      }
    } else {
      let products = this.generateProductListing(product, 1);
      store.dispatch({ type: 'cart/added', payload: { products: products } });
    }
  }

  private generateProductListing(product: any, quantity: number): any {
    let products = {
      name: product.name,
      code: product.code,
      price: product.price,
      quantity: quantity
    };
    return products;
  }

  private delete(product: any, index: number): void {
     store.dispatch({ type: 'cart/deleted', payload: { index: index, products: product }});
  }


  render() {
    return (
      <Host>
        <div class="wrapper">
          <div class="products">
            <h1>Your Products</h1>
              <table>
              <thead>
                <tr>
                  <th class="products__cart--product">Product</th>
                  <th class="products__cart--title">Name</th>
                  <th class="products__cart--detail">Price</th>
                  <th class="products__cart--add">Add</th>
                </tr>
              </thead>
              <tbody>
                {this.products.map((product: any) =>
                <tr>
                  <td class="products__cart--product">
                    <img src={product.image} />
                  </td>
                  <td class="products__cart--title">
                    {product.name}
                  </td>
                  <td class="products__cart--detail">
                  {this.currency}{product.price}
                  </td>
                  <td class="products__cart--add">
                    <button type="button" onClick={() =>{console.log('alo'); this.addToCart(product)} }>
                      +
                    </button>
                  </td>
                </tr>
                )}
              </tbody>
            </table>
          </div>
          <div class="products__cart">
            <h1>Your Cart</h1>
            <table>
              <thead>
                <tr>
                  <th class="products__cart--product">Product</th>
                  <th class="products__cart--detail">Quantity</th>
                  <th class="products__cart--price">Price</th>
                  <th class="products__cart--delete">Remove</th>
                </tr>
              </thead>
            {this.cartItems?.products && this.cartItems.products.length > 0 ?
              <tbody>
                {this.cartItems.products.map((product: any, index: number) =>
                <tr>
                  <td class="products__cart--product">
                    {product.name}
                  </td>
                  <td class="products__cart--detail">
                    {product.quantity}
                  </td>
                  <td class="products__cart--price">
                  {this.currency}{product.price}
                  </td>
                  <td class="products__cart--detail">
                  <button type="button" onClick={() => this.delete(product, index) }>x</button>
                  </td>
                </tr>
                )}
              </tbody>
              :
              <tbody>
                <tr>
                  <td style={{ "text-align" : "center" }} colSpan={4}>No Items</td>
                </tr>
              </tbody>
              }
            </table>
            {this.cartItems?.products && this.cartItems.products.length > 0 &&
            <table>
              <thead>
                <tr>
                  <th class="products__cart--product" colSpan={4}>
                    Totals
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="products__cart--heading">Total Price</td>
                  <td class="products__cart--value">
                    {this.currency}{this.cartItems.price}
                  </td>
                </tr>
              </tbody>
            </table>}

          </div>
        </div>
      </Host>
    );
  }
}
