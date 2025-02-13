import React, { useState } from "react";
import { z } from "zod";
import "./FormUrl.css";
import { ShortenRequestBody } from "./utils";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

function FormUrl() {
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
      expirationTime: Date.parse(
        `${resultsForm.data.date} ${resultsForm.data.time}`
      ),
      password: resultsForm.data.password,
    };

    let response = await fetch("http://localhost:10000/api/shorten", {
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

    console.log(resultsResponse.data);
  };

  const [isOpen, setIsOpen] = useState(false);

  let component = (
    <>
      <form onSubmit={onSubmit}>
        <div className="input-container">
          <label htmlFor="url">Paste your long url here</label>
          <input
            type="text"
            id="url"
            name="url"
            placeholder="https://example.com/long-url"
          />
        </div>
        <button
          className="advanced-button"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen((previous) => !previous);
          }}
        >
          <span>Advanced</span>
          {isOpen ? <FaArrowUp /> : <FaArrowDown />}
        </button>
        <div className="advanced" style={{ display: isOpen ? "grid" : "none" }}>
          <div className="input-container">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="password"
            />
          </div>
          <div className="input-container">
            <label htmlFor="prefix">Prefix</label>
            <input
              type="text"
              id="prefix"
              name="prefix"
              placeholder="custom_url"
            />
          </div>
          <div className="input-container">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              // placeholder="https://example.com/long-url"
            />
          </div>
          <div className="input-container">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              // placeholder="https://example.com/long-url"
            />
          </div>
        </div>
        <input type="submit" value="Shorten" />
      </form>
    </>
  );

  return component;
}

export default FormUrl;
