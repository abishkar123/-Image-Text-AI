import React, { useState } from 'react'; 
import './App.css';
import { Container } from 'react-bootstrap';

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

    } catch (error) {
      console.error(error)
      setError("Please check your code");
    }
  };

  const handleOnClick= async (e) => {
    if (!image) {
      setError("Error! You must upload an image.");
      return;
    }

    try {
      const options = {
        method: "POST",
        body: JSON.stringify({ message: value }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch("http://localhost:8000/gemini", options);
    
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.text();
      setResponse(data);
      console.log(data)

    } catch (error) {
      console.error(error);
      setError("Something didn't work! Please try again.");
    }
  };

  const handleOnClear = () => {
    setImage(null); 
    setValue("");
    setResponse("");
    setError("");
  };

  return (
    <div className='img-contain font-nunito'>
      <Container>
        <section>
          <div className='parent-container'>
            <div className='img-upload'>
              <p className='text-sm font-semibold p-4'>Upload Image</p>
              <div className='img-box'>
                <div className='text-sm font-normal font-serif img-drag-drop'>
                  <div>
                    <span className='position: relative left-28'>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#0000F5">
                        <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z"/>
                      </svg>
                    </span>
                    <label htmlFor='files'>Drag and Drop img here or 
                      <span className='underline'> Choose img</span>
                    </label>

                    {image && 
                      <img className="image" 
                      src={URL.createObjectURL(image)} alt="Uploaded Preview" />
                    }
                  </div>
                </div>
                <input 
                  onChange={uploadImage} 
                  id="files" accept='image/*' type='file' hidden />
              </div>
               
              <div className='text-xm font-normal p-4'>
                <input
                  className='input-content text-sm'
                  value={value}
                  placeholder='Write your prompt..'
                  onChange={e => setValue(e.target.value)}
                />
                {" "}
                </div>

                <div>
                {(!response && !error) && <button className="p-1 text-xm font-semibold button-text" onClick={handleOnClick}>Ask me</button>}
                {(response || error) && <button className='p-1 text-xm font-semibold button-text' onClick={handleOnClear}>Clear</button>}
              </div>

            </div>
          </div>

         
        </section>
      </Container>
      {error && <p>{error}</p>}
      {response && <p className='answer mt-0'>
        {response}</p>}
    </div>
  );
}

export default App;
