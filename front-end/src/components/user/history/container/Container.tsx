import { useContext, useEffect } from "react";
import ListItem from "../list_item/ListItem";
import { url } from "../../../../contexts/url/Context";
import { HistoryContext } from "../../../../contexts/history/Context";
import { z } from "zod";
import { getStatus, mockToken } from "./utils";
import "./Container.css";

function HistoryContainer() {
  const { history, setHistory } = useContext(HistoryContext);

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

  return (
    <div className="history-container">
      <h2 className="title">History</h2>
      <div className="history-list">
        {history.map((item: url, id: number) => {
          return <ListItem url={item} key={id} />;
        })}
      </div>
    </div>
  );
}

export default HistoryContainer;
