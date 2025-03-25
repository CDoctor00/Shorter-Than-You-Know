import FaqItem from "../item/Item";
import { features } from "./utils";
import FaqContextProvider from "../../../../contexts/faq/Provider";
import { useTranslation } from "react-i18next";
import "./Container.css";

function FaqContainer() {
  const { t } = useTranslation();

  return (
    <div className="faq-container">
      <h2 className="title">{t("homePage.faq.title")}</h2>
      <FaqContextProvider>
        {features.map((feat) => {
          return (
            <FaqItem
              key={feat.id}
              id={feat.id}
              title={t(feat.title)}
              description={t(feat.description)}
            />
          );
        })}
      </FaqContextProvider>
    </div>
  );
}

export default FaqContainer;
