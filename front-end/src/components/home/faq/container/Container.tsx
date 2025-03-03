import FaqItem from "../item/Item";
import { features } from "./utils";
import FaqContextProvider from "../../../../contexts/faq/Provider";
import "./Container.css";

function FaqContainer() {
  return (
    <div className="faq-container">
      <h2 className="title">Explore the features!</h2>
      <FaqContextProvider>
        {features.map((feat) => {
          return (
            <FaqItem
              key={feat.id}
              id={feat.id}
              title={feat.title}
              description={feat.description}
            />
          );
        })}
      </FaqContextProvider>
    </div>
  );
}

export default FaqContainer;
