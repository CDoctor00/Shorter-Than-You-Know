import { useContext } from "react";
import { UserContext } from "../../../../contexts/user/Context";
import { ModalContext } from "../../../../contexts/modal/Context";
import ProfileCard from "../card/Card";
import { MdInfoOutline } from "react-icons/md";
import "./Bar.css";

function ProfileBar() {
  const { user } = useContext(UserContext);
  const { toggleModal, setChildren } = useContext(ModalContext);

  if (!user) {
    return;
  }

  const hasName = !(user.name === undefined && user.surname === undefined);

  const getTitle = (): string => {
    let title = "";

    if (user.name) {
      title = user.name;
    }

    if (user.surname) {
      if (title === "") {
        title = user.surname;
      } else {
        title = `${title} ${user.surname}`;
      }
    }

    if (title === "") {
      title = user.email;
    }

    return title;
  };

  const openUserInfo = () => {
    setChildren(<ProfileCard />);
    toggleModal();
  };

  return (
    <div className="profile-bar-container">
      <div className="title-container">
        <h2 className="title">{getTitle()}</h2>
        <MdInfoOutline className="icon" onClick={openUserInfo} />
      </div>
      {hasName && <h3 className="subtitle">{`(${user.email})`}</h3>}
    </div>
  );
}

export default ProfileBar;
