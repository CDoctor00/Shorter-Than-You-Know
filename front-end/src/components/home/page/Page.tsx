import FaqContainer from "../faq/container/Container";
import Main from "../main/Main";
import Table from "../table/Table";
import "./Page.css";

function HomePage() {
  return (
    <div className="home-page">
      <div className="home-container">
        <Main />
        <Table />
        <FaqContainer />
      </div>
    </div>
  );
}

export default HomePage;
