import React from 'react'
import './App.css'
import ProductList from './features/productList/ProductList'
import { Query, Field, client } from '@tilework/opus'

client.setEndpoint('http://localhost:4000/')

class App extends React.Component {
  state = {
    categories: [],
    products: [],
  }
  fetchCategories = () => {
    const query = new Query('categories', true).addField('name')

    client
      .post(query)
      .then((result) => this.setState({ categories: result.categories }))
    console.log(this.state)
  }

  fetchProducts = () => {
    const query = new Query('category', true)
      .addArgument('title', 'tech')
      .addField('name')
      .addField(new Field('products').addFieldList(['id', 'name', 'category']))

    client
      .post(query)
      .then((result) => this.setState({ products: result.category.products }))
    console.log(this.state)
  }

  componentDidMount() {
    this.fetchCategories()
  }

  render() {
    return (
      <div>
        <button onClick={this.fetchCategories}>Load Stuff</button>
        {this.state.categories.length > 0 &&
          this.state.categories.map((category) => (
            <button onClick={this.fetchProducts} key={category.name}>
              {category.name}
            </button>
          ))}
        {this.state.products.length > 0 &&
          this.state.products.map((product) => (
            <div key={product.id}>{product.id}</div>
          ))}
      </div>
    )
  }
}

export default App
