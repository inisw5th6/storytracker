import React from "react";
import IconRelationship from "./iconRelationship";
import IconLibrary from "./icon-library";
import IconMappin from "./icon-mappin";

const Toolbar = ({ x, y}) => {
    return (
      <svg
        x={x}
        y={y}
        width="400"
        height="76"
        viewBox="0 0 400 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Relationship 컴포넌트 */}
        <g transform="translate(38, 4)"> {/* 첫 번째 컴포넌트를 왼쪽에 배치 */}
          <IconRelationship />
        </g>
  
        {/* Library 컴포넌트 */}
        <g transform="translate(152, 4)"> {/* 두 번째 컴포넌트를 중간에 배치 */}
          <IconLibrary />
        </g>
  
        {/* Mappin 컴포넌트 */}
        <g transform="translate(266, 4)"> {/* 세 번째 컴포넌트를 오른쪽에 배치 */}
          <IconMappin />
        </g>
      </svg>
    );
};
  
export default Toolbar;