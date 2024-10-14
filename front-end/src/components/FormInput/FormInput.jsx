import { useState } from "react";

function FormInput() {
  const [shortURL, setShortURL] = useState("");
  const [originalURL, setOriginalURL] = useState("");
  const [buttonText, setButtonText] = useState("Copy to clipboard");

  const handleSubmit = async (event) => {
    event.preventDefault();

    let { url, timeToLive } = event.target;
    const body = {
      url: url.value,
      timeToLive: Number(timeToLive.value),
    };

    fetch("http://192.168.0.102:10000/shorten", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request rejected");
        }
        return response.json();
      })
      .then((response) => {
        setOriginalURL(response.originalURL);
        setShortURL(response.shortURL);
      })
      .catch((data) => {
        console.error(`Fetch error: ${data}`);
      });
  };

  const copyURL = (event) => {
    let url = event.target.name === "short" ? shortURL : originalURL;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        setButtonText("Copied to clipboard");
        setTimeout(function () {
          setButtonText("Copy to clipboard");
        }, 1000);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  if (shortURL !== "") {
    return (
      <div className="Output">
        <div>
          <p>This is your short URL: {shortURL}</p>
          <button name="short" onClick={copyURL}>
            {buttonText}
          </button>
        </div>
        <div>
          <p>This is your original URL: {originalURL}</p>
          <button name="original" onClick={copyURL}>
            {buttonText}
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="FormInput">
        <form method="post" onSubmit={handleSubmit}>
          <label>
            Paste your link here:
            <input name="url" placeholder="www.styk.com" />
          </label>
          <label>
            Select the duration:
            <input name="timeToLive" type="number" placeholder="100000" />
          </label>
          <button type="submit">Shorten URL</button>
          <button type="reset">Reset</button>
        </form>
      </div>
    );
  }
}

export default FormInput;
