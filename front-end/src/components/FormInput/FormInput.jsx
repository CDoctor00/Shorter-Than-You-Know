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
  const postBody = {
    url: url.value,
    timeToLive: timeToLive.value,
  };

  console.log(1, url.value, typeof timeToLive.value);

  let response = await fetch("http://192.168.0.102:10000/shorten", {
    method: "POST",
    body: JSON.stringify(postBody),
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(2, response);
};

export default FormInput;
