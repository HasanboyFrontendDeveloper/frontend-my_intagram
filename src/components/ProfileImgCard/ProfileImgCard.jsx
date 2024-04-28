import {
  Button,
  Dialog,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Comment, PostCard } from "../";
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../slice/profileSlice";

const ProfileImgCard = ({ handleOpen, open, post }) => {
  const [comments, setComments] = useState(null)

  const {  posts, contentsData } = useSelector((state) => state.profile);
  const dispatch = useDispatch()


  const currentUsername = auth?.currentUser.displayName;

  const deletePost = async () => {

    try {
      const postRef = doc(db, "posts", post?.postId);
      const userRef = doc(db, "users", post?.username);
      await deleteDoc(postRef)

      await updateDoc(userRef, {
        posts: arrayRemove(post?.postId),
      })

      const filterPosts = posts.filter(item => item.postId !== post.postId)
      dispatch(getPosts(filterPosts))
      handleOpen()
    } catch (error) {
      alert('Post is not deleted')
    }
  };



  const renderComment = () => {
    if (currentUsername === post.username) {
      const filter = posts.filter((item) => item.postId === post?.postId)
      if (filter) {
        setComments(filter[0]?.comments)
      }
    } else {
      const filter = contentsData.filter((item) => item.postId === post?.postId)
      if (filter) {
        setComments(filter[0]?.comments)
      }
    }
  }

  useEffect(() => {
    if (contentsData || posts) {
      renderComment()
    }
  }, [contentsData, posts])

  return (
    <>

      <Dialog size="xl" open={open} handler={handleOpen} className="bg-black overflow-y-auto h-[90vh]  flex p-10 ">
        <PostCard post={post} />
        <Comment comments={comments} />
        {post?.username === currentUsername &&
          <Button variant="text" color="red" className="!absolute bottom-5 right-40" onClick={deletePost}>
            delete
          </Button>
        }
        <Button variant="gradient" color="red" className="!absolute bottom-5 right-10" onClick={handleOpen}>
          Cancel
        </Button>
      </Dialog>

    </>
  );
};

export default ProfileImgCard;
