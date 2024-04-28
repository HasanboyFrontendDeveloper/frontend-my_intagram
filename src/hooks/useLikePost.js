import { useState } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const useLikePost = (post) => {
	const [isUpdating, setIsUpdating] = useState(false);
	const [likes, setLikes] = useState(post.likes.length);
	const currentUsername = auth?.currentUser?.displayName;
	const [isLiked, setIsLiked] = useState(post.likes.includes(currentUsername));

	const handleLikePost = async () => {
		if (isUpdating) return;
		setIsUpdating(true);

		try {
			const postRef = doc(db, "posts", post.postId);
			await updateDoc(postRef, {
				likes: isLiked ? arrayRemove(currentUsername) : arrayUnion(currentUsername),
			});

			setIsLiked(!isLiked);
			isLiked ? setLikes(likes - 1) : setLikes(likes + 1);
		} catch (error) {
			alert('Like error')
			console.error(error);
		} finally {
			setIsUpdating(false);
		}
	};

	return { isLiked, likes, handleLikePost };
};

export default useLikePost;
