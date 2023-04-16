const express = require('express')
const { getAllBlogsController, createBlogController, updateBlogController, deleteBlogController, getBlogByIdController, userBlogController } = require('../controllers/blogController')

// router object
const router = express.Router()

//get all blogs || GET
router.get('/all-blog', getAllBlogsController)

//create a blog || POST
router.post('/create-blog', createBlogController)

//update a blog || PUT
router.put('/update-blog/:id', updateBlogController)

//delete blog || DELETE
router.delete('/delete-blog/:id', deleteBlogController)

//Single blog || GET
router.get('/get-blog/:id', getBlogByIdController)

//user blogs
router.get('/user-blog/:id', userBlogController)

module.exports = router