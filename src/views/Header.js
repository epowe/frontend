import React, { useEffect, useContext, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import HeaderLogoI from "../images/HeaderLogo.png";
import "../App.css";
import { removeCookieToken } from "../Auth";
import { API } from "../API";
const Header = ({ isLogin }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userProfile, setUserProfile] = useState("");

  const onClickLogo = () => {
    if (localStorage.getItem("isLogged")) {
      if (window.location.pathname === "/register") {
        navigate("/register");
      } else {
        navigate("/interview");
      }
    } else {
      navigate("/");
      localStorage.clear();
      console.log("로그인된 상태가 아니여서 로그인 페이지로 이동.");
    }
  };

  const onLogout = () => {
    //로그아웃 처리하기
    removeCookieToken();
    localStorage.clear();
    console.log("로그아웃 되었습니다.");
    navigate("/");
  };

  const getUserInfo = async () => {
    var result = await API.authAfterLogin();
    if (result) {
      console.log("헤더에 사용자 데이터 잘 들어옴");
      setUserEmail(result.email);
      setUserProfile(result.picture);
      setUserName(result.username);
    } else {
      console.log("사용자 데이터 잘 들어오지 않음");
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <>
      <Container>
        <LogoContainer>
          <HeaderLogoImage src={HeaderLogoI} onClick={onClickLogo} />
          <HeaderLogo onClick={onClickLogo}>2-POW</HeaderLogo>
        </LogoContainer>
        {localStorage.getItem("isLogged") &&
        (window.location.pathname === "/") !== true ? (
          <SmallContainer>
            <SmallButton onClick={onLogout}>로그아웃</SmallButton>
            <ProfileContainer onClick={() => navigate("/feedback")}>
              <Image src={userProfile} />
              <Span>{userName}</Span>
            </ProfileContainer>
          </SmallContainer>
        ) : (
          ""
        )}
      </Container>
      <Line />
    </>
  );
};

const Container = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.2rem;
  width: 100vw;
  height: 5rem;
  background-color: #ffffff;
  overflow: hidden;
  z-index: 1;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HeaderLogoImage = styled.img`
  width: 3rem;
  height: 3rem;
  cursor: pointer;
`;

const HeaderLogo = styled.div`
  position: relative;
  display: inline-block;
  margin: 0.8rem;
  text-align: center;
  font-family: Montserrat-Bold;
  display: inline-block;
  font-size: 1.4rem;
  color: #6c63ff;
  cursor: pointer;
`;

const SmallContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SmallButton = styled.button`
  border: none;
  border-radius: 50px;
  color: #ffffff;
  background: #6c63ff;
  height: 2rem;
  width: 5rem;
  font-family: SCDream-Regular;
  font-size: 0.7rem;
  padding: 0.5rem;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-contents: space-evenly;
  margin: 0 1rem;
  cursor: pointer;
`;

const Image = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  margin: 0 0.5rem;
`;

const Span = styled.span`
  font-family: SCDream-Regular;
  font-size: 0.8rem;
`;

const Line = styled.div`
  position: fixed;
  top: 5rem;
  left: 12rem;
  right: 0;
  height: 0.08rem;
  width: 90vw;
  background-color: #e0e0e0;
`;

export default Header;
