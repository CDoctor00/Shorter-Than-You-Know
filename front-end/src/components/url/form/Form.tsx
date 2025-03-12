import React, { useState, useContext } from "react";
import { z } from "zod";
import { FaArrowDown } from "react-icons/fa6";
import { UrlContext } from "../../../contexts/url/Context";
import { createExpDate } from "./utils";
import "./Form.css";

type ShortenRequestBody = {
  url: string;
  customURL: string;
  expirationTime: string;
  //  note: string;
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

    setURL({
      longURL: resultsForm.data.url,
      shortenURL: `${window.location.origin}/${resultsResponse.data.shortURL}`,
    });
    toggleForm();
  };

  const updateURL = async (event: React.FormEvent<HTMLFormElement>) => {
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

    //TODO Continue with update API
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
          defaultValue={url?.longURL}
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
              defaultValue={url?.password}
            />
          </div>
          <div className="input-container">
            <label htmlFor="prefix">Prefix</label>
            <input
              type="text"
              id="prefix"
              name="prefix"
              placeholder="Custom prefix of shorten URL"
              defaultValue={url?.prefix}
            />
          </div>
          <div className="timestamp-input-container">
            <div className="input-container" id="date-input">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                defaultValue={url?.expirationTime}
              />{" "}
              {/* TODO aggiornare in base al formato di data */}
            </div>
            <div className="input-container" id="time-input">
              <label htmlFor="time">Time</label>
              <input
                type="time"
                id="time"
                name="time"
                defaultValue={url?.expirationTime}
              />
              {/* TODO aggiornare in base al formato di data */}
            </div>
          </div>
        </div>
        <input type="submit" value={isNewURL ? "Shorten" : "Apply changes"} />
      </form>
    </div>
  );
}

export default FormUrl;
