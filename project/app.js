// 모듈, 패키지 import
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 라우터 import, 이 파일들은 /routes 경로에 들어있음.
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// express 패키지를 이용해 app 변수 객체를 선언
var app = express();

// 아래 set, use는 위에서 만든 app 변수 객체에 각종 기능을 연결하는 부분
/**
 * express의 app.set(name, value)
 * @param name - value를 설정할 name - http://expressjs.com/ko/4x/api.html#app.settings.table
 * @param value - name에 설정할 value (위 링크의 table 참조)
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/**
 * express의 app.use([path,] callback[, callback...])
 * 함수나 특정 경로의 js 파일의 함수들(이 함수들은 요청 경로와 path param이 일치할 때 실행됨)을 미들웨어에 mount
 * @param [path,] - default : '/', middleware function이 invoke 된 경로
 * @param callback[, callback...] - 콜백 함수들, 미들웨어 함수(들, 콤마로 구분), 미들웨어 함수 배열, 앞의 것들의 조합
 */
app.use(function(req, res, next) {
  console.log(req.url, '커스텀 미들웨어');
  /**
   * next() 함수는 param 에 따라 기능이 나뉜다.
   * 미들웨어 내에서 반드시 실행해야 다음 미들웨어로 넘어간다.
   * 1. null - 다음 미들웨어로
   * 2. 'route' - 다음 라우터로
   * 3. error - 다음 error handler로
   */
  next();
});

/**
 * 미들웨어 morgan
 * logger(param)
 * 'dev', 'short' - 개발시 사용
 * 'common', 'combine' - 배포시 사용
 */
app.use(logger('dev'));

/**
 * 미들웨어 body-parser
 * bodyParser.raw()  - 본문이 버퍼 데이터일 때 해석용
 * bodyParser.text() - 본문이 텍스트 데이터일 때 해석용
 *
 * express.json()         - JSON 형식의 데이터 전달 방식
 * express.urlencoded()   - URL-encoded 주소 형식 데이터 전달 방식
 *              { extended: false } : node의 querystring 모듈을 사용하여 querystring 해석
 *              { extended: true }  : qs모듈을 사용하여 querystring 해석, (qs모듈 : npm 패키지, querystring 확장판 격)
 *
 * 주의 : multipart/form-data 같은 폼의 데이터는 해석하지 못함
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * 미들웨어 cookie-parser : request 에 동봉된 쿠키를 해석해주는 미들웨어
 * req.cookies 객체에 해석된 쿠키들이 들어감
 * @param string - 쿠키들은 string으로 서명된 쿠키가 됨
 */
app.use(cookieParser('secret code'));

/**
 * 미들웨어 express-session : 세션 관리용 미들웨어, 로그인등의 이유로 세션 구현시 용이
 * @param 세션 설정 객체
 *        - resave: 요청이 왔을 때 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지 설정 true / false
 *        - saveUninitialized: 세션에 저장할 내역이 없더라도 세션을 저장할지 설정, 방문자 추적시 사용 true / false
 *        - secret: 필수, cookie-parser의 비밀키와 같은 역할, cookie-parser와 같아야 함
 *        - cookie: 세션 쿠키에 대한 설정, 일반적인 쿠키 옵션이 모두 제공됨
 */
app.use(session({
 resave: false,
 saveUninitialized: false,
 secret: 'secret code',
 cookie: {
   httpOnly: true,
   secure: false,
   //store: true/false  - 배포 시에는 store에 데이터베이스를 연결하여 세션을 유지하는 것이 좋음, 보통 Redis 사용
 },
}));

/**
 * 미들웨어 connect-flash : "일회성 메시지"들을 웹 브라우저에 나타낼 때 이용
 * cookie-parser과 express-session을 이용하므로 두 개보다 뒤에 위치해야 함
 * flash 미들웨어는 req 객체에 req.flash 메서드를 추가함
 *
 * req.flash(key, value)  => 해당 key에 대한 value를 설정
 * req.flash(key)         => 해당 key에 대한 value를 불러옴
 */
app.use(flash());

/**
 * 미들웨어 static : 정적인 파일들을 제공하는 미들웨어
 * express.static(['base_path',] path.join(__dirname, 'path'))
 * @param base_path - 정적 파일을 제공할 주소 지정 가능
 *                  - public 폴더 안에 a.png 파일이 있다고 가정하면 localhost:3000/base_path/a.png 로 접근 가능
 * @param directory - 정적 파일들이 담겨있는 폴더 지정
 *
 * 실제 서버의 폴더 경로에는 public이 들어있지만, 요청 주소에는 public이 들어있지 않음
 * 서버의 폴더 경로와 요청 경로가 다르므로 외부인이 서버의 구조를 쉽게 파악할 수 없음 => 보안에 도움이 됨
 *
 * 자체적으로 정적 라우터 기능을 수행하기 때문에 미들웨어의 최대한 윗쪽에 위치하는 것이 좋음
 * 책의 필자는 morgan 다음에 위치 시킨다고함
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 라우터 : 일종의 미들웨어
 * app.use(path, router_object);
 * path에 해당하는 요청이 들어왔을 때만 미들웨어가 동작하게 할 수 있음
 * '/'      - routes/index.js 호출
 * '/users' - routes/users.js 호출
 * app.use() 대신 .get(), .post(), .put(), .patch(), .delete() 같은 Http 메서드를 사용할 수 있음
 */
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 404 처리 미들웨어
app.use(function(req, res, next) {
  next(createError(404));
});

/**
 * error handler
 * function(err, req, res, next) {...}
 * @param err - 404 처리 미들웨어에서 next함수에 넣어준 param이 연결됨
 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app 변수 객체에 할당한 express에 여러 기능들을 연결하여 모듈로 export
module.exports = app;
