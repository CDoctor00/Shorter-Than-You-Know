import { useContext, useState } from "react";
import { UrlContext } from "../../../contexts/url/Context";
import FormUrl from "../form/Form";
import ShowUrlContainer from "../show/container/Container";
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
        <ShowUrlContainer toggleForm={toggleForm} />
      )}
    </div>
  );
}

export default UrlContainer;
