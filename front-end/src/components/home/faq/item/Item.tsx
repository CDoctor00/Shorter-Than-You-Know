import { useEffect, useRef, useState } from "react";
import "./Item.css";

interface itemProps {
  title: string;
  description: string;
}

function FaqItem(props: itemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const innerHeight = (ref.current as HTMLParagraphElement).scrollHeight;
    setHeight(innerHeight);
  }, []);

  return (
    <div className={`faq-item ${isOpen && "open"}`}>
      <button
        className={`label ${isOpen && "open"}`}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {props.title}
      </button>
      <div
        ref={ref}
        style={{ height: `${isOpen ? height : 0}px` }}
        className={`content ${isOpen && "open"}`}
      >
        <p>{props.description}</p>
      </div>
    </div>
  );
}

export default FaqItem;
