import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function PaymentModal({ onSuccess, onFailure, link }) {
    const { getAccessTokenSilently } = useAuth0();

    const ProductDisplay = () => (
        <section className="flex flex-col items-center justify-center min-h-[60vh] p-8">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Lifetime subscription
                    </h3>
                    <h5 className="text-xl text-gray-600">$20.00</h5>
                </div>
                <button 
                    onClick={handlePaymentSubmit}
                    className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg
                             hover:bg-blue-600 transition-colors duration-200
                             font-medium text-lg focus:outline-none focus:ring-2
                             focus:ring-blue-500 focus:ring-offset-2"
                >
                    Subscribe
                </button>
            </div>
        </section>
    );
  
    const Message = ({ message }) => (
        <section className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <p className="text-center text-gray-700 text-lg">
                    {message}
                </p>
            </div>
        </section>
    );

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

    const [message, setMessage] = useState("");

    useEffect(() => {
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
    }, [onSuccess, onFailure]);

    return message ? (
        <Message message={message} />
    ) : (
        <ProductDisplay />
    );
}

export default PaymentModal;