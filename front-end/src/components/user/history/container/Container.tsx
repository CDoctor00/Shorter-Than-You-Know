import { useContext, useEffect, useState } from "react";
import ListItem from "../list_item/ListItem";
import { HistoryContext } from "../../../../contexts/history/Context";
import { getStatus } from "./utils";
import { FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { getHistory } from "../../../../services/api/auth/history";
import { getToken } from "../../../../services/api/utils/tokens";
import { Url } from "../../../../types/contexts";
import "./Container.css";
import { useTranslation } from "react-i18next";

function HistoryContainer() {
  const { history, setHistory } = useContext(HistoryContext);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { t } = useTranslation();

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

  let timeoutID: number;
  const updateFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }

    timeoutID = window.setTimeout(() => {
      setFilter(event.target.value);
      setCurrentPage(1);
    }, 300);
  };

  const updatePages = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const filteredHistory = history.filter(
    (item) =>
      item.longUrl.toLowerCase().includes(filter.toLowerCase()) ||
      item.shortUrl.toLowerCase().includes(filter.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="history-container">
      <h2 className="title">{t("userPage.history.title")}</h2>
      <div className="bar">
        <form className="search">
          <FaSearch className="button lens" />
          <input type="text" placeholder="Search" onChange={updateFilter} />
          <button
            className="button reset"
            type="reset"
            onClick={() => setFilter("")}
          >
            <FaXmark />
          </button>
        </form>
        <form className="pages">
          <select name="pages" id="pages" onChange={updatePages}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </form>
      </div>

      <div className="list">
        {currentItems.map((item: Url, id: number) => {
          return <ListItem url={item} key={id} />;
        })}
      </div>

      <ul className="pagination">
        {Array.from(
          { length: Math.ceil(filteredHistory.length / itemsPerPage) },
          (_, index) => (
            <li
              key={index}
              onClick={() => {
                setCurrentPage(index + 1);
              }}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default HistoryContainer;
