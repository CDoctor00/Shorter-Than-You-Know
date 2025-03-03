import { useContext, useEffect, useRef, useState } from "react";
import { FaqContext } from "../../../../contexts/faq/Context";
import { feature } from "../container/utils";
import "./Item.css";

function FaqItem(props: feature) {
  const { activeItem, setActiveItem } = useContext(FaqContext);

  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      const innerHeight = (ref.current as HTMLParagraphElement).scrollHeight;
      setHeight(innerHeight);
    }
  }, []);

  return (
    <div className={`faq-item ${activeItem === props.id && "open"}`}>
      <button
        className={`label ${activeItem === props.id && "open"}`}
        onClick={() => {
          setActiveItem(props.id);
        }}
      >
        {props.title}
      </button>
      <div
        ref={ref}
        style={{ height: `${activeItem === props.id ? height : 0}px` }}
        className={`content ${activeItem === props.id && "open"}`}
      >
        <p>{props.description}</p>
      </div>
    </div>
  );
}

export default FaqItem;
