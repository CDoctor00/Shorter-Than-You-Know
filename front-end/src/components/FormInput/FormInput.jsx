function FormInput() {
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

let handleSubmit = async (event) => {
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
    })
    .catch((err) => {
      console.error(`Fetch error: ${err}`);
    });
};

export default FormInput;
