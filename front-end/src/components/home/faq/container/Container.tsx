import FaqItem from "../item/Item";
import { features } from "./utils";
import "./Container.css";

function FaqContainer() {
  return (
    <div className="faq-container">
      <h2 className="title">Explore the features!</h2>
      {features.map((feat) => {
        return (
          <FaqItem
            key={feat.id}
            title={feat.title}
            description={feat.description}
          />
        );
      })}
    </div>
  );
}

export default FaqContainer;
