import React, { useEffect, useState } from 'react';
import '../styles/NovelContainer.css'; 
import { fetchChapterContent } from '../api';

function NovelContainer({ currentChapter }) {
  const [pageContent, setPageContent] = useState('');

  useEffect(() => {
    if (!currentChapter) return;

    const fetchContent = async () => {
      try {
        const content = await fetchChapterContent(currentChapter);
        setPageContent(content);
      } catch (error) {
        console.error('내용을 불러오는 중 오류 발생:', error);
        setPageContent(' ');
      }
    };

    fetchContent();
  }, [currentChapter]);

  useEffect(() => {
    const svgContainer = document.querySelector("#root > div > svg > svg:nth-child(3)");

    if (!svgContainer) {
      console.error("SVG 요소를 찾을 수 없습니다.");
      return;
    }

    // 기존 foreignObject 제거 (중복 방지)
    const existingForeignObject = svgContainer.querySelector("foreignObject");
    if (existingForeignObject) existingForeignObject.remove();

    // foreignObject 생성
    const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    foreignObject.setAttribute("x", "14");
    foreignObject.setAttribute("y", "47");
    foreignObject.setAttribute("width", "400");
    foreignObject.setAttribute("height", "773");

    // 텍스트 컨테이너 생성
    const textContainer = document.createElement("div");
    textContainer.className = "novel-overlay";

    // 헤더 추가
    const header = document.createElement("h1");
    header.className = "novel-header";
    header.textContent = currentChapter || "제목 없음";

    // 본문 추가
    const content = document.createElement("p");
    content.className = "novel-content";
    content.textContent = pageContent || "내용이 없습니다.";

    // 텍스트 컨테이너에 헤더와 본문 추가
    textContainer.appendChild(header);
    textContainer.appendChild(content);

    // foreignObject에 텍스트 컨테이너 추가
    foreignObject.appendChild(textContainer);

    // 기존 SVG 요소에 foreignObject 추가
    svgContainer.appendChild(foreignObject);
  }, [currentChapter, pageContent]);

  return null; // React 컴포넌트가 JSX를 반환하지 않음
}

export default NovelContainer;
