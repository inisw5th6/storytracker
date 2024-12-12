const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 5000;

// CORS 허용
app.use(cors());

// JSON 요청 본문 크기 제한 설정 추가
app.use(express.json({ limit: '10mb' })); // JSON 요청 크기 제한
app.use(express.urlencoded({ limit: '10mb', extended: true })); // URL-encoded 폼 데이터

// 디버깅용 로그
app.use((req, res, next) => {
  console.log(`요청: ${req.method} ${req.url}`);
  next();
});

// 기본 경로 처리
app.get('/', (req, res) => {
  res.send('API 서버가 실행 중입니다.');
});

// novels 디렉토리 설정
const novelsDir = path.join(__dirname, 'novel');

// 소설 파일 목록 가져오기
app.get('/api/novel/list', (req, res) => {
  fs.readdir(novelsDir, (err, files) => {
    if (err) {
      console.error('novel 디렉토리 읽기 오류:', err);
      return res.status(500).json({ error: '디렉토리 읽기 실패' });
    }
    const txtFiles = files.filter(file => file.endsWith('.txt'));
    console.log('TXT 파일 목록:', txtFiles);
    res.json({ files: txtFiles });
  });
});

// 소설 내용 읽기
app.get('/api/novel/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(novelsDir, filename);

  if (!fs.existsSync(filePath)) {
    console.error('파일 없음:', filePath);
    return res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
  }

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('파일 읽기 오류:', err);
      return res.status(500).json({ error: '파일 읽기 실패.' });
    }
    console.log(`파일 내용 (${filename}):`, data.substring(0, 100)); // 일부만 출력
    res.send(data);
  });
});

// 북마크 저장 처리
app.post('/api/bookmark', (req, res) => {
  const { text } = req.body;

  // 요청 본문 로그 출력
  console.log('받은 텍스트:', text); // 이 부분으로 클라이언트에서 전달된 텍스트 확인

  if (!text) {
    return res.status(400).json({ error: '북마크 텍스트가 없습니다.' });
  }

  const bookmarkFilePath = path.join(__dirname, 'bookmarks.txt');
  fs.appendFile(bookmarkFilePath, text + '\n', (err) => {
    if (err) {
      console.error('북마크 저장 오류:', err);
      return res.status(500).json({ error: '북마크 저장 실패' });
    }

    console.log('북마크 저장됨:', text); // 북마크가 제대로 저장되었는지 확인
    res.status(200).json({ message: '북마크 저장 성공' });
  });
});

// output.json 파일 제공
app.get('/api/output', (req, res) => {
  const outputFilePath = path.join(__dirname, 'output.json');
  fs.access(outputFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('output.json 파일 없음:', err);
      return res.status(404).json({ error: 'output.json 파일을 찾을 수 없습니다.' });
    }
    res.sendFile(outputFilePath);
  });
});

// output.json 파일 자동 업데이트 감시
const watchOutputFile = () => {
  const outputFilePath = path.join(__dirname, 'output.json');
  fs.watch(outputFilePath, (eventType) => {
    if (eventType === 'change') {
      console.log('output.json 파일이 업데이트되었습니다.');
    }
  });
};

watchOutputFile();

// 서버 실행 시 포트 충돌 처리
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`포트 ${port}가 이미 사용 중입니다. 서버를 종료하거나 다른 포트를 사용하세요.`);
  } else {
    console.error('서버 오류:', err);
  }
});
