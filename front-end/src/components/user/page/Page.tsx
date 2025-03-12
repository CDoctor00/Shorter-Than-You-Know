import HistoryContainer from "../history/container/Container";
import Profile from "../profile/Profile";
import Statistics from "../statistics/Statistics";
import "./Page.css";

function UserPage() {
  return (
    <div className="user-page">
      <div className="user-container">
        <Profile
          email="capriomattia@gmail.com"
          name="Mattia"
          surname="Caprio"
        />
        <Statistics activeLinks={76} clicks={234} totalLinks={798} />
        <HistoryContainer />
      </div>
    </div>
  );
}

export default UserPage;
