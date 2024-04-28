import { useEffect, useState } from "react";
import { ProfileImgCard, Sidebar, EditProfile } from "../";
import { Avatar, Button, Card, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../../firebase/config";
import unknown_img from "../../assets/Unknown_person.jpg";
import {
  getGuest,
  getPosts,
  getProfileFailure,
  getProfileStart,
  getProfileSuccess,
} from "../../slice/profileSlice";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useFollow } from "../../hooks";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [post, setPost] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const { isUpdating, isFollowing, handleFollowUser } = useFollow(profileData?.username);

  const { profile, posts } = useSelector(
    (state) => state.profile
  );
  const { username } = useParams();

  const currentUser = auth?.currentUser;
  const currentEmail = currentUser?.email;
  const currentUsername = currentUser?.displayName;

  const handleOpen = (p) => {
    setOpen((cur) => !cur);
    setPost(p);
  };

  const handleOpenEditProfile = () => {
    setOpenEditProfile((prev) => !prev);
  };

  const dispatch = useDispatch();

  const getProfileData = async () => {
    setIsLoading(true)
    dispatch(getProfileStart());
    try {
      if (username !== currentUsername) {
        const usersRef = doc(db, "users", username);
        const data = await getDoc(usersRef).then((data) => data.data());
        setProfileData(data);
        dispatch(getGuest(data)); 
      } else {
        dispatch(getProfileSuccess(profile)); 
        setProfileData(profile); 
      }
    } catch (error) {
      dispatch(getProfileFailure(error));
    } finally {
      setIsLoading(false)
    }
  };


  useEffect(() => {
    if (username || profile) {
      getProfileData();
    }
    return () => {
      console.log("Cleanup function called");
      if (username !== currentUsername) {
        console.log("Setting guest to null");
        dispatch(getGuest(null));
      }
    };
  }, [username, currentUsername, dispatch, profile]);

  const getPost = async () => {
    console.log('Get post Start');
    try {
      let contents = [];

      const promises = profileData?.posts.map(async (post) => {
        const userRef = doc(db, "posts", post);
        const postsShot = await getDoc(userRef);
        const postsData = postsShot.data();
        console.log(userRef);
        if (postsData) {
          contents.push(postsData);
        }
      });


      await Promise.all(promises);
      dispatch(getPosts(contents));
      console.log(contents);
    } catch (error) {
      alert('Error getting the posts');
      console.error( 'Getting post error',error);
      
    }
  }

  useEffect(() => {
    if (profileData?.posts) {
      getPost()
    }
  }, [profileData?.posts, username])


  return (
    <>
      {isLoading ? (
        <Typography color="white" className="text-center">
          Loading...
        </Typography>
      ) : (
        profileData && (
          <>
            <div className="flex justify-evenly">
              <Sidebar inOnProfile={false} />
              <div></div>
              <div className="w-[60%] mt-10 mr">
                <div className="flex gap-[100px]">
                  <Avatar
                    src={
                      profileData?.userImg ? profileData.userImg : unknown_img
                    }
                    alt="avatar"
                    className="w-52 h-52"
                  />
                  <div className="mt-10">
                    <div className="flex items-center gap-5">
                      <Typography
                        variant="h5"
                        color="white"
                        className="cursor-pointer"
                      >
                        {profileData?.username}
                      </Typography>
                      {username === currentUsername ? (
                        <Button
                          variant="text"
                          color="white"
                          onClick={() => handleOpenEditProfile()}
                        >
                          Edit Profile
                        </Button>
                      ) : (
                        <Button variant="text" color="blue" onClick={handleFollowUser} loading={isUpdating}>
                          {isFollowing ? 'Unfollow' : 'Follow'}
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-5 py-3">
                      <Typography
                        variant="small"
                        color="white"
                        className="font-normal capitalize"
                      >
                        {profileData?.posts?.length || "No"} Posts
                      </Typography>
                      <Typography
                        variant="small"
                        color="white"
                        className="font-normal capitalize"
                      >
                        {`${profileData?.followers?.length || 0} Followers `}
                      </Typography>
                      <Typography
                        variant="small"
                        color="white"
                        className="font-normal capitalize"
                      >
                        {`${profileData?.following?.length || 0} Following `}
                      </Typography>
                    </div>
                    <Typography
                      variant="small"
                      color="white"
                      className="font-normal capitalize"
                    >
                      {profileData?.fullname}
                    </Typography>
                    <div className="flex items-center gap-5 py-3 w-72">
                      <Typography
                        variant="small"
                        color="white"
                        className="font-normal capitalize"
                      >
                        {profileData?.bio}
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="my-14">
                  <Typography
                    color="white"
                    className="text-center my-5 text-2xl border-b-2"
                  >
                    Posts
                  </Typography>
                  <div className="grid grid-cols-3 gap-2">
                    {posts.length === 0 &&
                      <Typography
                        color="white"
                        className="text-center my-5 text-xl "
                      >
                        You dont have any posts
                      </Typography>}
                    {posts?.map((img, index) => (
                      <Card
                        className="w-50 cursor-pointer overflow-hidden transition-opacity hover:opacity-90"
                        onClick={() => handleOpen(img)}
                        key={index}
                      >
                        <img
                          className=" max-w-full rounded-lg object-cover object-center md:h-60"
                          src={img.imgUrl}
                          alt=""
                        />
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <ProfileImgCard open={open} handleOpen={handleOpen} post={post} />
            <EditProfile
              open={openEditProfile}
              handleOpen={handleOpenEditProfile}
              currentEmail={currentEmail}
              profile={profile}
              getProfileData={getProfileData}
            />
          </>
        )
      )}
    </>
  );
};

export default Profile;
