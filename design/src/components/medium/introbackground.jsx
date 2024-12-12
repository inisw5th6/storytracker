import React from "react";
import BackgroundRect from '../small/background';
import Bar from '../small/bar';
import Box1 from '../small/box1'
import IntroMessege from '../small/intromessege'
import Hand from '../../assets/images/hand.png'


const IntroBackground = () => (
    <svg
      width="428"
      height="926"
      viewBox="0 0 428 926" // 좌표계를 유지
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      
    >
      <BackgroundRect />
      <Bar y="10"/>
      <Box1 
        x={428 /2 -400 /2} // 14
        y={926 /2 -714 /2} // 106
         />
        <IntroMessege 
            x={428 /2 -276 /2}
            y={926 /2 -180 /2} // 중앙에서 px 위 
           
        />
        <image 
            href={Hand} 
            x={428 /2 -302 /2}
            y={926 /2 -6 /2} 
            width="300" 
            height="200" 
      />
    </svg>
  );
  
  export default IntroBackground;

