const Cart = ({ items, onRemove }) => {
  let total = 0;

  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }

  return (
    <section>
      <h2>Cart</h2>

      {items.length === 0 && <p>No items in cart</p>}

      <ul>
        {items.map((item, index) => (
          <li key={`${item.id}-${index}`} data-testid={`cart-item-${index}`}>
            <span>
              {item.name} — {item.price}€
            </span>
            <button
              type="button"
              data-testid={`remove-${index}`}
              onClick={() => onRemove(index)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <p>
        Total:{' '}
        <span data-testid="cart-total">{total.toFixed(2)}</span> €
      </p>
    </section>
  );
};

export default Cart;
