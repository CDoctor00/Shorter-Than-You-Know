import Footer from "../components/commons/footer/Footer";
import NavBar from "../components/commons/navbar/NavBar";
import Modal from "../components/commons/modal/Modal";
import UserPage from "../components/user/page/Page";
import HomePage from "../components/home/page/Page";
import "./App.css";
import UrlPage from "../components/url/page/Page";
import ErrorPage from "../components/error/Page";

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <main>
        <HomePage />
        <Modal />
      </main>
      <Footer />
    </div>
  );
}

export default App;
