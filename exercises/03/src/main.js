document.addEventListener('DOMContentLoaded', () => {
  const form        = document.getElementById('expense-form');
  const nameInput   = document.querySelector('[name="expense-name"]');
  const amountInput = document.querySelector('[name="expense-amount"]');
  const addBtn      = document.getElementById('add-btn');
  const listEl      = document.getElementById('expense-list');
  const totalEl     = document.getElementById('total');
  const errorEl     = document.getElementById('error');

  const missing = [
    ['form', form], ['name', nameInput], ['amount', amountInput],
    ['button', addBtn], ['list', listEl], ['total', totalEl], ['error', errorEl],
  ].filter(([, el]) => !el);

  if (missing.length) {
    console.error('Faltan elementos del DOM:', missing.map(([k]) => k).join(', '));
    return;
  }

  const expenses  = [];
  const money     = (n) => `$${n.toFixed(2)}`;
  const showError = (msg = '') => (errorEl.textContent = msg);

  function render() {
    listEl.innerHTML = '';
    expenses.forEach(({ name, amount }) =>  {
      const li = document.createElement('li');
      li.textContent = `${name}: ${money(amount)}`;
      listEl.appendChild(li);
    });
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    totalEl.textContent = money(total);
  }

  form.addEventListener('submit', (e) => e.preventDefault());

  addBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const raw  = amountInput.value.trim();

    if (!name) return showError('Please enter an expense name.');
    if (!raw)  return showError('Please enter an amount.');

    const amount = parseFloat(raw.replace(/[^\d.,-]/g, '').replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      return showError('Amount must be a positive number.');
    }

    showError('');
    expenses.push({ name, amount }); 
    render();
    form.reset();
    nameInput.focus();
  });
});
