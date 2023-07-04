import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

const BackButton = ({ backPagesCount }) => {
  const navigate = useNavigate();
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        border: 'none',
        width: '40px',
        height: '40px',
        cursor: 'pointer',
      }}
      onClick={() => {
        navigate(backPagesCount);
      }}
    >
      <g data-name="Layer 50" id="Layer_50">
        <path
          class="cls-1"
          d="M30,29a1,1,0,0,1-.81-.41l-2.12-2.92A18.66,18.66,0,0,0,15,18.25V22a1,1,0,0,1-1.6.8l-12-9a1,1,0,0,1,0-1.6l12-9A1,1,0,0,1,15,4V8.24A19,19,0,0,1,31,27v1a1,1,0,0,1-.69.95A1.12,1.12,0,0,1,30,29ZM14,16.11h.1A20.68,20.68,0,0,1,28.69,24.5l.16.21a17,17,0,0,0-15-14.6,1,1,0,0,1-.89-1V6L3.67,13,13,20V17.11a1,1,0,0,1,.33-.74A1,1,0,0,1,14,16.11Z"
        />
      </g>
    </svg>
  );
};

export default BackButton;