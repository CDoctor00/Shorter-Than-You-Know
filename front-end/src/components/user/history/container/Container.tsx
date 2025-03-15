import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import ListItem from "../list_item/ListItem";
import { url } from "../../../../contexts/url/Context";
import { HistoryContext } from "../../../../contexts/history/Context";
import { getStatus, mockToken } from "./utils";
import { FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import "./Container.css";

function HistoryContainer() {
  const { history, setHistory } = useContext(HistoryContext);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const getHistory = async () => {
    const response = await fetch(
      "http://localhost:10000/api/auth/userHistory",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${mockToken}` },
      }
    );

    const responseData = await response.json();
    if (!response.ok) {
      console.error(response);
    }

    const singleSchema = z.object({
      longUrl: z.string({ message: "longUrl error" }),
      shortID: z.string({ message: "shortID error" }),
      uuid: z.string({ message: "uuid error" }),
      isEnabled: z.boolean({ message: "status error" }),
      createTime: z.string({ message: "createdTime error" }),
      updateTime: z.string({ message: "lastUpdateTime error" }),
      prefix: z.string({ message: "prefix error" }).optional(),
      expirationTime: z.string({ message: "expirationTime error" }).optional(),
      password: z.string({ message: "password error" }).optional(),
      note: z.string({ message: "note error" }).optional(),
      clicks: z.number({ message: "clicks error" }).optional(),
    });
    const responseSchema = z.array(singleSchema);

    const resultsResponse = responseSchema.safeParse(responseData);
    if (!resultsResponse.success) {
      console.error(resultsResponse.error);
      return;
    }

    setHistory(
      resultsResponse.data.map((item) => {
        const exp = item.expirationTime
          ? new Date(item.expirationTime)
          : undefined;

        const newURL: url = {
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
  };

  useEffect(() => {
    getHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let timeoutID: number;
  const updateFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }

    timeoutID = setTimeout(() => {
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
      <h2 className="title">History</h2>
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
        {currentItems.map((item: url, id: number) => {
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
