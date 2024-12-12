
import { useState, useEffect } from 'react';
import { fetchChapterFiles, fetchChapterContent } from '../api';

const PAGE_SIZE = 700; // 고정된 페이지 크기 (문자 수 기준)

export const useFetchChapters = () => {
  const [chapterFiles, setChapterFiles] = useState([]);
  const [pages, setPages] = useState([]);
  const [chapterStartPages, setChapterStartPages] = useState([]);
  const [chapterTitles, setChapterTitles] = useState([]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const data = await fetchChapterFiles();
        setChapterFiles(data.files);
      } catch (error) {
        console.error('챕터 파일 목록 가져오기 오류:', error);
      }
    };
    fetchChapters();
  }, []);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        let combinedPages = [];
        let startPages = [];
        let titles = [];
        let currentStartPage = 0;

        for (const chapter of chapterFiles) {
          const text = await fetchChapterContent(chapter);

          // 챕터 제목 추출
          const title = chapter.replace(/\.txt$/, '').replace(/[^0-9가-힣]/g, ' ').trim();
          titles.push(title);

          // 페이지 채우기 로직
          let remainingText = text.trim();
          const chapterPages = [];

          while (remainingText.length > 0) {
            // 현재 페이지 채우기
            const currentPageText = remainingText.slice(0, PAGE_SIZE);
            chapterPages.push(currentPageText);

            // 다음 페이지로 남은 텍스트 이동
            remainingText = remainingText.slice(PAGE_SIZE);
          }

          // 챕터 시작 페이지 추가
          startPages.push(currentStartPage);

          // 현재 챕터 페이지 추가
          combinedPages.push(...chapterPages);

          // 다음 챕터 시작은 현재 총 페이지 길이
          currentStartPage = combinedPages.length;
        }

        setPages(combinedPages);
        setChapterStartPages(startPages);
        setChapterTitles(titles);
      } catch (error) {
        console.error('페이지 가져오기 오류:', error);
      }
    };

    if (chapterFiles.length > 0) fetchPages();
  }, [chapterFiles]);

  // 현재 페이지에 해당하는 챕터 이름 반환
  const getCurrentChapter = (currentPage) => {
    for (let i = chapterStartPages.length - 1; i >= 0; i--) {
      if (currentPage >= chapterStartPages[i]) {
        return chapterTitles[i] || '챕터 이름 없음';
      }
    }
    return '챕터 이름 없음';
  };

  return { chapterFiles, pages, chapterStartPages, getCurrentChapter };
};
