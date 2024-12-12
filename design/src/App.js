import React, { useState, useEffect } from 'react';
import './index.css';
import NovelContainer from './container/NovelContainer';
import GraphVisualization from './container/GraphVisualization';
import { useFetchChapters } from './container/useFetchChapters';
import { saveBookmark } from './api';
import './Motion.css';  // CSS 스타일을 추가
import NovelBackground from './components/medium/novelbackground';
import Modal from './container/Modal';

const formatChapterTitle = (title) => {
  return title
    .replace(/[^0-9가-힣\s]/g, '')  // 숫자, 한글, 공백만 남김
    .replace(/([0-9]+)([가-힣]+)/g, '$1 $2');  // 숫자와 한글 사이에 공백 추가
};



const App = () => {
  const { pages, getCurrentChapter } = useFetchChapters();
  const [currentPage, setCurrentPage] = useState(0);
  const [showGraph, setShowGraph] = useState(false);

  // 북마크 저장 함수
  const handleBookmarkClick = async () => {
    const textToBookmark = pages.slice(0, currentPage + 1).join('\n\n');
    if (textToBookmark) {
      try {
        await saveBookmark(textToBookmark);
        alert('북마크가 저장되었습니다.');
      } catch (error) {
        console.error('북마크 저장 오류:', error);
        alert('저장 실패! 서버 확인 필요');
      }
    }
  };

  useEffect(() => {
    const clickableElement = document.querySelector("#root > div > svg:nth-child(2) > svg:nth-child(6) > g:nth-child(1) > svg > rect:nth-child(1)");
    if (clickableElement) {
      clickableElement.addEventListener('click', () => setShowGraph(true));
    }

    return () => {
      if (clickableElement) {
        clickableElement.removeEventListener('click', () => setShowGraph(true));
      }
    };
  }, []);

  return (
    <div className="App">

      {/* 북마크 클릭 이벤트 전달 */}
      <NovelBackground onBookmarkClick={handleBookmarkClick} />

      <NovelContainer
        pageContent={pages[currentPage]}
        currentChapter={formatChapterTitle(getCurrentChapter(currentPage))} 
        onBookmarkClick={handleBookmarkClick}
      />

      <div className="controls">
        <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 0))}>
          이전
        </button>
        <span>
          페이지 {currentPage + 1} / {pages.length}
        </span>
        <button onClick={() => setCurrentPage(Math.min(currentPage + 1, pages.length - 1))}>
          다음
        </button>
      </div>

      <Modal isOpen={showGraph} onClose={() => setShowGraph(false)}>
        <GraphVisualization />
      </Modal>
    </div>
  );
};

export default App;