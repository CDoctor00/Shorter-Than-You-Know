import FaqContainer from "../faq/container/Container";
import Main from "../main/Main";
import Explore from "../explore/Explore";
import "./Page.css";

function HomePage() {
  return (
    <div className="home-page">
      <div className="home-wrapper">
        <Main />
        <Explore />
        <FaqContainer />
      </div>
    </div>
  );
}

export default HomePage;
