import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../styles/Button';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, setRefresh } from '../../modules/members';
import cookie from 'react-cookies';

/*
    회원가입 또는 로그인 폼
 */

const textMap = {
  login: '로그인',
  register: '회원가입',
};

const AuthFormBlock = styled.div`
  h3 {
    margin: 0;
    margin-bottom: 1rem;
  }
`;

/*
    스타일링 된 인풋
*/
const StyledInput = styled.input`
  font-size: 1rem;
  border: none;
  padding-bottom: 0.5rem;
  outline: none;
  width: 100%;
  &:focus {
    color: $oc-teal-7;
  }
  & + & {
    margin-top: 1rem;
  }
`;

const Footer = styled.div`
  margin-top: 2rem;
  text-align: right;
  a {
    text-decoration: underline;
    &:hover {
    }
  }
`;

const ButtonWithMarginTop = styled(Button)`
  margin-top: 1rem;
`;

const AuthForm = ({ type }) => {
  const text = textMap[type];
  const navigate = useNavigate();

  //const access = useSelector((state) => state.token.access);
  const dispatch = useDispatch();
  const onLogin = useCallback(
    (accessToken, userId, userNo) => dispatch(login(accessToken, userId, userNo)),
    [dispatch],
  );
  const onLogout = useCallback(() => dispatch(logout(), [dispatch]));
  const onSetRefresh = useCallback(
    (refreshToken) => dispatch(setRefresh(refreshToken)),
    [dispatch],
  );
  const [addressList1, setAddressList1] = useState([]);
  const [addressList2, setAddressList2] = useState([]);
  const [idDuplicateChecked, setIdDuplicateChecked] = useState(false);
  const [idDuplicateMessage, setIdDuplicateMessage] = useState(false);
  const [isIdSaveChecked, setIdSaveChecked] = useState(!cookie.load('userId') ? true:false);
  const [isPwView, setIsPwView] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if(searchParams.get('error')){
      alert("로그인 후 이용 가능하신 서비스입니다. 먼저 로그인을 해 주세요.");
    }
    if(type=="register"){
      axios({
        method: 'get',
        url: '/auth/getAddress1List',
      }).then((response) => {
        response.data.forEach((item) => {
          setAddressList1((prev) => {
            return [...prev, item];
          });
        });
      });
    }else if(type==="login"){
      setId(cookie.load('userId') ? cookie.load('userId'):"");
    }
  }, []);
  function updateAddressList2() {
    axios({
      method: 'get',
      url: '/auth/getAddress2List',
      params: {
        address1: address1.current.value,
      },
    }).then((response) => {
      setAddressList2([]);
      response.data.forEach((item) => {
        setAddressList2((prev) => {
          return [...prev, item];
        });
      });
    });
  }

  function handleId(e){
    setId(e.target.value);
    if(type==="register"){
      //아이디 중복 체크
      axios({
        method:'get',
        url:'/auth/isMember',
        params:{
          userId: id
        }
      }).then((response)=>{
        console.log(response);
        setIdDuplicateChecked(response.data);
        setIdDuplicateMessage(response.data ? "중복된 아이디가 있습니다." : "중복된 아이디가 없습니다.");
      });
    }
  }

  function doRegister(e) {
    //e.preventDefault();

    //또는 axios.post("/auth/join", null, {params : {~}})
    // 두번째 인자가 data긴 한데, 들어가는 방식이 Query 방식이 아님.
    //따라서 쿼리방식의 '@RequestParam'을 쓰려면 이하 또는 세번쨰 인자 써야 함.
    if(!idDuplicateChecked){
      axios({
        method: 'post',
        url: '/auth/member',
        params: {
          userId: id,
          pw: pwRef.current.value,
          userNickName: nickNameRef.current.value,
          address1 : address1.current.value,
          address2 : address2.current.value
        },
        timeout: 5000,
        //responseType:"json" // or "stream"
      })
        .then(function (response) {
          navigate('/login');
          //return JSON.parse(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  function doLogin(e) {
    if(isIdSaveChecked){
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 60); // 아이디 1시간 기억
      cookie.save('userId', id,{
        path : "/",
        expires
      })
    }else{
      cookie.remove('userId', {path : '/'});
    }
    axios({
      method: 'get',
      url: '/auth/login',
      params: {
        userId: id,
        pw: pwRef.current.value,
      },
      timeout: 5000,
    })
      .then(function (response) {
        let refreshToken = cookie.load('CodedRefreshToken');
        refreshToken = refreshToken.substr(
          'Bearer '.length,
          refreshToken.length,
        );
        onLogin(response.data.accessToken, response.data.userId, response.data.userNo);
        onSetRefresh(refreshToken);
        navigate("/");
      })
      .catch(function (e) {
        console.log(e);
        onLogout();
      });
  }



  function doRefrshTest() {
    axios({
      type: 'GET',
      url: '/auth/refresh',
    })
      .then(function (response) {
        //엑세스 토큰 설정
        onLogin(response.data);
        let refreshToken = cookie.load('CodedRefreshToken');
        refreshToken = refreshToken.substr(
          'Bearer '.length,
          refreshToken.length,
        );
        onSetRefresh(refreshToken);
      })
      .catch(function (e) {
        console.log(e);
        onLogout();
        //history.go('/login');
      });
  }

  function doKakaoLogin() {
    axios({
      method: 'get',
      url: '/login/oauth2/kakao/codeInfo',
    })
      .then(function (response) {
        const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${response.data.client_id}&redirect_uri=${response.data.redirect_uri}&response_type=code`;
        window.location.href = KAKAO_AUTH_URL;
      })
      .catch(function (e) {
        console.log(e);
      });
  }

  function doNaverLogin() {
    axios({
      method: 'get',
      url: '/login/oauth2/naver/codeInfo',
    })
      .then(function (response) {
        const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${response.data.client_id}&redirect_uri=${response.data.redirect_uri}&state=test`;
        window.location.href = NAVER_AUTH_URL;
      })
      .catch(function (e) {
        console.log(e);
      });
  }

  const nickNameRef = useRef(null);
  const [id, setId] = useState("");
  const pwRef = useRef(null);
  const pwConfirmRef = useRef(null);
  const address1 = useRef(null);
  const address2 = useRef(null);

  return (
    <AuthFormBlock>
      <h3>{text}</h3>
      {type === 'register' && (
        <StyledInput
          type="text"
          autoComplete="name"
          name="userNickName"
          placeholder="닉네임"
          ref={nickNameRef}
        />
      )}
      <StyledInput
        type="text"
        autoComplete="username"
        name="userId"
        placeholder="아이디"
        value={id}
        onChange={handleId}
      />
      <div>{idDuplicateMessage}</div>
      <StyledInput
        autoComplete="new-password"
        name="pw"
        placeholder="비밀번호"
        type={isPwView ? "text" : "password"}
        ref={pwRef}
      />
      {type === 'login' && (
        <>
          <button onClick={()=>{setIsPwView((prev) => {return !prev})}}>pw보기</button>
          <input type="checkbox" checked={isIdSaveChecked} onChange={()=>{setIdSaveChecked((prev)=>{return !prev})}} />
          <label>아이디 기억</label>
        </>
      )}
      {type === 'register' && (
        <>
          <StyledInput
            autoComplete="new-password"
            name="pwConfirm"
            placeholder="비밀번호 확인"
            type="password"
            ref={pwConfirmRef}
          />
          <select ref={address1} onChange={updateAddressList2}>
            {addressList1.map((item, index) => {
              return <option key={index}>{item}</option>;
            })}
          </select>
          <select ref={address2}>
            {addressList2.map((item, index) => {
              return <option key={index}>{item}</option>;
            })}
          </select>
        </>
      )}
      {/* {type === 'login' && (
        <>
          <button onClick={doKakaoLogin}>카카오 로그인</button>
          <button onClick={doNaverLogin}>네이버 로그인</button>
          <button onClick={doRefrshTest}>리프레시 테스트</button>
        </>
      )} */}
      <ButtonWithMarginTop
        cyan={true}
        fullWidth
        onClick={type === 'register' ? doRegister : doLogin}
      >
        {text}
      </ButtonWithMarginTop>
      <Footer>
        {type === 'login' ? (
          <Link to="/signup">회원가입</Link>
        ) : (
          <Link to="/login">로그인</Link>
        )}
      </Footer>
    </AuthFormBlock>
  );
};

export default AuthForm;
