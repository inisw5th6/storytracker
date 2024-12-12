const path = require('path');
const { spawn } = require('child_process');

// Python 실행 경로 및 파일 설정
const pythonEnvPath = 'C:/Users/teral/anaconda3/python.exe'; // Python 실행 파일 경로
const pythonFilePath = path.resolve(__dirname, 'route_extract.py');

// Python 스크립트 실행 함수
function runPythonScript() {
  const pythonProcess = spawn(pythonEnvPath, [pythonFilePath]);

  // 표준 출력 처리
  pythonProcess.stdout.on('data', (data) => {
    console.log(`출력: ${data.toString()}`);
  });

  // 표준 오류 출력 처리
  pythonProcess.stderr.on('data', (data) => {
    console.error(`오류: ${data.toString()}`);
  });

  // 프로세스 종료 시 로그 출력
  pythonProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Python 스크립트가 성공적으로 실행되었습니다.');
    } else {
      console.error(`❌ Python 스크립트 실행 실패. 종료 코드: ${code}`);
    }
  });
}

// 실행 함수 호출
console.log('🚀 Python 스크립트를 실행합니다...');
runPythonScript();
