import React, { useState, useContext } from "react";
import { z } from "zod";
import "./FormUrl.css";
import { FaArrowDown } from "react-icons/fa6";
import UrlContext from "../../contexts/UrlContext/UrlContext.tsx";

type ShortenRequestBody = {
  url: string;
  customURL: string;
  expirationTime: string;
  //   note: string;
  password: string;
};

function FormUrl() {
  const [isOpen, setIsOpen] = useState(false);
  const { setShortenURL } = useContext(UrlContext);

  const createExpDate = (
    date: string | null | undefined,
    time: string | null | undefined
  ): string => {
    if (!date) {
      return "";
    }

    if (!time) {
      time = "00:00";
    }

    const datetime = new Date(`${date}T${time}`);
    if (isNaN(datetime.getTime())) {
      return "";
    }

    //RFC3339 format: 2006-01-02T15:04:05-07:00
    return datetime.toISOString().replace(".000", "");
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      customURL: resultsForm.data.prefix,
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
      originalURL: z.string({ message: "originalURL error" }),
      shortURL: z.string({ message: "shortURL error" }),
    });

    const resultsResponse = responseSchema.safeParse(responseData);
    if (!resultsResponse.success) {
      console.error(resultsResponse.error);
      return;
    }

    setShortenURL(`${window.location.origin}/${resultsResponse.data.shortURL}`);
  };

  return (
    <div className="form-url-container">
      <label className="url-label">Shorten your URL</label>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          id="url"
          name="url"
          placeholder="https://example.com/long-url"
        />
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
          <div className="input-container">
            <label htmlFor="prefix">Prefix</label>
            <input
              type="text"
              id="prefix"
              name="prefix"
              placeholder="Custom prefix of shorten URL"
            />
          </div>
          <div className="timestamp-input-container">
            <div className="input-container" id="date-input">
              <label htmlFor="date">Date</label>
              <input type="date" id="date" name="date" />
            </div>
            <div className="input-container" id="time-input">
              <label htmlFor="time">Time</label>
              <input type="time" id="time" name="time" />
            </div>
          </div>
        </div>
        <input type="submit" value="Shorten" />
      </form>
    </div>
  );
}

export default FormUrl;
