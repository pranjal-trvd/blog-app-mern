const blogModel = require('../models/blogModel')
const userModel = require('../models/userModel')
const mongoose = require('mongoose')

//get all blogs
exports.getAllBlogsController = async (req,res) => {
    try {
        const blogs = await blogModel.find({}).populate('user');
        if(!blogs) {
            return res.status(200).send({
                success: false,
                message : "no blogs found"
            })
        }

        return res.status(200).send({
            success: true,
            BlogCount : blogs.length,
            message : "all blog list",
            blogs
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success : false,
            message : "error while fetching the data",
            error
        })
    }
}

//create blogs
exports.createBlogController = async (req, res) => {
    try {
      const { title, description, image, user } = req.body;
      //validation
      if (!title || !description || !image || !user) {
        return res.status(400).send({
          success: false,
          message: "Please Provide ALl Fields",
        });
      }
      const exisitingUser = await userModel.findById(user);
      //validaton
      if (!exisitingUser) {
        return res.status(404).send({
          success: false,
          message: "unable to find user",
        });
      }
  
      const newBlog = new blogModel({ title, description, image, user });
      const session = await mongoose.startSession();
      session.startTransaction();
      await newBlog.save({ session });
      exisitingUser.blogs.push(newBlog);
      await exisitingUser.save({ session });
      await session.commitTransaction();
      await newBlog.save();
      return res.status(201).send({
        success: true,
        message: "Blog Created!",
        newBlog,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        success: false,
        message: "Error WHile Creting blog",
        error,
      });
    }
};

//delete blog
exports.deleteBlogController = async (req, res) => {
    try {
      const blog = await blogModel
        // .findOneAndDelete(req.params.id)
        .findByIdAndDelete(req.params.id)
        .populate("user");
      await blog.user.blogs.pull(blog);
      await blog.user.save();
      return res.status(200).send({
        success: true,
        message: "Blog Deleted!",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        success: false,
        message: "Erorr While Deleteing Blog",
        error,
      });
    }
  };

//update blog
exports.updateBlogController = async (req,res) => {
    try {
        const {id} = req.params
        const blog = await blogModel.findByIdAndUpdate(id,{...req.body}, {new: true})
        return res.status(200).send({
            success: true,
            message: "blog updated",
            blog
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message : "Error in updating blog",
            error
        })
    }
}

//single blog
exports.getBlogByIdController = async (req,res) => {
    try {
        const {id} = req.params
        const blog = await blogModel.findById(id)
        if(!blog) {
            return res.status(404).send({
                success: false,
                message : "Blog not found"
            })
        }
        return res.status(200).send({
            success: true,
            message : "Blog found",
            blog
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message : "Error in fetching blog data",
            error
        })
    }
}

//user blog
exports.userBlogController = async (req,res)=> {
    try {
        const{id} = req.params;
        const blog = await userModel.findById(id).populate("blogs");
        if(!blog) {
            return res.status(404).send({
                success: false,
                message: "Blogs not found of this user"
            })
        }
        return res.status(200).send({
            success: true,
            message: "User blogs",
            blog
        })
    } catch (error) {
        console.log(error)
        return res.status(404).send({
            success: false,
            message: "Error in fetching data",
            error
        })
    }
}