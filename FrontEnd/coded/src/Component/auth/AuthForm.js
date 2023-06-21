import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../styles/Button';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, setRefresh } from '../../modules/Redux/members';
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

  const nickNameRef = useRef(null);
  const [nickNameRegexMessage, setNickNameRegexMessage] = useState("");
  const [id, setId] = useState("");
  const idRef = useRef(null);
  const [idDuplicateChecked, setIdDuplicateChecked] = useState(false);
  const [idDuplicateMessage, setIdDuplicateMessage] = useState("");
  let idDupTimer;
  const pwRef = useRef(null);
  const pwConfirmRef = useRef(null);
  const [pwConfirmCheck, setPwConfirmCheck] = useState(false);
  const emailRef = useRef(null);
  const [emailDuplicateChecked, setEmailDuplicateChecked] = useState(false);
  const [emailDuplicateMessage, setEmailDuplicateMessage] = useState("");
  let emailDupTimer;
  const address1 = useRef(null);
  const address2 = useRef(null);
  const [registerPassCheck, setRegisterPassCheck] = useState(false);

  const [addressList1, setAddressList1] = useState([]);
  const [addressList2, setAddressList2] = useState([]);

  const [isIdSaveChecked, setIdSaveChecked] = useState(!cookie.load('userId') ? true:false);
  const [isPwView, setIsPwView] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const regexId= /^[a-z0-9_]{7,13}$/;
  const regexNickName = /^[가-힣A-Za-z0-9_]{1,8}$/;
  const regexEmail = /^(?=.{1,30}$)[^@\s]+@[^@\s]+\.[^@\s]+$/;

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
      }).catch((error)=>{
        console.log(error);
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
    }).catch((error)=>{
      console.log(error);
    });
  }

  useEffect(()=>{
    if(type=="register"){
      if(idDuplicateChecked || emailDuplicateChecked || !regexId.test(id) || !regexEmail.test(emailRef.current.value) || !regexNickName.test(nickNameRef.current.value) || pwRef.current.value !== pwConfirmRef.current.value || !address1.current.value || !address2.current.value){
        setRegisterPassCheck(false);
      }else{
        setRegisterPassCheck(true);
      }
    }

    // if(!id && idDuplicateChecked && !emailRef.current.value && emailDuplicateChecked && !regexId.test(id) && !regexEmail.test(emailRef.current.value) && !nickNameRef.current.value && !regexNickName.test(nickNameRef.current.value) && !pwConfirmCheck && !address1.current.value && !address2.current.value){
    //   setRegisterPassCheck(false);
    // }else{
    //   setRegisterPassCheck(true);
    // }
  });

  function handleId(e){
    setId(e.target.value);
    if(type==="register"){
      //아이디 중복 체크
      if(!idDupTimer){
        idDupTimer = setTimeout(()=>{
          idDupTimer = null;
          axios({
          method:'get',
          url:'/auth/isMember',
          params:{
            userId: idRef.current.value
          }
        }).then((response)=>{
          setIdDuplicateChecked(response.data);
          if(response.data){
            setIdDuplicateMessage("중복된 아이디가 있습니다.");
          }
          else if(!regexId.test(idRef.current.value)){
            setIdDuplicateMessage("사용 불가능한 아이디 형식입니다.");
          }else{
            setIdDuplicateMessage("사용 가능합니다.");
          }
        }).catch((error)=>{
          console.log(error);
        })}, 200);
      }
    }
  }

  function handlePw(e){
    if(pwRef.current.value === pwConfirmRef.current.value){
      setPwConfirmCheck(true);
    }else{
      setPwConfirmCheck(false);
    }
  }

  function handleEmail(e){
    //setEmail(e.target.value);
    if(!emailDupTimer){
      emailDupTimer = setTimeout(()=>{
        emailDupTimer = null;
        axios({
          method:'get',
          url:'/auth/isMemberByEmail',
          params:{
            email:emailRef.current.value
          }
        }).then((response)=>{
          setEmailDuplicateChecked(response.data);
          if(response.data){
            setEmailDuplicateMessage("중복된 이메일이 있습니다.");
          }else if(!regexEmail.test(emailRef.current.value)){
            setEmailDuplicateMessage("이메일 형식을 지켜주셔야 합니다.");
          }else{
            setEmailDuplicateMessage("사용 가능합니다.");
          }
        }).catch((error)=>{
          console.log(error);
        });
      }, 200);
    }
  }

  function handleNickName(e){
    if(!regexNickName.test(nickNameRef.current.value)){
      setNickNameRegexMessage("사용할 수 없는 닉네임 형식입니다.");
    }else{
      setNickNameRegexMessage("사용 가능합니다.");
    }
  }

  function doRegister(e) {

    if(idDuplicateChecked){
      alert("중복된 아이디가 있습니다. 아이디를 변경해주세요.");
    }else if(emailDuplicateChecked){
      alert("해당 이메일의 계정이 있습니다.");
    }else if(!regexId.test(id)){
      alert("사용할 수 없는 아이디입니다.");
    }else if(!regexEmail.test(emailRef.current.value)){
      alert("사용할 수 없는 이메일입니다.");
    }else if(!regexNickName.test(nickNameRef.current.value)){
      alert("사용할 수 없는 닉네임입니다.");
    }else if(pwRef.current.value !== pwConfirmRef.current.value){
      alert("비밀번호들이 일치하지 않습니다.");
    }else if(!address1.current.value || !address2.current.value){
      alert("주소를 입력해주셔야 합니다.");
    }else{
      axios({
        method: 'post',
        url: '/auth/member',
        params: {
          userId: idRef.current.value,
          pw: pwRef.current.value,
          userNickName: nickNameRef.current.value,
          email:emailRef.current.value,
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

  function doGoogleLogin(){
    axios({
      method: 'get',
      url: '/login/oauth2/google/codeInfo',
    }).then((response)=>{
      console.log(response);
      const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${response.data.client_id}&redirect_uri=${response.data.redirect_uri}&response_type=code&scope=profile`;
      window.location.href = GOOGLE_AUTH_URL;
    }).catch((error)=>{
      console.log(error);
    })
  }

  return (
    <AuthFormBlock>
      <h3>{text}</h3>
      {type === 'register' && (
        <>
          <StyledInput
            type="text"
            autoComplete="name"
            name="userNickName"
            placeholder="닉네임"
            ref={nickNameRef}
            // value={nickName}
            onChange={handleNickName}
          />
          <div>{nickNameRegexMessage}</div>
        </>
      )}
      <StyledInput
        type="text"
        autoComplete="username"
        name="userId"
        placeholder="아이디"
        ref={idRef}
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
          <div>
            <button onClick={()=>{setIsPwView((prev) => {return !prev})}}>pw보기</button>
          </div>
          <div>
            <input type="checkbox" checked={isIdSaveChecked} onChange={()=>{setIdSaveChecked((prev)=>{return !prev})}} />
            <label>아이디 기억</label>
          </div>
          <div>
            <Link to="/idSearch">아이디 찾기</Link>
            <br/>
            <Link to="/pwSearch">비밀번호 재발급</Link>
          </div>
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
            onChange={handlePw}
          />
          {pwConfirmCheck ? (<div>비밀번호가 일치합니다.</div>) : (<div>비밀번호가 일치하지 않습니다.</div>)}
          <StyledInput
            autoComplete='email'
            name="e-mail"
            placeholder='e-mail'
            type="text"
            //value={email}
            ref={emailRef}
            onChange={handleEmail}
          />
          <div>{emailDuplicateMessage}</div>
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
      {type === 'login' && (
        <>
          <button onClick={doKakaoLogin}>카카오 로그인</button>
          <button onClick={doNaverLogin}>네이버 로그인</button>
          <button onClick={doGoogleLogin}>구글 로그인</button>
        </>
      )}
      <ButtonWithMarginTop
        cyan={true}
        fullWidth
        onClick={type === 'register' ? doRegister : doLogin}
      >
        {text}
      </ButtonWithMarginTop>
      {
        type==="register" && (registerPassCheck ? (<div>회원가입이 가능합니다.</div>):(<div>모든 요소를 기입하시고 조건을 통과해주셔야 합니다.</div>))
      }
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