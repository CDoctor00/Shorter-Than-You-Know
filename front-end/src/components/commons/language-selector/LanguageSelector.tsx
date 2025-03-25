import { useState } from "react";
import i18next from "i18next";
import { MdGTranslate } from "react-icons/md";
import "./LanguageSelector.css";

type languageOption = { language: string; code: string };

const languageOptions: languageOption[] = [
  { language: "English", code: "en" },
  { language: "Italian", code: "it" },
  { language: "French", code: "fr" },
  { language: "German", code: "de" },
  { language: "Spanish", code: "es" },
];

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (code: string) => {
    i18next.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="language-selector-container">
      <MdGTranslate
        className="icon"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <ul className="options-list">
          {languageOptions.map(({ language, code }) => (
            <li
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`option ${
                language === i18next.language ? "selected" : ""
              }`}
            >
              {language}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;
