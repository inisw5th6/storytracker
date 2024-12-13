import React from "react";
import HeadMappin from "./head-mappin";

const IconMappin =({onClick}) => (
    <svg
    width="76"
    height="76" // 높이를 충분히 늘려줘야 두 아이콘이 잘 보임
    viewBox="0 0 76 76"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick} // 클릭 핸들러 추가
    style={{ cursor: "pointer" }} // 클릭 시 커서 변경
  >
    {/* 투명한 클릭 영역 */}
    <rect
      width="76"
      height="76"
      fill="transparent"
      pointerEvents="all" // 클릭 이벤트 감지
    />

    {/* 첫 번째 아이콘 */}
    <g transform="translate(38, 24)"> {/* 가로 중심 (viewBox 가로 절반) */}
      <g transform="translate(-24, -24)"> {/* 첫 번째 아이콘 중심 보정 */}
        <HeadMappin />
      </g>
    </g>

    {/* 두 번째 아이콘 */}
    <g transform="translate(38, 62)"> {/* 첫 번째 아이콘보다 10px 아래로 이동 */}
      <g transform="translate(-38, -9)"> {/* 두 번째 아이콘 중심 보정 */}
        <path d="M20.1125 2.592H22.2565V17.456H20.1125V2.592ZM14.2725 3.632C16.5125 3.632 18.1605 5.68 18.1605 8.912C18.1605 12.176 16.5125 14.224 14.2725 14.224C12.0325 14.224 10.3845 12.176 10.3845 8.912C10.3845 5.68 12.0325 3.632 14.2725 3.632ZM14.2725 5.568C13.1685 5.568 12.4165 6.736 12.4165 8.912C12.4165 11.12 13.1685 12.304 14.2725 12.304C15.3765 12.304 16.1125 11.12 16.1125 8.912C16.1125 6.736 15.3765 5.568 14.2725 5.568ZM24.1873 9.568H37.5953V11.264H24.1873V9.568ZM29.8353 7.344H31.9473V10.224H29.8353V7.344ZM25.8033 6.672H36.0753V8.352H25.8033V6.672ZM25.8033 3.248H35.9953V4.912H27.9153V7.744H25.8033V3.248ZM30.8433 12C34.0433 12 35.9793 12.976 35.9793 14.72C35.9793 16.464 34.0433 17.44 30.8433 17.44C27.6432 17.44 25.6913 16.464 25.6913 14.72C25.6913 12.976 27.6432 12 30.8433 12ZM30.8433 13.6C28.8593 13.6 27.8513 13.968 27.8513 14.72C27.8513 15.488 28.8593 15.824 30.8433 15.824C32.8273 15.824 33.8353 15.488 33.8353 14.72C33.8353 13.968 32.8273 13.6 30.8433 13.6ZM45.526 4.944H48.998V6.64H45.526V4.944ZM45.414 8.016H48.886V9.712H45.414V8.016ZM48.662 2.608H50.79V11.136H48.662V2.608ZM43.83 3.616H46.102C46.102 7.648 43.83 10.24 39.334 11.472L38.502 9.792C42.262 8.816 43.83 6.96 43.83 4.64V3.616ZM39.318 3.616H45.318V5.312H39.318V3.616ZM45.878 11.328C48.886 11.328 50.886 12.48 50.886 14.336C50.886 16.192 48.886 17.36 45.878 17.36C42.87 17.36 40.87 16.192 40.87 14.336C40.87 12.48 42.87 11.328 45.878 11.328ZM45.878 12.96C44.07 12.96 42.982 13.424 42.982 14.336C42.982 15.248 44.07 15.696 45.878 15.696C47.702 15.696 48.79 15.248 48.79 14.336C48.79 13.424 47.702 12.96 45.878 12.96ZM52.6248 14.064H66.0328V15.792H52.6248V14.064ZM58.2408 11.264H60.3688V14.768H58.2408V11.264ZM54.1288 3.568H64.5288V8.496H56.2728V10.992H54.1608V6.832H62.4168V5.248H54.1288V3.568ZM54.1608 10.144H64.8648V11.856H54.1608V10.144Z" fill="#A98157"/>
      </g>
    </g>
  </svg>
);

export default IconMappin;