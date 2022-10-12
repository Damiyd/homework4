const express = require("express");
const { Posts } = require("../models");
const { Comments } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

// 댓글 생성 POST ( ex)
router.post("/comments/:postId", authMiddleware, async (req, res) => {

    const { postId } = req.params;
    const { comment } = req.body;
    const { commentsId,userId,nickname } = res.locals.user;
    console.log(comment,postId,nickname,commentsId)
    
    const commentPost = await Comments.create({ commentsId, postId, userId, comment, nickname, });

    res.status(200).send({ comments: commentPost });

});

// 댓글을 목록 보기 GET ( ex) localhost:3000/api/comments/받아오려는 id값 )
router.get("/comments/:commentsId", async (req, res) => {

    const {commentsId} = req.params;

    const commentAll = await Comments.findOne({
        where: {commentsId}
    });

    res.json({
        commentAll,
      });
});



// 댓글 수정 : /comments/:_commentId PUT
router.put("/comments/:commentsId", authMiddleware, async (req, res) => {

    const {commentsId} = req.params;
    const {comment} = req.body;

    const updateComments = await Comments.update({
        comment: comment},
        {where: {commentsId}
    });
      
    res.status(200).send({ comments: updateComments });

      });


// 댓글 삭제 : /comments/:_commentId DELETE
router.delete("/comments/:commentsId", authMiddleware, async (req, res) => {

    const {commentsId} = req.params


    const removePosts = await Comments.destroy({
     where: {commentsId}
    });

    res.status(200).send({ posts: removePosts });


});



module.exports = router;