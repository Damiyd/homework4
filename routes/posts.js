const express = require("express");
const { Posts } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();


// 게시글 작성 POST ( ex) localhost:3000/api/posts )
router.post("/posts", authMiddleware, async (req, res) => {
                                         
    const { title, content } = req.body;
    const { userId, nickname } = res.locals.user;

    const createdPoods = await Posts.create({ userId, title, nickname, content});

      res.status(200).send({ posts: createdPoods });
});

// 게시글 조회 GET ( ex) localhost:3000/api/posts )
router.get('/posts', async (req, res) => {

    const dataAll = await Posts.findAll({               // content를 제외하고, createdAt 순으로 찾기
    attributes : {exclude: ['content']},
    order: [['createdAt', 'DESC']],
    })
    
    res.json({ data : dataAll }); // 넣기
    })


// 게시글 상세 조회 GET ( ex) localhost:3000/api/posts/postid값 )
router.get("/posts/:postsId", authMiddleware, async (req, res) => {

    const {postsId} = req.params;

    const postsAll = await Posts.findOne({
        where: {postsId}
    });

    res.json({
        postsAll,
      });
});

// 게시글 수정 PUT ( ex) localhost:3000/api/posts/postid값 )
router.put("/posts/:postsId", authMiddleware, async (req, res) => {

    const {postsId} = req.params;
    const {title,content} = req.body;

    const updatePosts =  await Posts.update({
        title: title, content: content},
        {where: {postsId}
        });

        res.status(200).send({ posts: updatePosts });


});

// 게시글 삭제 DELETE ( ex) localhost:3000/api/posts/postid값 )
router.delete("/posts/:postsId", async (req, res) => {

    const {postsId} = req.params;
    //const {title,content} = req.body;

    const updatePosts =  await Posts.destroy({
        where: {postsId}
        });

        res.status(200).send({ posts: updatePosts });
    });
module.exports = router;