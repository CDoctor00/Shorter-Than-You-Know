import React, { useState, useContext } from "react";
import { z } from "zod";
import { FaArrowDown } from "react-icons/fa6";
import { UrlContext } from "../../../contexts/url/Context";
import { createExpDate } from "./utils";
import "./Form.css";
import { getStatus, mockToken } from "../../user/history/container/utils";

type ShortenRequestBody = {
  url: string;
  prefix: string;
  expirationTime: string;
  password: string;
};
// TODO add note

type UpdateRequestBody = {
  uuid: string;
  url: string;
  prefix: string;
  isEnabled: boolean;
  expirationTime: string;
  password: string;
};

interface props {
  isNewURL: boolean;
  toggleForm: () => void;
}

function FormUrl({ isNewURL, toggleForm }: props) {
  const [isOpen, setIsOpen] = useState(!isNewURL);
  const { url, setURL } = useContext(UrlContext);

  const createShortenURL = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData);

    const formSchema = z.object({
      url: z
        .string({ message: "URL error" })
        .nullish()
        .transform((s) => s ?? ""),
      password: z
        .string({ message: "password error" })
        .nullish()
        .transform((s) => s ?? ""),
      prefix: z
        .string({ message: "prefix error" })
        .nullish()
        .transform((s) => s ?? ""),
      date: z.string({ message: "date error" }).nullish(),
      time: z.string({ message: "time error" }).nullish(),
    });

    const resultsForm = formSchema.safeParse(formValues);
    if (!resultsForm.success) {
      console.error(resultsForm.error);
      return;
    }

    const data: ShortenRequestBody = {
      url: resultsForm.data.url,
      prefix: resultsForm.data.prefix,
      expirationTime: createExpDate(
        resultsForm.data.date,
        resultsForm.data.time
      ),
      password: resultsForm.data.password,
    };
    const response = await fetch("http://localhost:10000/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (!response.ok) {
      console.error(response);
    }

    const responseSchema = z.object({
      longUrl: z.string({ message: "longUrl error" }),
      shortID: z.string({ message: "shortID error" }),
    });

    const resultsResponse = responseSchema.safeParse(responseData);
    if (!resultsResponse.success) {
      console.error(resultsResponse.error);
      return;
    }

    setURL({
      longUrl: resultsResponse.data.longUrl,
      shortID: resultsResponse.data.shortID,
      shortUrl: `${window.location.origin}/${resultsResponse.data.shortID}`,
    });
    toggleForm();
  };

  const updateURL = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!url) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData);

    const formSchema = z.object({
      url: z
        .string({ message: "URL error" })
        .nullish()
        .transform((s) => s ?? ""),
      password: z
        .string({ message: "password error" })
        .nullish()
        .transform((s) => s ?? ""),
      prefix: z
        .string({ message: "prefix error" })
        .nullish()
        .transform((s) => s ?? ""),
      enable: z.string({ message: "enable error" }).nullish(),
      date: z.string({ message: "date error" }).nullish(),
      time: z.string({ message: "time error" }).nullish(),
    });

    console.log(formValues);

    const resultsForm = formSchema.safeParse(formValues);
    if (!resultsForm.success) {
      console.error(resultsForm.error);
      return;
    }

    const requestBody: UpdateRequestBody = {
      url: resultsForm.data.url,
      prefix: resultsForm.data.prefix,
      expirationTime: createExpDate(
        resultsForm.data.date,
        resultsForm.data.time
      ),
      password: resultsForm.data.password,
      isEnabled: resultsForm.data.enable === "on",
      uuid: url.uuid!,
    };
    const response = await fetch("http://localhost:10000/api/auth/updateUrl", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mockToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();
    if (!response.ok) {
      console.error(response);
    }

    const responseSchema = z.object({
      longUrl: z.string({ message: "longUrl error" }),
      shortID: z.string({ message: "shortID error" }),
    });

    const resultsResponse = responseSchema.safeParse(responseData);
    if (!resultsResponse.success) {
      console.error(resultsResponse.error);
      return;
    }

    setURL({
      longUrl: resultsResponse.data.longUrl,
      shortID: resultsResponse.data.shortID,
      shortUrl: `${window.location.origin}/${resultsResponse.data.shortID}`,
      createTime: url.createTime,
      uuid: url.uuid,
      updateTime: new Date(),
      expirationTime: new Date(requestBody.expirationTime),
      isEnabled: requestBody.isEnabled,
      prefix: requestBody.prefix,
      status: getStatus(
        requestBody.isEnabled,
        new Date(requestBody.expirationTime)
      ),
    });
    toggleForm();
  };

  return (
    <div className="form-url-container">
      <label className="card-label">Shorten your URL</label>
      <form onSubmit={isNewURL ? createShortenURL : updateURL}>
        <input
          type="text"
          id="url"
          name="url"
          placeholder="https://example.com/long-url"
          defaultValue={url?.longUrl}
        />
        {isNewURL && (
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
                defaultChecked={url?.isEnabled}
              />
            </div>
          </div>
          <div className="split-inputs timestamp">
            <div className="input-container" id="date-input">
              <label htmlFor="date">Date</label>
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
        </div>
        <input type="submit" value={isNewURL ? "Shorten" : "Apply changes"} />
      </form>
    </div>
  );
}

export default FormUrl;
