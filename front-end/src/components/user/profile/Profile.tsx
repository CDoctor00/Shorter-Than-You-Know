import "./Profile.css";

interface props {
  name: string;
  surname: string;
  email: string;
}

function Profile(props: props) {
  const hasName = !(props.name === undefined);

  return (
    <div className="profile-container">
      <h2 className="profile-title">
        {hasName ? `${props.name} ${props.surname}` : props.email}
      </h2>
      {hasName && <h3 className="profile-subtitle">{`(${props.email})`}</h3>}
    </div>
  );
}

export default Profile;
