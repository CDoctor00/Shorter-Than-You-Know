import { useContext } from "react";
import { UrlContext } from "../../../contexts/url/Context";
import FormUrl from "../form/Form";
import ShowUrlContainer from "../show/container/Container";
import "./Container.css";

function UrlContainer() {
  const { showForm } = useContext(UrlContext);

  return (
    <div className="url-container">
      {showForm ? <FormUrl /> : <ShowUrlContainer />}
    </div>
  );
}

export default UrlContainer;
