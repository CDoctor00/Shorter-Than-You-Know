import { useContext, useState } from "react";
import FormUrl from "../form/Form";
import ShowUrl from "../show/Show";
import { UrlContext } from "../../../contexts/url/Context";
import "./Container.css";

function UrlContainer({ isNewURL }: { isNewURL: boolean }) {
  const { url } = useContext(UrlContext);
  const [showForm, setShowForm] = useState(url === undefined);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="url-container">
      {showForm ? (
        <FormUrl isNewURL={isNewURL} toggleForm={toggleForm} />
      ) : (
        <ShowUrl isNewURL={isNewURL} toggleForm={toggleForm} />
      )}
    </div>
  );
}

export default UrlContainer;
