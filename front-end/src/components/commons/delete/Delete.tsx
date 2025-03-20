import "./Delete.css";

interface props {
  submitDelete: (event: React.FormEvent<HTMLFormElement>) => void;
  title: string;
}

const Delete = ({ submitDelete, title }: props) => {
  return (
    <div className="delete-container">
      <h2 className="title">{title}</h2>
      <form onSubmit={submitDelete}>
        <input
          type="password"
          name="password"
          placeholder="Enter the password to confirm"
        />
        <input type="submit" value="Confirm delete" />
      </form>
    </div>
  );
};

export default Delete;
