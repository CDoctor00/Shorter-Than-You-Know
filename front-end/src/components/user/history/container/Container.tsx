import { useContext, useState } from "react";
import ListItem from "../list-item/ListItem";
import { HistoryContext } from "../../../../contexts/history/Context";
import { FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { Url } from "../../../../types/contexts";
import { useTranslation } from "react-i18next";
import "./Container.css";

function HistoryContainer() {
  const { history } = useContext(HistoryContext);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { t } = useTranslation();

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
