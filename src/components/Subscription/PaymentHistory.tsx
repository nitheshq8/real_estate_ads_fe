// "use client"
// import axios from 'axios';
// import React, { useState, useEffect } from 'react';

// function PaymentHistory() {
//   const [payments, setPayments] = useState([]);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     // Fetch the payment history as soon as the component mounts or userId changes
//     fetchPaymentHistory();
//   }, []);

//   const fetchPaymentHistory = async () => {
//     const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
    
//     try {
//       setMessage(''); // Clear any previous messages
//       const response:any = await axios.post('http://localhost:8069/api/payment/getPaymentByUserId',{"params":{
//         user_id:userData.user_id
//       }}
//       );
//       console.log("---------response",response?.data?.result?.data);
      
//       const data = response;
//       setPayments(response?.data?.result?.data|| []);
    
//     //   if (data.success) {
//     //     setPayments(esponse?.data?.result?.data|| []);
//     //   } else {
//     //     setPayments([]);
//     //     setMessage(data.message || 'Unable to fetch payment history.');
//     //   }
//     } catch (error) {
//       console.error('Error fetching payment history:', error);
//       setMessage('Error fetching payment history.');
//     }
//   };

//   return (
//     <div style={styles.container}>
//     <h1 style={styles.title}>Payment History</h1>
//     {message && <div style={styles.message}>{message}</div>}
//     {payments.length > 0 ? (
//       <div style={styles.cardContainer}>
//         {payments.map((payment) => (
//           <div key={payment.id} style={styles.card}>
//             <div style={styles.cardItem}>
//               <strong>ID:</strong> {payment.id || ''}
//             </div>
//             <div style={styles.cardItem}>
//               <strong>Name:</strong> {payment.name || ''}
//             </div>
//             <div style={styles.cardItem}>
//               <strong>Plan:</strong> {payment.plan || ''}
//             </div>
//             <div style={styles.cardItem}>
//               <strong>Amount:</strong> {payment.amount || ''}
//             </div>
//             <div style={styles.cardItem}>
//               <strong>Payment Method:</strong> {payment.payment_method || ''}
//             </div>
//             <div style={styles.cardItem}>
//               <strong>Status:</strong> {payment.status || ''}
//             </div>
//             <div style={styles.cardItem}>
//               <strong>Company:</strong> {payment.company || ''}
//             </div>
//           </div>
//         ))}
//       </div>
//     ) : (
//       !message && <div style={styles.noData}>No payment history found.</div>
//     )}
//   </div>
//   );
// }

// // Inline style objects for table headers and cells

// const styles = {
//   container: {
//     padding: '20px',
//     fontFamily: 'Arial, sans-serif',
//   },
//   title: {
//     textAlign: 'center',
//   },
//   message: {
//     color: 'red',
//     textAlign: 'center',
//     marginBottom: '20px',
//   },
//   cardContainer: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//   },
//   card: {
//     border: '1px solid #ddd',
//     borderRadius: '4px',
//     padding: '15px',
//     margin: '10px',
//     width: '100%',
//     maxWidth: '300px',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//     backgroundColor: '#fff',
//   },
//   cardItem: {
//     marginBottom: '8px',
//   },
//   noData: {
//     textAlign: 'center',
//     marginTop: '20px',
//   },
// };


// export default PaymentHistory;
"use client";
import axios from 'axios';
import React, { useState, useEffect } from 'react';

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
    
    try {
      setMessage('');
      const response = await axios.post(
        'http://localhost:8069/api/payment/getPaymentByUserId',
        {
          "params": {
            user_id: userData.user_id
          }
        }
      );
      console.log("---------response", response?.data?.result?.data);
      setPayments(response?.data?.result?.data || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setMessage('Error fetching payment history.');
    }
  };

  return (
    <div className="p-5 font-sans">
      <h1 className="text-center text-2xl font-bold mb-4">Payment History</h1>
      {message && <div className="text-red-500 text-center mb-5">{message}</div>}
      {payments.length > 0 ? (
        <div className="flex flex-wrap justify-center">
          {payments.map((payment:any) => (
            <div 
              key={payment.id} 
              className="border border-gray-300 rounded-md p-4 m-3 w-full max-w-[300px] shadow bg-white"
            >
              <div className="mb-2"><strong>ID:</strong> {payment.id || ''}</div>
              <div className="mb-2"><strong>Name:</strong> {payment.name || ''}</div>
              <div className="mb-2"><strong>Plan:</strong> {payment.plan || ''}</div>
              <div className="mb-2"><strong>Amount:</strong> {payment.amount || ''}</div>
              <div className="mb-2"><strong>Payment Method:</strong> {payment.payment_method || ''}</div>
              <div className="mb-2"><strong>Status:</strong> {payment.status || ''}</div>
              <div className="mb-2"><strong>Company:</strong> {payment.company || ''}</div>
            </div>
          ))}
        </div>
      ) : (
        !message && <div className="text-center mt-5">No payment history found.</div>
      )}
    </div>
  );
}

export default PaymentHistory;
