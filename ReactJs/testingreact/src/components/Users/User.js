import React from "react";

const User = () => {
  const [items, setItems] = React.useState([]);
  const loadUsers = () => {
    fetch("https://reqres.in/api/users")
      .then((data) => data.json())
      .then(({ data }) => setItems(data));
  };
  return (
    <div>
      <button onClick={loadUsers}>Fetch Users</button>
      <ul>
        {items.map((item) => {
          return (
            <li key={item.id}>
              {item.first_name} {item.last_name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default User;
