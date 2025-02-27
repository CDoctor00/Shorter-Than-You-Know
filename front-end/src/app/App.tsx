import Footer from "../components/commons/footer/Footer";
import NavBar from "../components/commons/navbar/NavBar";
import UrlPage from "../components/url/page/Page";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <main>
        <UrlPage />
      </main>
      <Footer />
    </div>
  );
}

export default App;
