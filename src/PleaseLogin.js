import { Link } from "react-router-dom";
import styled from "styled-components";

function PleaseLogin() {
  return (
    <Cover>
      <h1>게시물 작성을 위해서는</h1>
      <h1>로그인을 해주세요!</h1>
      <Link
        to="/login"
        style={{
          display: "contents",
        }}
      >
        <LoginBtn>로그인</LoginBtn>
      </Link>
    </Cover>
  );
}

const Cover = styled.div`
  text-align: center;
`;

const LoginBtn = styled.button`
  background-color: deepskyblue;
  color: white;
  width: 300px;
  height: 50px;
  border-radius: 20px;
  border: none;
  font-size: 25px;
  font-weight: bold;
`;

export default PleaseLogin;
