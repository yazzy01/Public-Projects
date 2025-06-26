import React, { useState } from 'react';

function ProductList() {
  // Product data
  const initialProducts = [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99, inStock: true },
    { id: 2, name: 'Smartphone', category: 'Electronics', price: 699.99, inStock: true },
    { id: 3, name: 'Headphones', category: 'Accessories', price: 149.99, inStock: false },
    { id: 4, name: 'Monitor', category: 'Electronics', price: 249.99, inStock: true },
    { id: 5, name: 'Keyboard', category: 'Accessories', price: 59.99, inStock: true },
    { id: 6, name: 'Mouse', category: 'Accessories', price: 29.99, inStock: false },
  ];

  // State for products
  const [products, setProducts] = useState(initialProducts);
  
  // State for filters
  const [filters, setFilters] = useState({
    category: 'All',
    inStockOnly: false,
    priceRange: 1000
  });
  
  // State for sorting
  const [sortBy, setSortBy] = useState('name');
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Apply filters and sorting
  const filteredAndSortedProducts = [...products]
    // Filter by category
    .filter(product => filters.category === 'All' || product.category === filters.category)
    // Filter by stock
    .filter(product => !filters.inStockOnly || product.inStock)
    // Filter by price
    .filter(product => product.price <= filters.priceRange)
    // Sort
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'price-low') {
        return a.price - b.price;
      } else if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      return 0;
    });
  
  // Get unique categories for filter options
  const categories = ['All', ...new Set(products.map(product => product.category))];
  
  return (
    <div className="product-list">
      <h2>Product List (useState with Filtering & Sorting)</h2>
      
      {/* Filters */}
      <div className="filters">
        <h3>Filters</h3>
        
        <div className="filter-group">
          <label>Category:</label>
          <select 
            name="category" 
            value={filters.category} 
            onChange={handleFilterChange}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>
            <input 
              type="checkbox" 
              name="inStockOnly" 
              checked={filters.inStockOnly} 
              onChange={handleFilterChange} 
            /> 
            In Stock Only
          </label>
        </div>
        
        <div className="filter-group">
          <label>Max Price: ${filters.priceRange}</label>
          <input 
            type="range" 
            name="priceRange" 
            min="0" 
            max="1000" 
            value={filters.priceRange} 
            onChange={handleFilterChange}
          />
        </div>
      </div>
      
      {/* Sorting */}
      <div className="sorting">
        <label>Sort By:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Name (A-Z)</option>
          <option value="price-low">Price (Low to High)</option>
          <option value="price-high">Price (High to Low)</option>
        </select>
      </div>
      
      {/* Products Table */}
      <table className="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.inStock ? 'In Stock' : 'Out of Stock'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No products match your filters</td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Summary */}
      <div className="summary">
        <p>Showing {filteredAndSortedProducts.length} of {products.length} products</p>
      </div>
    </div>
  );
}

export default ProductList; 