import React, { useState } from 'react'; // Ensure React is imported
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [value, setValue] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const surpriseOptions = [
    'Does the image have a whale?',
    'Is the image fabulously pink?',
    'Does the image have puppies?'
  ];

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const uploadImage = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    setImage(e.target.files[0]);

    try {
      const options = {
        method: "POST",
        body: formData,
      };
      const response = await fetch("http://localhost:8000/upload", options);
      const data = await response.json();

      console.log(data, "this is data");

    } catch (error) {
      console.error(error);
      setError("Please check your code");
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      setError("Error! You must upload an image.");
      return;
    }

    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value
        }),
        headers: {
          "Content-Type": "application/json"
        }
      };

      const response = await fetch("http://localhost:8000/gemini", options);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.text();
      setResponse(data);

    } catch (error) {
      console.error(error);
      setError("Something didn't work! Please try again");
    }
  };

  const clear = () => {
    // setImage(null);
    setValue("");
    // setResponse("");
    // setError("");
  };

  return (
    <div className='app'>
      <section className='search-section'>
        <div className='image-container'>
          {image && <img className="image" src={URL.createObjectURL(image)} alt="Uploaded Preview" />}
        </div>
        <p className='extra-info'>
          <span>
            <label htmlFor='files'>Upload an image</label>
            <input onChange={uploadImage} id="files" accept='image/*' type='file' hidden />
          </span>
          to ask a question about.
        </p>
        <p>
          What do you want to know about the image?
          <button className='surprise' onClick={surprise} disabled={response}>Surprise me</button>
        </p>
        <div className='input-container'>
          <input
            value={value}
            placeholder='What is in the image...'
            onChange={e => setValue(e.target.value)}
          />
          <div>
            {(!response && !error) && <button className='ask-me' onClick={analyzeImage}>Ask me</button>}
            {(response || error) && <button onClick={clear}>Clear</button>}
          </div>
        </div>
        {error && <p>{error}</p>}
        {response && <p className='answer'>{response}</p>}
      </section>
    </div>
  );
}

export default App;
