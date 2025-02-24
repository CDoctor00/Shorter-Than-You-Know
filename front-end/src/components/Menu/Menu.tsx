import "./Menu.css";

function Menu({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="menu-container">
      <div className={isVisible ? "menu show" : "menu hide"}>
        <ul>
          <li />
          <li />
          <li />
        </ul>
      </div>
    </div>
  );
}

export default Menu;
