import { useEffect, useState } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useDispatch, useSelector } from "react-redux";
import { getProfileSuccess } from "../slice/profileSlice";

const useFollow = (username) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
  
    const { profile } = useSelector((state) => state.profile);
    const currentUsername = auth?.currentUser?.displayName;
    const dispatch = useDispatch();
  
    const handleFollowUser = async () => {
      setIsUpdating(true);
      try {
        const currentUserRef = doc(db, "users", currentUsername);
        const userFollowing = doc(db, "users", username);
        await updateDoc(currentUserRef, {
          following: isFollowing ? arrayRemove(username) : arrayUnion(username),
        });
  
        await updateDoc(userFollowing, {
          followers: isFollowing
            ? arrayRemove(currentUsername)
            : arrayUnion(currentUsername),
        });
  
        if (isFollowing) {
          
          dispatch(
            getProfileSuccess({
              ...profile,
              following: profile.following.filter((uid) => uid !== username),
            })
          );
  
          setIsFollowing(false);
        } else {
          dispatch(
            getProfileSuccess({
              ...profile,
              following: [...profile?.following || [], username],
            })
          );
  
          setIsFollowing(true);
        }
      } catch (error) {
        alert("Following Failed");
        console.error('following error', error);
      } finally {
        setIsUpdating(false);
      }
    };
  
    useEffect(() => {
      if (profile?.following) {
        const isFollowing = profile?.following?.includes(username);
        setIsFollowing(isFollowing);
        console.log('follow hook');
      }
    }, [profile?.following, username]);
  
    return { isUpdating, isFollowing, handleFollowUser };
}

export default useFollow