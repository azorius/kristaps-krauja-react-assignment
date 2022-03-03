import React from 'react'
import './App.css'
import ProductList from './features/productList/ProductList'
import { Query, Field, client } from '@tilework/opus'

client.setEndpoint('http://localhost:4000/')

class App extends React.Component {
  state = {
    categories: [],
    products: [],
    product: null,
  }
  fetchCategories = () => {
    const query = new Query('categories', true).addField('name')

    client
      .post(query)
      .then((result) => this.setState({ categories: result.categories }))
    console.log(this.state)
  }

  fetchProducts = (category) => {
    const query = new Query('category', true)

      .addField('name')
      .addField(new Field('products').addFieldList(['id', 'name', 'category']))
    if (category) {
      query.addArgument('input', 'CategoryInput', { title: category })
    }
    client
      .post(query)
      .then((result) => this.setState({ products: result.category.products }))
    console.log(this.state)
  }

  fetchProduct = (id) => {
    const query = new Query('product', true)
      .addArgument('id', 'String!', id)
      .addFieldList(['id', 'name', 'category'])

    client
      .post(query)
      .then((result) => this.setState({ product: result.product }))
    console.log(this.state)
  }

  componentDidMount() {
    this.fetchCategories()
    this.fetchProducts()
  }

  render() {
    let products
    let productDetails
    if (this.state.products.length > 0) {
      products = this.state.products.map((product) => (
        <div key={product.id}>
          <button onClick={() => this.fetchProduct(product.id)}>Details</button>
          {product.name}
        </div>
      ))
    }
    if (this.state.product) {
      productDetails = <div>name: {this.state.product.name}</div>
    }

    return (
      <div>
        <button onClick={this.fetchCategories}>Load Stuff</button>
        {this.state.categories.length > 0 &&
          this.state.categories.map((category) => (
            <button
              onClick={() => this.fetchProducts(category.name)}
              key={category.name}>
              {category.name}
            </button>
          ))}
        {products}
        {productDetails}
      </div>
    )
  }
}

export default App
