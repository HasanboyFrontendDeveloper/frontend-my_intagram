import {
  Card,
  CardHeader,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import unknown_img from "../../assets/Unknown_person.jpg";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const UserComment = ({ comment }) => {
  const [user, setUser] = useState([])
  const { allAccounts } = useSelector(state => state.profile);

  useEffect(() => {
    const account = allAccounts.filter((user) => user.username === comment.username)
    if (account) {
      setUser(account[0]);
    }
  }, [])


  return (
    <Card shadow={false} className="bg-transparent w-500 py-1">
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
          alt="tania andrew"
        />
        <div className="flex w-full flex-col gap-0.5">
          <div className="flex items-center justify-between">
            <Typography variant="h6" color="text-gray-100" className="text-xs">
                {user?.username}
            </Typography>
          </div>
          <Typography color="white">{comment.comment}</Typography>
        </div>
      </CardHeader>
    </Card>
  );
}

export default UserComment