import { useSelector } from "react-redux";
import { PostCard, Sidebar, SuggestedUsers } from "../";
import { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState(null)
  const [post, setPost] = useState("");

  const { contentsData } = useSelector(state => state.profile)


  const handleOpen = (p = post) => {
    setOpen((cur) => !cur);
    setPost(p);
  };

  const renderComment = () => {
    const filter = contentsData.filter((item) => item.postId === post?.postId)
    if (filter) {
      setComments(filter[0]?.comments)
    }
  }

  useEffect(() => {
    if (contentsData) {
      renderComment()
    }
  }, [contentsData])

  console.log(comments);

  return (
    <>
      <div className="flex justify-around relative ">
        <div>
          <Sidebar inOnProfile={true} />
        </div>
        <div className="mt-16 ml-32 relative w-[400px]">
          <Typography
            color="white"
            className="text-center my-5 text-xl absolute top-5 z-[-1] "
          >
            You do not have any following
          </Typography>
          {contentsData && contentsData.map((post, index) => (
            <PostCard post={post} key={index} isShowComment={false} handleOpen={handleOpen} open={open} comments={comments} />
          ))}
        </div>
        <SuggestedUsers />
      </div>
    </>
  );
};

export default Home;
