import ListItem from "../list_item/ListItem";
import "./Container.css";

function HistoryContainer() {
  return (
    <div className="history-container">
      <h2 className="title">History</h2>
      {/* TODO get all datas with API and loop them to show */}
      <div className="history-list">
        <ListItem
          url={{
            longURL:
              "https://www.google.com/search?q=react+modals+with+portals&client=firefox-b-d&sca_esv=4ace2edab23664d2&ei=DxHOZ9i2FKmIi-gPoPPbuQU&ved=0ahUKEwiY-sCegf6LAxUpxAIHHaD5NlcQ4dUDCBA&uact=5&oq=react+modals+with+portals&gs_lp=Egxnd3Mtd2l6LXNlcnAiGXJlYWN0IG1vZGFscyB3aXRoIHBvcnRhbHMyBRAhGKABMgUQIRigAUjJM1ChHVjtMnAEeAGQAQCYAd8BoAHCC6oBBTMuOC4xuAEDyAEA-AEBmAIQoALlC8ICChAAGLADGNYEGEfCAgcQABiABBgTwgIIEAAYExgWGB7CAgoQABgTGBYYChgewgIGEAAYFhgewgIFEAAY7wXCAggQABiABBiiBJgDAIgGAZAGCJIHBTcuOC4xoAeWJw&sclient=gws-wiz-serp",
            shortenURL: "http://192.168.0.113:5173/86255bbf",
            clicks: 111,
            createdTime: new Date().toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
              day: "numeric",
            }),
            expirationTime: new Date().toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
              day: "numeric",
            }),
            lastUpdateTime: new Date().toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
              day: "numeric",
            }),
            note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla non dignissim augue. Proin malesuada sollicitudin dictum. Nulla vel ipsum dictum, faucibus odio eget, cursus ipsum. Sed turpis nibh, maximus in dolor a, dignissim ullamcorper eros. Maecenas ut mattis enim. Etiam vitae dui ante. Mauris aliquet sem non justo congue sagittis ut eu velit. Phasellus interdum congue urna commodo laoreet. Proin sed sapien vel lectus luctus luctus non a lacus. Nulla augue enim, pharetra eget sollicitudin.",
            password: "Password",
            prefix: "CDoctor",
            status: "active",
          }}
        />
        <ListItem
          url={{
            longURL:
              "https://www.google.com/search?q=react+modals+with+portals&client=firefox-b-d&sca_esv=4ace2edab23664d2&ei=DxHOZ9i2FKmIi-gPoPPbuQU&ved=0ahUKEwiY-sCegf6LAxUpxAIHHaD5NlcQ4dUDCBA&uact=5&oq=react+modals+with+portals&gs_lp=Egxnd3Mtd2l6LXNlcnAiGXJlYWN0IG1vZGFscyB3aXRoIHBvcnRhbHMyBRAhGKABMgUQIRigAUjJM1ChHVjtMnAEeAGQAQCYAd8BoAHCC6oBBTMuOC4xuAEDyAEA-AEBmAIQoALlC8ICChAAGLADGNYEGEfCAgcQABiABBgTwgIIEAAYExgWGB7CAgoQABgTGBYYChgewgIGEAAYFhgewgIFEAAY7wXCAggQABiABBiiBJgDAIgGAZAGCJIHBTcuOC4xoAeWJw&sclient=gws-wiz-serp",
            shortenURL: "http://192.168.0.113:5173/86255bbf",
            clicks: 111,
            createdTime: new Date().toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
              day: "numeric",
            }),
            expirationTime: new Date().toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
              day: "numeric",
            }),
            lastUpdateTime: new Date().toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
              day: "numeric",
            }),
            note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla non dignissim augue. Proin malesuada sollicitudin dictum. Nulla vel ipsum dictum, faucibus odio eget, cursus ipsum. Sed turpis nibh, maximus in dolor a, dignissim ullamcorper eros. Maecenas ut mattis enim. Etiam vitae dui ante. Mauris aliquet sem non justo congue sagittis ut eu velit. Phasellus interdum congue urna commodo laoreet. Proin sed sapien vel lectus luctus luctus non a lacus. Nulla augue enim, pharetra eget sollicitudin.",
            password: "Password",
            prefix: "CDoctor",
            status: "active",
          }}
        />
      </div>
    </div>
  );
}

export default HistoryContainer;
