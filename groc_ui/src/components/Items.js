import React, { useState } from 'react';
import data from './data.json'
import { Item_card } from './Item_Card';

const Items = () => {
  const groceryItems = data;

  const categories = ['All', 'Fruits', 'Vegetables', 'Meat', 'Dairy'];

  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const filteredItems =
    selectedCategory === 'All'? groceryItems: groceryItems.filter((item) => item.category === selectedCategory
  );

  const handlePayment = async (price) => {
    try {
      // Step 1: Create order via backend
      const response = await fetch('http://localhost:3004/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: price,
          currency: 'INR',
          receipt: 'receipt_1',
        })
      });

      const orderData = await response.json();

      const options = {
        key: 'rzp_test_GcZZFDPP0jHtC4', 
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Your Grocery Store',
        description: 'Test Transaction',
        order_id: orderData.id,
        handler: async function (response) {
          // Step 2: Verify payment
          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          const verificationResponse = await fetch('http://localhost:3004/verifyPayment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
          });

          const verificationResult = await verificationResponse.json();

          if (verificationResult.message === 'Payment verified successfully') {
            alert('Payment successful!');
          } else {
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Grocery Store Address',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };
  

  return (
    <div className='container my-3' >
      <h1>Grocery List</h1>
      <div>
        <label htmlFor="category">Filter by Category: </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      
      <ul className='d-flex flex-row flex-wrap '>
          {filteredItems.map((element) => (
            <div className="col-md-4" key={element.name}>
              <Item_card img_url={element.img_url} 
              name ={element.name} rating = {element.rating}
              price={element.price*20}
              onclick = {()=>handlePayment(element.price*20)}
              description = {element.description}
              />
          </div>
          ))}
      </ul>
    </div>
  );
};

export default Items;
