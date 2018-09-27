const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');			// bcrypt 설치 오류가 나서 bcryptjs 로 바꿔서 설치함(?)
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();
// 로컬 회원가입 라우터
router.post('/join', isNotLoggedIn, async (req, res, next) => {
	const { email, nick, password } = req.body;
	try {
		const exUser = await User.find({ where: { email } });
		if (exUser) {
			req.flash('joinError', '이미 가입된 이메일입니다.');
			return res.redirect('/join');
		}
		
		const hash = await bcrypt.hash(password, 12);
		await User.create({
			email,
			nick,
			password: hash,
		});
		return res.redirect('/');
	} catch (error) {
		console.error(error);
		return next(error);
	}
});
// 로컬 로그인 라우터
router.post('/login', isNotLoggedIn, (req, res, next) => {
	passport.authenticate('local', (authError, user, info) => {
		if (authError) {
			console.error(authError);
			return next(authError);
		}
		if (!user) {
			req.flash('loginError', info.message);
			return res.redirect('/');
		}
		return req.login(user, (loginError) => {
			if (loginError) {
				console.error(loginError);
				return next(loginError);
			}
			return res.redirect('/');
		});
	})(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙임
});
// 로컬 로그아웃 라우터
router.get('/logout', isLoggedIn, (req, res) => {
	req.logout();
	req.session.destroy();
	res.redirect('/');
});

// 카카오 라우터들
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
	failureRedirect: '/',
}), (req, res) => {
	res.redirect('/');
});


module.exports = router;
