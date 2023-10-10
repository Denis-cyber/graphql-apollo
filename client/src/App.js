import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_USERS, GET_ONE_USER } from "./query/user";
import { CREATE_USER } from "./mutations/user";

import "./App.css";

function App() {
  const { data, loading, refetch } = useQuery(GET_ALL_USERS);
  const { data: oneUser } = useQuery(GET_ONE_USER, {
    variables: {
      id: 0,
    },
  });
  const [newUser] = useMutation(CREATE_USER);

  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");

  console.log(oneUser);

  const addUser = useCallback(
    (e) => {
      e.preventDefault();

      newUser({
        variables: {
          input: {
            username,
            age,
          },
        },
      }).then(({ data }) => {
        console.log(data);
        setUsername("");
        setAge("");
      });
    },
    [age, newUser, username]
  );

  const getAll = useCallback(
    (e) => {
      e.preventDefault();
      refetch();
    },
    [refetch]
  );

  useEffect(() => {
    if (!loading) {
      setUsers(data.getAllUsers);
    }
  }, [data, loading]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <form>
        <input value={username} onChange={(e) => setUsername(e.target.value)} type='text' />
        <input value={age} onChange={(e) => setAge(+e.target.value)} type='number' />
        <div className='btns'>
          <button onClick={(e) => addUser(e)}>Создать</button>
          <button onClick={(e) => getAll(e)}>Получить</button>
        </div>
      </form>
      <div>
        {users.map((user) => (
          <div className='user' key={user.id}>
            {user.id}. {user.username} {user.age}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
