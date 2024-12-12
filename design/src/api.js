// services/api.js
export const fetchChapterFiles = async () => {
    const response = await fetch('http://localhost:5000/api/novel/list');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  };
  
  export const fetchChapterContent = async (chapter) => {
    const response = await fetch(`http://localhost:5000/api/novel/${chapter}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.text();
  };
  
  export const saveBookmark = async (textToBookmark) => {
    const response = await fetch('http://localhost:5000/api/bookmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textToBookmark }),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  };
  