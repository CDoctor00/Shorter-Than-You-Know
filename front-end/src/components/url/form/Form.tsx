import { useState, useContext } from "react";
import { FaArrowDown } from "react-icons/fa6";
import { UrlContext } from "../../../contexts/url/Context";
import { createExpDate } from "./utils";
import { getStatus } from "../../user/history/container/utils";
import { HistoryContext } from "../../../contexts/history/Context";
import { shorten } from "../../../services/api/base/shorten";
import { getToken } from "../../../services/api/utils/tokens";
import { updateUrl } from "../../../services/api/auth/update_url";
import { UserContext } from "../../../contexts/user/Context";
import { RequestUrlBody } from "../../../services/api/auth/types";
import { Url } from "../../../types/contexts";
import { useForm } from "react-hook-form";
import {
  formUrlSchema,
  FormUrlType,
} from "../../../services/zod/form/form_url";
import { zodResolver } from "@hookform/resolvers/zod";
import "./Form.css";

function FormUrl() {
  const { url, isNew, setUrl, toggleShowForm } = useContext(UrlContext);
  const { updateItem } = useContext(HistoryContext);
  const { isAuthenticated } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(!isNew);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<FormUrlType>({
    resolver: zodResolver(formUrlSchema),
  });

  const createShortenURL = async (data: FormUrlType) => {
    const requestBody: RequestUrlBody = {
      url: data.url,
      prefix: data.prefix,
      expirationTime: createExpDate(data.date, data.time),
      password: data.password,
      isEnabled: data.enable,
      note: data.note,
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
        toggleShowForm();
      })
      .catch((error) => {
        console.error(error);
        return;
      });
  };

  const updateURL = async (data: FormUrlType) => {
    if (!url) {
      return;
    }

    const token = getToken();
    if (!token || !data.url) {
      return;
    }

    const requestBody: RequestUrlBody = {
      url: data.url,
      prefix: data.prefix,
      expirationTime: createExpDate(data.date, data.time),
      password: data.password,
      isEnabled: data.enable,
      uuid: url.uuid!,
      note: data.note,
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
          note: data.note,
        };

        setUrl(newUrl, false);
        updateItem(newUrl);
        toggleShowForm();
      })
      .catch((error) => {
        console.error(error);
        return;
      });
  };

  return (
    <div className="form-url-container">
      <label className="card-label">Shorten your URL</label>
      <form
        onSubmit={
          isNew ? handleSubmit(createShortenURL) : handleSubmit(updateURL)
        }
      >
        <input
          type="text"
          id="url"
          {...register("url")}
          className={errors.url && "error-input"}
          onChange={() => {
            clearErrors("url");
          }}
          placeholder="https://example.com/long-url"
          defaultValue={url?.longUrl}
        />
        {errors.url && (
          <p className="error-input-message">{errors.url.message}</p>
        )}
        <div>
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
                {...register("password")}
                className={errors.password && "error-input"}
                onChange={() => {
                  clearErrors("password");
                }}
                placeholder="Password"
              />
              {errors.password && (
                <p className="error-input-message">{errors.password.message}</p>
              )}
            </div>
            <div className="split-inputs">
              <div className="input-container" id="prefix-input">
                <label htmlFor="prefix">Prefix</label>
                <input
                  type="text"
                  id="prefix"
                  {...register("prefix")}
                  className={errors.prefix && "error-input"}
                  onChange={() => {
                    clearErrors("prefix");
                  }}
                  placeholder="Custom prefix of shorten URL"
                  defaultValue={url?.prefix}
                />
                {errors.prefix && (
                  <p className="error-input-message">{errors.prefix.message}</p>
                )}
              </div>
              <div className="input-container" id="enable-input">
                <label htmlFor="enable">Enable</label>
                <input
                  type="checkbox"
                  id="enable"
                  {...register("enable")}
                  className={errors.enable && "error-input"}
                  onChange={() => {
                    clearErrors("enable");
                  }}
                  defaultChecked={url ? url.isEnabled : true}
                />
                {errors.enable && (
                  <p className="error-input-message">{errors.enable.message}</p>
                )}
              </div>
            </div>
            <div className="split-inputs timestamp">
              <div className="input-container" id="date-input">
                <label htmlFor="date">Expiration Date</label>
                <input
                  type="date"
                  id="date"
                  {...register("date")}
                  className={errors.date && "error-input"}
                  onChange={() => {
                    clearErrors("date");
                  }}
                  defaultValue={
                    url?.expirationTime?.toISOString().split("T", 1)[0]
                  }
                />
                {errors.date && (
                  <p className="error-input-message">{errors.date.message}</p>
                )}
              </div>
              <div className="input-container" id="time-input">
                <label htmlFor="time">Time</label>
                <input
                  type="time"
                  id="time"
                  {...register("time")}
                  className={errors.time && "error-input"}
                  onChange={() => {
                    clearErrors("time");
                  }}
                  defaultValue={url?.expirationTime
                    ?.toLocaleTimeString()
                    .slice(0, -3)}
                />
                {errors.time && (
                  <p className="error-input-message">{errors.time.message}</p>
                )}
              </div>
            </div>
            {isAuthenticated && (
              <div className="input-container">
                <label htmlFor="note">Note</label>
                <textarea
                  id="note"
                  {...register("note")}
                  className={errors.note && "error-input"}
                  onChange={() => {
                    clearErrors("note");
                  }}
                  placeholder="Some note to remember"
                  maxLength={500}
                  defaultValue={url?.note}
                />
                {errors.note && (
                  <p className="error-input-message">{errors.note.message}</p>
                )}
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
