const express = require('express');
const Joi = require('joi');
const jwt = require("jsonwebtoken");
const { Users }  = require("../models");

const router = express.Router();

const ckNickname = /^[a-zA-Z0-9]{3,10}$/;
const ckPassword = /^[a-zA-Z0-9]{4,30}$/;

const userSchema = Joi.object({
  nickname: Joi.string().pattern(ckNickname).required(),
  password: Joi.string().pattern(ckPassword).required(),
  confirm: Joi.string(),
});

router.post("/", async (req, res) => {
  const { nickname, password, confirmPassword } = req.body; // 구조분해할당 = {} <- 안에 있는걸 말함, 객체(오브젝트)일때만 가능

  const objValidateCheck = {
    nickname, password, confirm: confirmPassword // req.body;
  };

  try{                                               // 오류가 나는 곳
  await userSchema.validateAsync(objValidateCheck); //await postUserSchma.validateAsync(req.body);
  } catch(err) {
    res.status(400).send({
        errorMessage: err.message,
    });
    return;
  }

  if (password.search(nickname) > -1) {
    res.status(400).send({
        errorMessage: "비밀번호에 닉네임이 포함되어있습니다."
    })
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }

  // email or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
  const existsUsers = await Users.findOne({
    where: {nickname} // 조건이 여러개거나 findOne 일때
  });
  if (existsUsers) {
    //
    res.status(400).send({
      errorMessage: "닉네임이 이미 사용중입니다.",
    });
    return;
  }

  const user = new Users({ nickname, password });
  await user.save();

  res.status(201).send({user});
});

router.get("/", async (req, res) => {

    const usersAll = await Users.find().sort({date: -1});
     const [...users] = usersAll.map((user) => {
         return {
            _id : user.userId,
             nickname : user.nickname,
         }
     })

    res.status(201).sned({
        users,
    });
});


router.post("/login", async (req, res) => {
    const { nickname, password } = req.body; // json.body : 닉네임, 비번 받기
    
    const user = await Users.findOne({ // User에서 nickname 같은거 찾기
    where:
    {nickname}
    });
    
    if (!user || password !== user.password) { // user 없거나 비번 다르면
    res.status(400).send({
    errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
    });
    return;
    }
    
    res.send({ // 토큰값 받기
    token: jwt.sign({ userId: user.userId }, "yd-secret-key"),
    });
    });

    
    module.exports = router;
