import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "../components/commons/navbar/NavBar";
import Footer from "../components/commons/footer/Footer";
import Modal from "../components/commons/modal/Modal";
import UserPage from "../components/user/page/Page";
import SignPage from "../components/sign/page/Page";
import PrivateRoute from "../components/commons/routes/PrivateRoute";
import HomePage from "../components/home/page/Page";
import ErrorPage from "../components/error/Page";
import UrlPage from "../components/url/page/Page";
import UnloggedRoute from "../components/commons/routes/UnloggedRoute";
import RedirectPage from "../components/redirect/Page";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <NavBar />
        <main>
          <Routes>
            <Route
              path="/sign"
              element={
                <UnloggedRoute>
                  <SignPage />
                </UnloggedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <PrivateRoute>
                  <UserPage />
                </PrivateRoute>
              }
            />
            <Route path="/home" element={<HomePage />} />
            <Route path="/shorten" element={<UrlPage />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/*" element={<RedirectPage />} />
          </Routes>
          <Modal />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
