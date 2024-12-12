const { exec } = require('child_process');

// Python 환경 경로와 Python 파일 경로
const pythonEnvPath = 'C:/Users/teral/anaconda3/python.exe'; // Conda 환경의 Python 경로
const pythonFilePath = 'C:/Users/teral/project-server/ps_extract.py'; // Python 파일 경로
const modelPath = 'C:/Users/teral/project-server/checkpoint-1008'; // 모델 경로
const outputFilePath = './output.json'; // 출력 파일 경로

// 실행할 Python 명령어
const command = `${pythonEnvPath} ${pythonFilePath} ${modelPath} ${outputFilePath}`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});