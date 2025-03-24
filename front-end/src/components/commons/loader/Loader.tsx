import "./Loader.css";

function Loader() {
  return (
    <div className="hourglassBackground">
      <div className="hourglassContainer">
        <div className="hourglassCurves" />
        <div className="hourglassCapTop" />
        <div className="hourglassGlassTop" />
        <div className="hourglassSand" />
        <div className="hourglassSandStream" />
        <div className="hourglassCapBottom" />
        <div className="hourglassGlass" />
      </div>
    </div>
  );
}

export default Loader;
