import React, { useState, useContext } from "react";
import { z } from "zod";
import { FaArrowDown } from "react-icons/fa6";
import { UrlContext } from "../../../contexts/url/Context";
import { createExpDate } from "./utils";
import { getStatus } from "../../user/history/container/utils";
import { HistoryContext } from "../../../contexts/history/Context";
import { shorten } from "../../../services/api/base/shorten";
import { getToken } from "../../../services/api/utils/tokens";
import { updateUrl } from "../../../services/api/auth/updateUrl";
import { UserContext } from "../../../contexts/user/Context";
import { RequestUrlBody } from "../../../services/api/auth/types";
import { Url } from "../../../types/contexts";
import "./Form.css";

function FormUrl({ toggleForm }: { toggleForm: () => void }) {
  const { url, isNew, setUrl } = useContext(UrlContext);
  const { updateItem } = useContext(HistoryContext);
  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(!isNew);

  const formSchema = z.object({
    url: z.string({ message: "URL error" }),
    password: z
      .string({ message: "password error" })
      .optional()
      .transform((val) => val || undefined),
    enable: z
      .string({ message: "enable error" })
      .optional()
      .transform((val) => val || undefined),
    prefix: z
      .string({ message: "prefix error" })
      .optional()
      .transform((val) => val || undefined),
    note: z
      .string({ message: "note error" })
      .optional()
      .transform((val) => val || undefined),
    date: z
      .string({ message: "date error" })
      .optional()
      .transform((val) => val || undefined),
    time: z
      .string({ message: "time error" })
      .optional()
      .transform((val) => val || undefined),
  });

  const createShortenURL = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData);

    const resultsForm = formSchema.safeParse(formValues);
    if (!resultsForm.success) {
      console.error(resultsForm.error);
      return;
    }

    if (!resultsForm.data.url) {
      return;
    }

    const requestBody: RequestUrlBody = {
      url: resultsForm.data.url,
      prefix: resultsForm.data.prefix,
      expirationTime: createExpDate(
        resultsForm.data.date,
        resultsForm.data.time
      ),
      password: resultsForm.data.password,
      isEnabled: resultsForm.data.enable === "on",
      note: resultsForm.data.note,
    };

    shorten(getToken(), requestBody)
      .then((response) => {
        setUrl(
          {
            longUrl: response.longUrl,
            shortID: response.shortID,
            shortUrl: `${window.location.origin}/${response.shortID}`,
          },
          true
        );
        toggleForm();
      })
      .catch((error) => {
        console.error(error);
        return;
      });
  };

  const updateURL = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!url) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData);

    const resultsForm = formSchema.safeParse(formValues);
    if (!resultsForm.success) {
      console.error(resultsForm.error);
      return;
    }

    const token = getToken();
    if (!token || !resultsForm.data.url) {
      return;
    }

    const requestBody: RequestUrlBody = {
      url: resultsForm.data.url,
      prefix: resultsForm.data.prefix,
      expirationTime: createExpDate(
        resultsForm.data.date,
        resultsForm.data.time
      ),
      password: resultsForm.data.password,
      isEnabled: resultsForm.data.enable === "on",
      uuid: url.uuid!,
      note: resultsForm.data.note,
    };

    updateUrl(token, requestBody)
      .then((response) => {
        const exp = requestBody.expirationTime
          ? new Date(requestBody.expirationTime)
          : undefined;

        const newUrl: Url = {
          longUrl: response.longUrl,
          shortID: response.shortID,
          shortUrl: `${window.location.origin}/${response.shortID}`,
          createTime: url.createTime,
          uuid: url.uuid,
          updateTime: new Date(response.updateTime),
          expirationTime: exp,
          isEnabled: requestBody.isEnabled,
          prefix: requestBody.prefix,
          status: getStatus(requestBody.isEnabled, exp),
          note: resultsForm.data.note,
        };

        setUrl(newUrl, false);
        updateItem(newUrl);
        toggleForm();
      })
      .catch((error) => {
        console.error(error);
        return;
      });
  };

  return (
    <div className="form-url-container">
      <label className="card-label">Shorten your URL</label>
      <form onSubmit={isNew ? createShortenURL : updateURL}>
        <input
          type="text"
          id="url"
          name="url"
          placeholder="https://example.com/long-url"
          defaultValue={url?.longUrl}
          required={true}
        />
        <div>
          {" "}
          {isNew && (
            <button
              className="advanced-button"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen((previous) => !previous);
              }}
            >
              <span>Advanced</span>
              <FaArrowDown className={`arrow ${isOpen ? "open" : ""}`} />
            </button>
          )}
          <div className={`advanced ${isOpen ? "" : "close"}`}>
            <div className="input-container">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
              />
            </div>
            <div className="split-inputs">
              <div className="input-container" id="prefix-input">
                <label htmlFor="prefix">Prefix</label>
                <input
                  type="text"
                  id="prefix"
                  name="prefix"
                  placeholder="Custom prefix of shorten URL"
                  defaultValue={url?.prefix}
                />
              </div>
              <div className="input-container" id="enable-input">
                <label htmlFor="enable">Enable</label>
                <input
                  type="checkbox"
                  id="enable"
                  name="enable"
                  defaultChecked={url ? url.isEnabled : true}
                />
              </div>
            </div>
            <div className="split-inputs timestamp">
              <div className="input-container" id="date-input">
                <label htmlFor="date">Expiration Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  defaultValue={
                    url?.expirationTime?.toISOString().split("T", 1)[0]
                  }
                />
              </div>
              <div className="input-container" id="time-input">
                <label htmlFor="time">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  defaultValue={url?.expirationTime
                    ?.toLocaleTimeString()
                    .slice(0, -3)}
                />
              </div>
            </div>
            {user && (
              <div className="input-container">
                <label htmlFor="note">Note</label>
                <textarea
                  id="note"
                  name="note"
                  placeholder="Some note to remember"
                  maxLength={500}
                  defaultValue={url?.note}
                />
              </div>
            )}
          </div>
        </div>
        <input
          type="submit"
          id="submit"
          value={isNew ? "Shorten" : "Apply changes"}
        />
      </form>
    </div>
  );
}

export default FormUrl;
