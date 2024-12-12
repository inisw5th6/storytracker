import React, { useState } from 'react'; 

const BookmarkMotion = ({ x, y }) => {
  const [showBigBookmark, setShowBigBookmark] = useState(false);

  // 클릭 시 bigbookmark.png를 나타내고 애니메이션을 시작
  const handleClick = () => {
    setShowBigBookmark(true);
  };

  return (
    <div style={{ position: 'relative', width: '40px', height: '43px' }}>
      {/* 기존 UnfilledBookmark */}
      <svg
        x={x}
        y={y}
        width="40"
        height="43"
        viewBox="0 0 40 43"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={handleClick} // 클릭 시 handleClick 호출
        style={{ cursor: "pointer" }}
      >
        <path
          d="M31.6667 37.625L20 28.6667L8.33337 37.625V8.95833C8.33337 8.00797 8.68456 7.09654 9.30968 6.42453C9.93481 5.75253 10.7827 5.375 11.6667 5.375H28.3334C29.2174 5.375 30.0653 5.75253 30.6904 6.42453C31.3155 7.09654 31.6667 8.00797 31.6667 8.95833V37.625Z"
          stroke="#A98157"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* bigbookmark.png가 내려오는 애니메이션 */}
      {showBigBookmark && (
        <img
          src="src/assets/images/bigbookmark.png" // bigbookmark.png 파일 경로
          alt="Big Bookmark"
          className="big-bookmark"
          style={{
            position: 'absolute',
            top: y + 4, // y값에 위치를 맞추기
            left: x + 40 - 16, // x값에 위치를 맞추기
            zIndex: 1, // 다른 요소 위에 표시
          }}
        />
      )}
    </div>
  );
};

export default BookmarkMotion;