import "./App.css";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/NavBar/NavBar";
import UrlPage from "./components/UrlPage/UrlPage";

function App() {
  return (
    <div className="container">
      <NavBar />
      <main>
        <UrlPage />
      </main>
      <Footer />
    </div>
  );
}

export default App;
