import React, { FC, useEffect, useState } from "react";
import axios from "axios";
type Props = {};
type ContactType = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
};
const initialData: ContactType[] = [];
const URL =
  "https://qzvammsn2k.execute-api.ap-southeast-1.amazonaws.com/dev/contacts";
const Poc: FC<Props> = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [updateId, setUpdateId] = useState(0);
  const [contactsList, setContactsList] = useState(initialData);
  const [fetchUrl, setFetchUrl] = useState(true);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = { firstname: firstname, lastname: lastname, email: email };
    if (updateId !== 0) {
      axios
        .put(`${URL}/${updateId}`, JSON.stringify(body))
        .then(() => setFetchUrl(true));
    } else {
      axios.post(URL, JSON.stringify(body)).then((res) => setFetchUrl(true));
    }

    setEmail("");
    setLastname("");
    setFirstname("");
  };
  const handleDelete = (id: number) => {
    axios.delete(`${URL}/${id}`).then((res) => {
      setFetchUrl(true);
    });
  };
  const handleEdit = (user: ContactType) => {
    setUpdateId(user.id);
    setEmail(user.email);
    setLastname(user.lastname);
    setFirstname(user.firstname);
  };
  let render;
  if (contactsList) {
    // console.log(contactsList);
    render = contactsList.map((user: ContactType) => (
      <div key={user.id}>
        <li>{user.email}</li>
        <button onClick={() => handleEdit(user)}>edit</button>
        <button onClick={() => handleDelete(user.id)}>delete</button>
      </div>
    ));
  }
  useEffect(() => {
    if (fetchUrl) {
      axios.get(URL).then((res) => {
        setContactsList(res.data);
        setFetchUrl(false);
      });
    }
  }, [fetchUrl]);
  return (
    <div
      style={{
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        width: "500px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <label>First name</label>
        <input
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <label>Last name</label>
        <input value={lastname} onChange={(e) => setLastname(e.target.value)} />
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      {render}
    </div>
  );
};

export default Poc;
