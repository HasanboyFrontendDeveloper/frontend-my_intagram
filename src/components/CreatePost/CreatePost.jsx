import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";
import { useState } from "react";
import { auth, db, imgdb } from "../../firebase/config";
import { v4 } from "uuid";
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../slice/profileSlice";

const CreatePost = ({ handleShowModul }) => {
  const [description, setDescription] = useState("");
  const [img, setImg] = useState("");
  const [openModal, setopenModal] = useState(true);

  const { profile, posts } = useSelector((state) => state.profile);

  const dispatch = useDispatch()

  const username = auth?.currentUser?.displayName;

  const handleImg = (e) => {
    setImg(e.target.files[0]);
  };

  const uploadImg = async () => {
    const imgRef = ref(imgdb, `posts/${v4()}`);
    await uploadBytes(imgRef, img);
    return await getDownloadURL(imgRef);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const urlImg = await uploadImg();

    try {

      const post = {
        description: description,
        imgUrl: urlImg,
        userImg: profile?.userImg,
        username: username,
        likes: [],
        postId: null,
      }

      const postDataRef = await addDoc(collection(db, 'posts'), post)
      const userRef = doc(db, 'users', username)
      await updateDoc(userRef, { posts: arrayUnion(postDataRef.id) })
      await updateDoc(postDataRef, { postId: postDataRef.id })

      post.postId = postDataRef.id

      dispatch(getPosts([post, ...posts]))
      closeHandler('')
    } catch (error) {
      alert('Post does not sent, Try again later')
    }

  };

  const closeHandler = (modal) => {
    setopenModal(false);
    setTimeout(() => {
      handleShowModul(modal);
    }, 500);
  };

  return (
    <>
      <Dialog
        size="xs"
        open={openModal}
        handler={() => closeHandler("")}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem] bg-black">
          <form onSubmit={submitHandler}>
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4" color="white">
                Create New Post
              </Typography>
              <Input
                label="Description"
                size="lg"
                color="white"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                required
              />
              <Typography className="-mb-2" variant="h6" color="white">
                Image
              </Typography>
              <label
                htmlFor="inputFile"
                className="border rounded p-3 text-white"
              >
                Choose Image: {img?.name || "No file chosen"}
                <input type="file" hidden id="inputFile" onChange={handleImg} />
              </label>
            </CardBody>
            <CardFooter className="pt-0 flex justify-between">
              <Button
                variant="text"
                type="submit"
                color="red"
                onClick={() => closeHandler("")}
              >
                Cancel
              </Button>
              <Button variant="gradient" type="submit">
                Create Post
              </Button>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </>
  );
};

export default CreatePost;
