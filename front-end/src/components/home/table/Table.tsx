import { TbKey, TbKeyOff } from "react-icons/tb";
import { rows } from "./utils";
import "./Table.css";

function Table() {
  return (
    <div className="table-container">
      <div className="table-text-container">
        <h2 className="title">Improve your experience!</h2>
        <p className="text">
          Expand your possibilities by accessing all advanced features: track
          the history of your links, add notes, manage them as you prefer, and
          monitor their statistics.
        </p>
      </div>
      <table className="home-table">
        <tbody>
          <tr>
            <th className="header">Feature</th>
            <th className="header">
              <TbKey />
              Signed
            </th>
            <th className="header">
              <TbKeyOff />
              Free
            </th>
          </tr>
          {rows.map((row) => {
            return (
              <tr key={row.id}>
                <td>{row.feature}</td>
                <td>{row.signed}</td>
                <td>{row.free}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
