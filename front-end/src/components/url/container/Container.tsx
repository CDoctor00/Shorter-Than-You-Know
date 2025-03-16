import { useContext, useState } from "react";
import FormUrl from "../form/Form";
import ShowUrl from "../show/Show";
import { UrlContext } from "../../../contexts/url/Context";
import "./Container.css";

function UrlContainer() {
  const { url } = useContext(UrlContext);
  const [showForm, setShowForm] = useState(url === undefined);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="url-container">
      {showForm ? (
        <FormUrl toggleForm={toggleForm} />
      ) : (
        <ShowUrl toggleForm={toggleForm} />
      )}
    </div>
  );
}

export default UrlContainer;
