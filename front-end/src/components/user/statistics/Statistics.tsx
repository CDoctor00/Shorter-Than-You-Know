import { FaCheckCircle, FaLink, FaMousePointer } from "react-icons/fa";
import "./Statistics.css";

interface props {
  clicks: number;
  totalLinks: number;
  activeLinks: number;
}

function Statistics(props: props) {
  return (
    <div className="statistics-container">
      <h2 className="statistics-title">Statistics</h2>
      <div className="statistics-card">
        <div className="item">
          <FaLink className="stats-icon" />
          <p className="number">{props.totalLinks}</p>
          <p className="description">Total Links</p>
        </div>
        <div className="item">
          <FaMousePointer className="stats-icon" />
          <p className="number">{props.clicks}</p>
          <p className="description">Total Clicks</p>
        </div>
        <div className="item">
          <FaCheckCircle className="stats-icon" />
          <p className="number">{props.activeLinks}</p>
          <p className="description">Active Links</p>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
