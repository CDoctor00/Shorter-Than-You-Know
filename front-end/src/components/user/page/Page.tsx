import HistoryContainer from "../history/container/Container";
import ProfileBar from "../profile/bar/Bar";
import Statistics from "../statistics/Statistics";
import "./Page.css";

function UserPage() {
  return (
    <div className="user-page">
      <div className="user-container">
        <ProfileBar />
        <Statistics activeLinks={76} clicks={234} totalLinks={798} />
        <HistoryContainer />
      </div>
    </div>
  );
}

export default UserPage;
