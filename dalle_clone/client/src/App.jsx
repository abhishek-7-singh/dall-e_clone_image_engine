// import React from 'react'
// import {BrowserRouter, Link,Route,Routes} from 'react-router-dom';
// import {logo} from './assets';
// import { Home,CreatePost } from './pages';
// const App = () => {
//   return (
//     <BrowserRouter>
//     <header className='w-full flex justify-between items-center bg-black sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]'>
//       <Link to="/">
//         {/* <img src={logo} alt="logo"
//         className="w-28 object-contain"/> */}
//         <h3 className="w-30 object-contain text-white ">Fake News Detection</h3>
//       </Link>

//       <Link to="/create-post"
//       className='font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md'>
//       FAKE NEWS DETECTION
//       </Link>
//     </header>
//     <main className='sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]'>
//       <Routes>
//         <Route path="/" element={<Home/>}/>
//         <Route path="/create-post" element={<CreatePost/>}  />
//       </Routes>
//     </main>
//     </BrowserRouter>
//   )
// }

// export default App



import React, { useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [newsInput, setNewsInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkFakeNews = async () => {
    if (!newsInput.trim()) return alert('Enter a news URL or text.');

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', { title: newsInput });
      setResult(response.data);
    } catch (error) {
      alert('Error detecting news authenticity.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-3xl font-bold">Fake News Detection</h1>
      <input
        type="text"
        className="w-96 p-2 mt-4 border rounded"
        placeholder="Enter news URL or text..."
        value={newsInput}
        onChange={(e) => setNewsInput(e.target.value)}
      />
      <button
        onClick={checkFakeNews}
        className="bg-blue-500 text-white p-2 rounded mt-4"
        disabled={loading}
      >
        {loading ? 'Checking...' : 'Check News'}
      </button>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">{result.title}</h2>
          <p className={`mt-2 ${result.prediction ? 'text-green-600' : 'text-red-600'}`}>
            {result.prediction ?  'Real News ✅':'Fake News ❌'}
          </p>
        </div>
      )}
    </div>
  );
};

const CreatePost = () => (
  <div className="flex flex-col items-center mt-10">
    <h1 className="text-2xl font-bold">Coming Soon: News Submission</h1>
  </div>
);

const App = () => (
  <BrowserRouter>
    <header className="w-full flex justify-between items-center bg-black px-6 py-4">
      <Link to="/">
        <h3 className="text-white text-xl">Fake News Detector</h3>
      </Link>
      <Link
        to="/create-post"
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Submit News
      </Link>
    </header>

    <main className="p-6 min-h-[calc(100vh-73px)] bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </main>
  </BrowserRouter>
);

export default App;
