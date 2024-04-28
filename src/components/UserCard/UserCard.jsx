import {
  Card,
  CardHeader,
  Typography,
  Avatar,
  Button,
} from "@material-tailwind/react";
import unknown_img from "../../assets/Unknown_person.jpg";
import { useNavigate } from "react-router-dom";
import { useFollow } from "../../hooks";

const UserCard = ({ user, isCurrentuser = false }) => {
  const navigate = useNavigate();
  const { isUpdating, isFollowing, handleFollowUser } = useFollow(user?.username);



  return (
    user && (
      <Card shadow={false} className="bg-transparent w-[390px] py-1">
        <CardHeader
          color="transparent"
          floated={false}
          shadow={false}
          className="mx-0 flex items-center gap-4"
        >
          <Avatar
            size="lg"
            variant="circular"
            src={user?.userImg ? user.userImg : unknown_img}
            alt="user-avatar"
          />
          <div className="flex w-80 flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <Typography
                variant="h5"
                color="white"
                className="cursor-pointer"
                onClick={() => navigate(`${user.username}/`)}
              >
                {user?.username}
              </Typography>
            </div>
            <Typography color="gray">{user?.fullname}</Typography>
          </div>
          {!isCurrentuser && (
            <Button
              color="cyan"
              variant="text"
              className=" font-bold w-40 text-center"
              onClick={handleFollowUser}
              loading={isUpdating}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>

          )}
        </CardHeader>
      </Card>
    )
  );
  //  return <h1>usercard</h1>
};

export default UserCard;
