import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function PaymentModal({ onSuccess, onFailure, link }) {
  const ProductDisplay = () => (
    <section style={{padding:'20%'}}>
      <div className="product">
        <div className="description">
        <h3>Lifetime subscription</h3>
        <h5>$20.00</h5>
        </div>
      </div>
      <button onClick={handlePaymentSubmit}>Subscribe</button>
    </section>
  );
  
  const Message = ({ message }) => (
    <section>
      <p>{message}</p>
    </section>
  );
  
  // const [paymentInfo, setPaymentInfo] = useState({
  //   cardNumber: '',
  //   expiryDate: '',
  //   cvv: ''
  // });
  const { getAccessTokenSilently } = useAuth0();

  // // Function to handle numeric input only
  // const handleNumericInput = (e) => {
  //   const value = e.target.value.replace(/\D/g, '');
  //   e.target.value = value;
  // };

  // // Function to format and set expiry date
  // const handleExpiryDateInput = (e) => {
  //   let value = e.target.value.replace(/\D/g, '');
  //   if (value.length > 2 && value.length <= 4) {
  //     value = value.slice(0, 2) + '/' + value.slice(2, 4);
  //   }
  //   setPaymentInfo({...paymentInfo, expiryDate: value});
  // };

  const processPayment = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${link}process-payment`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
      });
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.redirect_url;
      } else {
        const errorData = await response.json();
        console.error("Error processing payment:", errorData.error);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  const handlePaymentSubmit = async () => {
    processPayment();
    
  };

  // return (
  //   <div className="modal">
  //     <h2>Subscribe to access Goo</h2>
  //     <form onSubmit={(e) => e.preventDefault()}>
  //       <input
  //         type="text"
  //         placeholder="Card Number"
  //         value={paymentInfo.cardNumber}
  //         onChange={(e) => {
  //           handleNumericInput(e);
  //           setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value });
  //         }}
  //         maxLength="16"
  //       />
  //       <div style={{display: 'flex'}}>
  //         <input
  //           type="text"
  //           placeholder="MM/YY"
  //           value={paymentInfo.expiryDate}
  //           onChange={handleExpiryDateInput}
  //           maxLength="5"
  //           style={{flex: 1, marginRight: '5px'}}
  //         />
  //         <input
  //           type="text"
  //           placeholder="CVV"
  //           value={paymentInfo.cvv}
  //           onChange={(e) => {
  //             handleNumericInput(e);
  //             setPaymentInfo({ ...paymentInfo, cvv: e.target.value });
  //           }}
  //           maxLength="4" // Typically CVV can be 3 or 4 digits
  //           style={{flex: 1}}
  //         />
  //       </div>
  //     </form>
  //     <button onClick={handlePaymentSubmit}>Subscribe</button>
  //     <button onClick={onFailure}>Cancel</button>
  //   </div>
  // );
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
      onSuccess();
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
      onFailure();
    }
  }, []);

  return message ? (
    <Message message={message} />
  ) : (
    <ProductDisplay />
  );
}

export default PaymentModal;