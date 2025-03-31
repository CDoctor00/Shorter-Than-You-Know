import { useContext, useEffect } from "react";
import { getToken } from "../../../services/api/utils/tokens";
import { getHistory } from "../../../services/api/auth/history";
import { HistoryContext } from "../../../contexts/history/Context";
import { Url } from "../../../types/contexts";
import { getStatus } from "../../../services/system/urls";
import HistoryContainer from "../history/container/Container";
import ProfileBar from "../profile/bar/Bar";
import Statistics from "../statistics/Statistics";
import "./Page.css";

function UserPage() {
  const { setHistory } = useContext(HistoryContext);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }

    getHistory(token)
      .then((response) => {
        setHistory(
          response.map((item) => {
            const exp = item.expirationTime
              ? new Date(item.expirationTime)
              : undefined;

            const newURL: Url = {
              ...item,
              shortUrl: `${window.location.origin}/${item.shortID}`,
              createTime: new Date(item.createTime),
              updateTime: new Date(item.updateTime),
              expirationTime: exp,
              status: getStatus(item.isEnabled, exp),
            };

            return newURL;
          })
        );
      })
      .catch((error) => {
        console.error(error);
        return;
      });
  }, [setHistory]);

  return (
    <div className="user-page">
      <div className="user-wrapper">
        <ProfileBar />
        <Statistics />
        <HistoryContainer />
      </div>
    </div>
  );
}

export default UserPage;
