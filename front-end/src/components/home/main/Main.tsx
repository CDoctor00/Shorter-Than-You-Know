import UrlButton from "../../commons/url-button/UrlButton";
import Image from "./Image";
import "./Main.css";

function Main() {
  return (
    <div className="main-container">
      <div className="main-text-container">
        <h2 className="title">
          Shorten, Share, and Track Your Links Instantly!
        </h2>
        <p className="text">
          Reduce the length of your links in one click and make them easier and
          more stylish to share, or customize them. Manage your shared links the
          way you prefer and track their statistics.
        </p>
      </div>
      <Image />
      <UrlButton />
    </div>
  );
}

export default Main;
