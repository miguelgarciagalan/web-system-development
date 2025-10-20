document.addEventListener('DOMContentLoaded', () => {
  const form   = document.getElementById('expense-form');
  const nameI  = document.getElementById('expense-name');
  const amtI   = document.getElementById('expense-amount');
  const btn    = document.getElementById('add-btn');      
  const listEl = document.getElementById('expense-list');
  const totalE = document.getElementById('total');
  const errE   = document.getElementById('error');

  const missing = [['form',form],['name',nameI],['amount',amtI],['button',btn],['list',listEl],['total',totalE],['error',errE]]
    .filter(([,el]) => !el)
    .map(([k]) => k);
  if (missing.length) {
    console.error('Faltan elementos del DOM:', missing.join(', '));
    return;
  }

  const expenses = [];
  const money = n => `$${n.toFixed(2)}`;
  const showError = (m='') => errE.textContent = m;

  const render = () => {
    listEl.innerHTML = '';
    expenses.forEach(({name,amount}) => {
      const li = document.createElement('li');
      li.textContent = `${name}: ${money(amount)}`;
      listEl.appendChild(li);
    });
    const total = expenses.reduce((s,e) => s + e.amount, 0);
    totalE.textContent = money(total);
  };

  form.addEventListener('submit', e => e.preventDefault());

  btn.addEventListener('click', () => {
    const name = nameI.value.trim();   
    const raw  = amtI.value.trim();
    if (!name) return showError('Please enter an expense name.');
    if (!raw)  return showError('Please enter an amount.');

    const amount = parseFloat(raw.replace(/[^\d.,-]/g,'').replace(',', '.'));
    if (isNaN(amount) || amount <= 0) return showError('Amount must be a positive number.');

    showError('');
    expenses.push({ name, amount });
    render();
    form.reset();
    nameI.focus();
  });
});