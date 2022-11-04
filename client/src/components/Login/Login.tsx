import React, { FC, useEffect, useState } from "react";
import { Form, Input, Button, Table, Row, Col } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const URL = "https://97cpcf4gng.execute-api.ap-southeast-1.amazonaws.com/dev";
type ContactType = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
};
const initialData: ContactType[] = [];

const Login: FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [msg, setMsg] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [updateId, setUpdateId] = useState(0);
  const [contactsList, setContactsList] = useState(initialData);
  const [fetchUrl, setFetchUrl] = useState(true);
  const [form] = Form.useForm();
  const onLogin = () => {
    const data = { email: email, password: password };
    axios
      .post(`${URL}/auth/login`, data)
      .then((res) => {
        console.log(res);
        setToken(res.data.idToken);
        setEmail("");
        setPassword("");
        setMsg("")
        form.setFieldsValue({
          email: "",
          password: "",
        });
      })
      .catch((err) => {
        console.log(err);
        axios
          .post(`${URL}/auth/register`, data)
          .then(() => {
            setMsg(
              "Signup successfully, please verify by the code sent to your email"
            );
            setEmail("");
            setPassword("");
            form.setFieldsValue({
              email: "",
              password: "",
            });
            navigate("/verify");
          })
          .catch((err) => {
            setPassword("");
            form.setFieldsValue({
              password: "",
            });
            setMsg(err.response.data);
          });
      });
  };

  const handleSubmit = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const body = {
      firstname: firstname,
      lastname: lastname,
      email: contactEmail,
    };
    if (updateId !== 0) {
      axios
        .put(`${URL}/contacts/${updateId}`, JSON.stringify(body), config)
        .then(() => setFetchUrl(true))
        .catch((err) => {
          setMsg(err.message);
        });
    } else {
      axios
        .post(`${URL}/contacts`, JSON.stringify(body), config)
        .then((res) => setFetchUrl(true))
        .catch((err) => setMsg(err.message));
    }
    setUpdateId(0);
    form.setFieldsValue({
      firstname: "",
      lastname: "",
      contactEmail: "",
    });
  };
  const handleDelete = (id: number) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .delete(`${URL}/contacts/${id}`, config)
      .then((res) => {
        setFetchUrl(true);
      })
      .catch((err) => setMsg(err.message));
  };
  const handleEdit = (user: ContactType) => {
    setUpdateId(user.id);
    form.setFieldsValue({
      firstname: user.firstname,
      lastname: user.lastname,
      contactEmail: user.email,
    });
    setFirstname(user.firstname);
    setLastname(user.lastname);
    setEmail(user.email);
  };
  const ContactForm = (
    <Form form={form} name="contact" autoComplete="off">
      <Form.Item label="First name" name="firstname">
        <Input
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Last name" name="lastname">
        <Input value={lastname} onChange={(e) => setLastname(e.target.value)} />
      </Form.Item>
      <Form.Item label="Email" name="contactEmail">
        <Input
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Form.Item>
      <span></span>
      <span
        style={{
          color: "red",
        }}
      >
        {msg}
      </span>
    </Form>
  );
  const LoginForm = (
    <Form form={form} name="basic" autoComplete="off">
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" onClick={onLogin}>
          Submit
        </Button>
      </Form.Item>
      <span></span>
      <span
        style={{
          color: "red",
        }}
      >
        {msg}
      </span>
    </Form>
  );

  const tableColumns: ColumnsType<ContactType> = [
    {
      title: "Fist name",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Last name",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Actions",
      render: (record: ContactType) => (
        <>
          {" "}
          <Button onClick={() => handleDelete(record.id)}>Delete</Button>
          <Button onClick={() => handleEdit(record)} type="primary">
            Edit
          </Button>
        </>
      ),
    },
  ];

  const dataTable = (
    <Table
      columns={tableColumns}
      dataSource={contactsList}
      rowKey={(record) => record.id}
    />
  );

  let display;
  if (token) {
    display = (
      <>
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Col span={8}>{ContactForm}</Col>
        </Row>

        {dataTable}
      </>
    );
  } else {
    display = (
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Col span={8}>{LoginForm}</Col>
      </Row>
    );
  }
  useEffect(() => {
    if (fetchUrl) {
      axios.get(`${URL}/contacts`).then((res) => {
        setContactsList(res.data);
        setFetchUrl(false);
      });
    }
  }, [fetchUrl]);
  return (
    <div
      style={{
        padding: "32px",
      }}
    >
      {display}
    </div>
  );
};
export default Login;
