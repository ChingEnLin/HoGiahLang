// import {useEffect, useState} from 'react';
// import './App.css';
// import {FetchLatestAsset, SaveAsset} from "../wailsjs/go/main/App";

// function App() {
//     const [amount, setAmount] = useState<string>('');
//     const [savedAmount, setSavedAmount] = useState<number | null>(null);

//     useEffect(() => {
//         FetchLatestAsset().then(setSavedAmount);
//     }, []);

//     const saveAsset = async () => {
//         const amountFloat = parseFloat(amount);
//         if (isNaN(amountFloat)) {
//             alert('Please enter a valid number');
//             return;
//         }
//         await SaveAsset(amountFloat);
//         setSavedAmount(amountFloat);
//     };

//     return (
//         <div className="App">
//             <h1>Simple Accounting App</h1>
//             <input
//                 type="text"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 placeholder="Enter your total assets"
//             />
//             <button onClick={saveAsset}>Save</button>
//             {savedAmount !== null && <p>Latest saved asset: {savedAmount}</p>}
//         </div>
//     );
// }

// export default App
export {};