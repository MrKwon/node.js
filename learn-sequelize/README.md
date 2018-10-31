# Sequelize 패키지 탐험

다른건 다 필요없고<br>
<br>
아래 세가지 디렉터리와 app.js 파일 하나만 보면 됨<br>
* ./config - DB 접속 설정 user, pw, db
* ./models - Sequelize 쿼리
* ./routes - Sequelize 요청
* ./app.js - Sequelize 연결

교재의 route는 기본 promise 방식을 사용했는데 <br>
여기에 올려둔 코드는 promise 방식을 async/await로 수정해서 올림 <br>
