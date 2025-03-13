import { useEffect, useState } from "react";
import ListItem from "../list_item/ListItem";
import { url } from "../../../../contexts/url/Context";
import { z } from "zod";
import "./Container.css";

const mockToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDE4OTA2MDgsImlhdCI6MTc0MTg4ODgwOCwidXNlcklEIjoiMTNhYWEyOGUifQ.R_Xjz6EXnGnMr29Sp6XqE4jwq5BRDG-SDKBu93TL-qs";

function HistoryContainer() {
  const [urls, setUrls] = useState<url[]>([]);

  const getStatus = (isEnabled: boolean, exp: Date | undefined): string => {
    if (!isEnabled) {
      return "Disabled";
    }
    const now = new Date();
    if (exp && exp < now) {
      return "Expired";
    }

    return "Active";
  };

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

    const data: url[] = [];

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

      data.push(newURL);
    });

    setUrls(data);
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <div className="history-container">
      <h2 className="title">History</h2>
      <div className="history-list">
        {urls.map((item: url, id: number) => {
          return <ListItem url={item} key={id} />;
        })}
      </div>
    </div>
  );
}

export default HistoryContainer;
