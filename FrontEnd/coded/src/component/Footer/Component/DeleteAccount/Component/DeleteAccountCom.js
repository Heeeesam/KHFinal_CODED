import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import './DeleteAccountCom.scss';
import ChangePwModal from '../../../../Profile/component/ChangePwModal';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../../../modules/Redux/members';

const DeleteAccountCom = ({ toggleChangePwModal }) => {
  const accessToken = useSelector((state) => state.member.access);
  const dispatch = useDispatch();
  const onLogout = useCallback(() => {
    dispatch(logout(), [dispatch]);
  });

  const [password, setPassword] = useState('');
  const navi = useNavigate();

  // 입력한 비밀번호를 객체에 저장
  const handleInput = (e) => {
    const { name, value } = e.target;
    setPassword(value);
  };

  const removeAccount = () => {
    if (accessToken) {
      if (confirm('정말로 회원을 탈퇴하시겠습니까?')) {
        axios({
          url: '/auth/deleteMemberWithoutId',
          method: 'delete',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            checkPw: password,
          },
        })
          .then((resp) => {
            if (resp.data > 0) {
              onLogout();
              alert('회원 탈퇴가 완료되었습니다.');
              navi('/');
            } else {
              alert('비밀번호가 일치하지 않습니다.');
              return;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

  return (
    <div className="DeleteAccountComWrapper">
      <div className="mainWrapper">
        <div className="subWrapper">
          <div className="innerWrapper" onClick={(e) => e.stopPropagation()}>
            <button className="closeBtn" onClick={toggleChangePwModal}>
              x
            </button>
            <div className="blankWrapper1"></div>
            <div className="infoWrapper">
              <div className="iconLayout">
                <svg
                  className="icon"
                  height="150"
                  viewBox="0 0 20 20"
                  width="150"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 4C12.4646 4 13.8627 5.5736 14.066 7.47399L14.1282 7.47399C15.7143 7.47399 17 8.71103 17 10.237C17 11.763 15.7143 13 14.1282 13L12.626 12.9993C12.6427 13.0492 12.6518 13.1027 12.6518 13.1583C12.6518 13.4344 12.428 13.6583 12.1518 13.6583C11.8757 13.6583 11.6518 13.4344 11.6518 13.1583C11.6518 13.1027 11.6609 13.0492 11.6776 12.9993L7.441 12.999L5.94503 15.7454C5.81287 15.9879 5.50918 16.0773 5.26672 15.9451C5.05119 15.8277 4.95659 15.5747 5.03105 15.3496L5.06699 15.2668L6.302 12.999L5.87179 13C4.28575 13 3 11.763 3 10.237C3 8.71103 4.28575 7.47399 5.87181 7.47399L5.93399 7.47399C6.13851 5.56111 7.53544 4 10 4ZM11.5 15C11.7761 15 12 15.2239 12 15.5C12 15.7761 11.7761 16 11.5 16C11.2239 16 11 15.7761 11 15.5C11 15.2239 11.2239 15 11.5 15ZM9.30172 14.0602C9.51724 14.176 9.61184 14.4253 9.53738 14.6471L9.50144 14.7287L8.93911 15.743C8.80696 15.9819 8.50327 16.0701 8.2608 15.9398C8.04528 15.824 7.95068 15.5747 8.02514 15.3529L8.06107 15.2713L8.62341 14.257C8.75556 14.0181 9.05925 13.9299 9.30172 14.0602ZM13.5 14C13.7761 14 14 14.2239 14 14.5C14 14.7761 13.7761 15 13.5 15C13.2239 15 13 14.7761 13 14.5C13 14.2239 13.2239 14 13.5 14ZM10 5C8.35056 5 6.9129 6.2703 6.9129 8.02495C6.9129 8.30297 6.65891 8.52113 6.36808 8.52112L5.81818 8.5211C4.81403 8.5211 4 9.29988 4 10.2606C4 11.2212 4.81403 12 5.81818 12H14.1818C15.186 12 16 11.2212 16 10.2606C16 9.29988 15.186 8.5211 14.1818 8.5211L13.6319 8.52112C13.3411 8.52113 13.0871 8.30297 13.0871 8.02495C13.0871 6.24779 11.6494 5 10 5Z"
                    fill="#ffffff"
                  />
                </svg>
              </div>
              <h2>WE"LL MISS YOU</h2>
              <h4>
                그동안 이용해주셔서 감사합니다.
                <br />
                CODI가 고민된다면,
                <br />
                CODED를 다시 찾아주세요!
              </h4>
            </div>
            <div className="inputWrapper">
              <div className="inputLayout">
                <input
                  type="password"
                  placeholder="현재 비밀번호를 입력해주세요"
                  name="currentPw"
                  value={password}
                  onChange={handleInput}
                />
              </div>
              <div className="btnLayout">
                <button className="DeleteAccountComBtn" onClick={removeAccount}>
                  byebye..
                </button>
              </div>
            </div>
            <div className="blankWrapper2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountCom;
