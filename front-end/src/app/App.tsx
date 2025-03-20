import Footer from "../components/commons/footer/Footer";
import NavBar from "../components/commons/navbar/NavBar";
import Modal from "../components/commons/modal/Modal";
import UserPage from "../components/user/page/Page";
import SignPage from "../components/sign/page/Page";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <main>
        <UserPage />
        <Modal />
      </main>
      <Footer />
    </div>
  );
}

export default App;
