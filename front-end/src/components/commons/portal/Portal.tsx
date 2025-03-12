import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

interface props {
  children: React.ReactNode;
  wrapperID?: string;
}

function Portal({ children, wrapperID = "portal-wrapper" }: props) {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement>();

  const createDomElement = (wrapperID: string): HTMLElement => {
    const wrapperElement = document.createElement("div");
    wrapperElement.setAttribute("id", wrapperID);
    document.body.appendChild(wrapperElement);

    return wrapperElement;
  };

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperID);
    let isCreatedCustomly = false;

    if (!element) {
      isCreatedCustomly = true;
      element = createDomElement(wrapperID);
    }

    setWrapperElement(element);

    return () => {
      //? delete element callback
      if (isCreatedCustomly && element.parentNode) {
        element.parentNode.removeChild(element); //? delete element only if created dynamically
      }
    };
  }, [wrapperID]);

  return wrapperElement ? createPortal(children, wrapperElement) : null;
}

export default Portal;
