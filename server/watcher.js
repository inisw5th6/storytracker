const chokidar = require('chokidar');
const { exec } = require('child_process');
const fs = require('fs');

// 감시할 파일 경로
const fileToWatch = './bookmarks.txt';

// 파일 실행 함수
function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    exec(`node ${scriptName}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`❌ 실행 오류 (${scriptName}): ${err.message}`);
        return reject(err);
      }
      if (stderr) {
        console.error(`❗ stderr (${scriptName}): ${stderr}`);
      }
      console.log(`✅ stdout (${scriptName}):\n${stdout}`);
      resolve();
    });
  });
}

// 파일 변경 감시
chokidar.watch(fileToWatch).on('change', async (path) => {
  console.log(`🚨 파일 변경 감지: ${path}`);

  // 파일 읽기
  const fileContent = fs.readFileSync(fileToWatch, 'utf8').trim();

  // 파일이 비어 있으면 실행하지 않음
  if (!fileContent) {
    console.log('❗ 파일이 비어 있습니다. 실행 중지.');
    return;
  }

  try {
    // 스크립트 순차 실행
    await runScript('run.js');
    await runScript('runmap.js');
    await runScript('runroute.js');
    console.log('🚀 모든 스크립트가 성공적으로 실행되었습니다!');
  } catch (error) {
    console.error('❌ 스크립트 실행 중 오류 발생!');
  }
});

console.log(`🔍 파일 감시 시작: ${fileToWatch}`);
