import { FC, useState } from "react";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const URL = "https://97cpcf4gng.execute-api.ap-southeast-1.amazonaws.com/dev";
const Verify: FC = () => {
  const navigate = useNavigate();
  const [verifyEmail, setVerifyEmail] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [form] = Form.useForm();
  const onVerify = () => {
    const data = { email: verifyEmail, code: code };
    console.log(data);
    axios
      .post(`${URL}/auth/verify`, data)
      .then((res) => {
        console.log(res);
        setMsg("Account verified, you can log in now");
        navigate("/");
      })
      .catch((err) => setMsg(err.message));
    form.setFieldsValue({
      email: "",
      code: "",
    });
  };

  return (
    <div
      style={{
        padding: "32px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Form form={form} name="verify" autoComplete="off">
        <h1>Verify account</h1>
        <Form.Item
          label="Email"
          name="verifyEmail"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            value={verifyEmail}
            onChange={(e) => setVerifyEmail(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Code"
          name="code"
          rules={[{ required: true, message: "Please input your code!" }]}
        >
          <Input value={code} onChange={(e) => setCode(e.target.value)} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" onClick={onVerify}>
            Verify
          </Button>
        </Form.Item>
        <span
          style={{
            color: "red",
          }}
        >
          {msg}
        </span>
      </Form>
    </div>
  );
};
export default Verify;
