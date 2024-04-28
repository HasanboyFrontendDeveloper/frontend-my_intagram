import { useEffect, useState } from "react";
import "./PostCard.scss";
import { IconButton } from "@material-tailwind/react";
import { Comment, ProfileImgCard } from "../";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import unknown_img from "../../assets/Unknown_person.jpg";
import { auth, db } from "../../firebase/config";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { getContentsData, getPosts } from "../../slice/profileSlice";
import { useLikePost } from "../../hooks";


const PostCard = ({ post, open, handleOpen }) => {
  const [showPost, setShowPost] = useState(false);
  const [comment, setComment] = useState("");
  const { isLiked, likes, handleLikePost } = useLikePost(post)

  const { profile, posts, contentsData } = useSelector(state => state.profile)
  const currentUsername = auth?.currentUser?.displayName;
  const dispatch = useDispatch()




  const handleInputChange = (e) => {
    const val = e.target.value;
    setComment(val);
    setShowPost(val.trim() !== "");
  };

  const addComment = (comment, postId) => {

    if (currentUsername === post?.username) {
      const newPost = posts?.map(post => {
        if (post.postId === postId) {
          return {
            ...post,
            comments: [...post?.comments || [], comment]
          }
        }
        return post
      })
      dispatch(getPosts(newPost))

    } else {
      const newPost = contentsData?.map(post => {
        if (post.postId === postId) {
          return {
            ...post,
            comments: [...post?.comments || [], comment]
          }
        }
        return post
      })
      dispatch(getContentsData(newPost))
    }
    setComment('')
  }

  const postComment = async () => {
    try {

      const newComment = {
        comment,
        username: currentUsername,
        userImg: profile?.userImg
      }
      const postRef = doc(db, "posts", post?.postId);
      await updateDoc(postRef, { comments: arrayUnion(newComment) })
      addComment(newComment, post?.postId)
    } catch (error) {
      console.error('post Comment error', error);
    }
  }
  return (
    <>

      <div className="post">
        <div className="channel">
          <div className="pfp">
            <img src={post?.userImg || unknown_img} alt="" />
          </div>
          <div className="detailes">
            <div className="name">
              <Link to={`${post?.username}/`}>{post?.username}</Link>
            </div>
          </div>
        </div>
        <img
          src={post?.imgUrl}
          className="post-img"
        />
        <div className="section">

          <IconButton
            variant="text"
            size="lg"
            color={isLiked ? "red" : "white"}
            onClick={handleLikePost}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </IconButton>
          <IconButton onClick={() => handleOpen(post)}>
            <i className="fa-regular fa-comment text-2xl"></i>
          </IconButton>
        </div>
        <div className="likes">
          <p>{likes} likes</p>
        </div>
        <div className="description">
          <p>
            <Link to={`${post?.username}/`}>
              {`${post?.username} `}
            </Link>
            <h3>{post?.description}</h3>
          </p>
        </div>
        <div className="comment-input">
          <input
            type="text"
            placeholder="Add a comment..."
            onChange={handleInputChange}
            value={comment}
            required
          />
          {showPost && <button className="post text-cyan-500" onClick={postComment}>Post</button>}
        </div>
      </div>
      <ProfileImgCard open={open} handleOpen={handleOpen} post={post} />

    </>
  );
};

export default PostCard;
