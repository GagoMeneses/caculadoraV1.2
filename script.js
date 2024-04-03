// Tasas de cambio fijas para simplificar. Deberías actualizar estas tasas según sean necesarias.
const exchangeRates = {
  "USD": { "EUR": 0.93, "BsBCV": 36.33, "BsP": 38.33, "USD": 1 },
  "EUR": { "USD": 1.08, "BsBCV": 39.06, "BsP": 41.22, "EUR": 1 },
  "BsBCV": { "USD": 0.028, "EUR": 0.026, "BsP": 1.06, "BsBCV": 1 },
  "BsP": { "USD": 0.026, "EUR": 0.024, "BsBCV": 0.94, "BsP": 1 }
};

document.addEventListener('DOMContentLoaded', function() {
  const calculateButton = document.getElementById('calculateChange');
  if(calculateButton) {
      calculateButton.addEventListener('click', calculateChange);
  }
});

function calculateChange() {
  const totalAmountToPay = parseFloat(document.getElementById('totalAmountToPay').value);
  const currencyToPay = document.getElementById('currencyToPay').value;

  let totalPaidInCurrencyToPay = 0;

  document.querySelectorAll('input[name="paymentCurrency"]:checked').forEach(input => {
      const currency = input.value;
      const amount = parseFloat(document.getElementById(`amount${currency}`).value) || 0;
      if (amount > 0) {
          totalPaidInCurrencyToPay += amount * (exchangeRates[currency][currencyToPay] || 0);
      }
  });

  let changeDue = totalPaidInCurrencyToPay - totalAmountToPay;
  
  let changeCurrencies = [];
  document.querySelectorAll('input[name="changeCurrency"]:checked').forEach(input => {
      changeCurrencies.push(input.value);
  });

  if (changeDue > 0 && changeCurrencies.length > 0) {
      let currencyForChange = changeCurrencies[0];
      let changeInSelectedCurrency = changeDue * (exchangeRates[currencyToPay][currencyForChange] || 1);
      showResults(changeInSelectedCurrency, currencyForChange, true);
  } else if (changeDue < 0) {
      showResults(Math.abs(changeDue), currencyToPay, false);
  } else {
      showResults(0, currencyToPay, true);
  }
}

function showResults(changeDue, currency, isExactPayment) {
  const resultDiv = document.getElementById('result');
  if (isExactPayment) {
      if (changeDue > 0) {
          resultDiv.innerHTML = `Cambio debido en ${currency}: ${changeDue.toFixed(2)}`;
          // Almacenar el cambio debido para su uso posterior
          localStorage.setItem('changeDue', changeDue);
          localStorage.setItem('changeCurrency', currency);
      } else {
          resultDiv.innerHTML = 'Pago exacto, no se debe cambio.';
          localStorage.removeItem('changeDue');
          localStorage.removeItem('changeCurrency');
      }
  } else {
      resultDiv.innerHTML = `Falta pagar en ${currency}: ${changeDue.toFixed(2)}`;
      localStorage.removeItem('changeDue');
      localStorage.removeItem('changeCurrency');
  }
}








function resetCalculator() {
  // Restablecer campos de entrada de monto
  document.getElementById('totalAmountToPay').value = '';
  document.querySelectorAll('input[type="number"]').forEach(input => {
      input.value = '';
  });

  // Desmarcar todas las selecciones de moneda
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
  });
 // Desmarcar todas las selecciones de moneda para recibir cambio 
 document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.checked = false;
});


  document.getElementById('currencyToPay').selectedIndex = 0; // Restablecer a la primera opción

  // Limpiar resultados
  document.getElementById('result').innerHTML = '';
  document.getElementById('result2').innerHTML = '';

  // Aquí puedes agregar cualquier otro campo o elemento que necesites restablecer
}

// Asegúrate de llamar a esta función cuando el botón de reinicio sea clickeado
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('resetButton').addEventListener('click', resetCalculator);
});


