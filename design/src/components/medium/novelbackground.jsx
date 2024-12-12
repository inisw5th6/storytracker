import React, { useState } from "react";
import BackgroundRect from "../small/background";
import Bar from "../small/bar";
import Box2 from "../small/box2";
import Toolbar from "../small/toolbar";
import BackButton from "../small/backbutton";
import UnfilledBookmark from "../small/unfilledBookmark";
import FilledBookmark from "../small/filled-bookmark";

const NovelBackground = ({ onBookmarkClick }) => {
  const [isFilled, setIsFilled] = useState(false);

  const handleBookmarkClick = () => {
    console.log("북마크 클릭됨!");
    setIsFilled(!isFilled);
    if (onBookmarkClick) {
      onBookmarkClick(); // 북마크 저장 동작 호출
    }
  };

  return (
    <svg
      width="428"
      height="926"
      viewBox="0 0 428 926"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      pointerEvents="none" // 기본 상호작용 차단
    >
      <BackgroundRect />
      <Bar y="10" />
      <Box2 x={428 / 2 - 400 / 2} y={47} />
      <BackButton x={428 / 2 - 400 / 2 + 13} y={47 + 9} />

      {/* 북마크 상태 및 클릭 동작 */}
      {isFilled ? (
        <FilledBookmark
          x={428 / 2 - 400 / 2 + 400 - 13 - 40}
          y={47 + 12}
          style={{ pointerEvents: "all", cursor: "pointer" }}
        />
      ) : (
        <UnfilledBookmark
          x={428 / 2 - 400 / 2 + 400 - 13 - 40}
          y={47 + 12}
          onClick={handleBookmarkClick}
          style={{ pointerEvents: "all", cursor: "pointer" }}
        />
      )}

      <Toolbar x={428 / 2 - 400 / 2} y={47 + 773 + 11} />
    </svg>
  );
};

export default NovelBackground;
