import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function PaymentModal({ onSuccess, onFailure, link }) {
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const { getAccessTokenSilently } = useAuth0();

  // Function to handle numeric input only
  const handleNumericInput = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
  };

  // Function to format and set expiry date
  const handleExpiryDateInput = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2 && value.length <= 4) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setPaymentInfo({...paymentInfo, expiryDate: value});
  };

  const processPayment = async (paymentInfo) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${link}process-payment`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(paymentInfo),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error processing payment:", error);
      return { success: false, error: error.message };
    }
  };

  const handlePaymentSubmit = async () => {
    const result = await processPayment(paymentInfo);
    if (result.success) {
      onSuccess(result);
    } else {
      onFailure(result.error || 'An unknown error occurred');
    }
  };

  return (
    <div className="modal">
      <h2>Subscribe to access Goo</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Card Number"
          value={paymentInfo.cardNumber}
          onChange={(e) => {
            handleNumericInput(e);
            setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value });
          }}
          maxLength="16"
        />
        <div style={{display: 'flex'}}>
          <input
            type="text"
            placeholder="MM/YY"
            value={paymentInfo.expiryDate}
            onChange={handleExpiryDateInput}
            maxLength="5"
            style={{flex: 1, marginRight: '5px'}}
          />
          <input
            type="text"
            placeholder="CVV"
            value={paymentInfo.cvv}
            onChange={(e) => {
              handleNumericInput(e);
              setPaymentInfo({ ...paymentInfo, cvv: e.target.value });
            }}
            maxLength="4" // Typically CVV can be 3 or 4 digits
            style={{flex: 1}}
          />
        </div>
      </form>
      <button onClick={handlePaymentSubmit}>Subscribe</button>
      <button onClick={onFailure}>Cancel</button>
    </div>
  );
}

export default PaymentModal;