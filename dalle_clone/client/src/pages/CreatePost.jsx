import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { preview } from '../assets';
import { FormField, Loader } from '../components';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    photo: '', // Store the image URL here
  });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const generateImage = async (promt) => {
    if (promt) {
      try {
        setGeneratingImg(true);
        const response = await fetch('http://localhost:8080/api/v1/dalle/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: promt })
        });
        const data = await response.json();
        setForm({name:promt, photo: data.imageUrl }); 
      } catch (error) {
        alert(error);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please enter a prompt');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.name && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form }),
        });

        await response.json();
        alert('Success');
        navigate('/');
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please generate an image with proper details');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const checkprediction = async () => {
    try {
      if (form.name) {
        const response = await fetch('http://127.0.0.1:5000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: form.name })
        });
        const data = await response.json();
        await setForm({...form,name:data.title})
        setPrediction(data.prediction);
        if(data.prediction===1){
            generateImage(data.title);
        }
      } else {
        alert('Please enter the news title');
      }
    } catch (error) {
      console.error('Error predicting:', error);
    }
  };
  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">FAKE NEWS DETECTION</h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
        Experience Tomorrow's News Today: Where AI Meets Imagination
        </p>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
        Check the Truthness of news before making it into blog..
        </p>
      </div>
      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="News title or URL(From Hindustan times only)"
            type="text"
            name="name"
            placeholder="Paste the title of news...or the URL"
            value={form.name}
            handleChange={handleChange}
          />
             <div>
          <button
            type="button"
            onClick={checkprediction}
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? 'Predicting....' : 'Predict and Generate'}
          </button>
          {form.name && (
            <div className="mt-2 flex justify-center">
              {prediction !== null && (
                <>
                  <p className={`${prediction === 1 ? 'text-green-500' : 'text-red-500'} font-semibold text-center`}>
                    {prediction === 1 ? 'This news is correct.' : 'This news is fake.'}
                  </p>
                </>
              )}
            </div>
          )}

        </div>
          {/* <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A plush toy robot sitting against a yellow wall"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          /> */}
          {/* <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            {form.photo ? (
              <img src={form.photo} alt={form.prompt} className="w-full h-full object-contain" />
            ) : (
              <img src={preview} alt="preview" className="w-9/12 h-9/12 object-contain opacity-40" />
            )}
            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justifuy-center items-center bg-[rgba(0,0,0,5)] rounded-lg ">
                <Loader />
              </div>
            )}
          </div> */}
        </div>
        {/* <div>
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? 'Generating...' : 'Generate'}
          </button>
        </div> */}
        {/* <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            Once you have predicted the News as real and generated the image you wished, you can share it and contribute to the community
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? 'Sharing...' : 'Share'}
          </button>
        </div> */}
      </form>
    </section>
  );
};

export default CreatePost;
