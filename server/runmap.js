// Node.js 파일: run_map.js

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// 실행 설정 경로
const pythonEnvPath = 'C:/Users/teral/anaconda3/python.exe';
const pythonFilePath = 'C:/Users/teral/project-server/map.py';

// 파라미터 설정
const inputFile = 'C:/Users/teral/project-server/bookmarks.txt';
const outputFile1 = path.resolve(__dirname, 'tagged_sentences.json');
const outputFile2 = path.resolve(__dirname, 'location_sentences.json');
const outputFile3 = path.resolve(__dirname, 'selected_locations.json');
const modelPathNER = 'C:/Users/teral/project-server/checkpoint-1008';
const modelPathClassifier = 'C:/Users/teral/project-server/checkpoint-2990';

// Python 스크립트 실행 함수
function runPythonScript() {
  const args = [
    pythonFilePath, inputFile, outputFile1, outputFile2, outputFile3, modelPathNER, modelPathClassifier
  ];

  const pythonProcess = spawn(pythonEnvPath, args);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`출력: ${data.toString()}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`오류: ${data.toString()}`);
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      console.log('Python 스크립트가 성공적으로 실행되었습니다.');
    } else {
      console.error(`Python 스크립트 실행 실패. 종료 코드: ${code}`);
    }
  });
}

// 메인 실행 함수
function runMapProcessing() {
  console.log('Python 스크립트를 실행합니다...');

  if (!fs.existsSync(inputFile)) {
    console.error(`입력 파일이 존재하지 않습니다: ${inputFile}`);
    return;
  }

  runPythonScript();
}

// 실행
runMapProcessing();
