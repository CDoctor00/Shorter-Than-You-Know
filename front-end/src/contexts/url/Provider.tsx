import { useState } from "react";
import { UrlContext } from "./Context";
import { Url } from "../../types/contexts";

interface props {
  children: React.ReactNode;
}

const UrlContextProvider = (props: props) => {
  const [url, setURL] = useState<Url>();
  const [isNew, setIsNew] = useState(true);
  const [showForm, setShowForm] = useState(url === undefined);

  const toggleShowForm = () => {
    setShowForm(!showForm);
  };

  const updateStates = (newUrl: Url | undefined, isNew: boolean) => {
    setURL(newUrl);
    setIsNew(isNew);
    setShowForm(false);
  };

  return (
    <UrlContext.Provider
      value={{ url, isNew, setUrl: updateStates, showForm, toggleShowForm }}
    >
      {props.children}
    </UrlContext.Provider>
  );
};

export default UrlContextProvider;
