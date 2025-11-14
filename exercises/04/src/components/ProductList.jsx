const ProductList = ({ products, onAdd }) => {
  return (
    <section>
      <h2>Products</h2>
      <ul>
        {products.map((product, index) => (
          <li key={product.id}>
            <span>
              {product.name} — {product.price}€
            </span>

            <button
              type="button"
              data-testid={`add-${index}`}
              onClick={() => onAdd(product)}
            >
              Add to cart
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProductList;
