import { useEffect, useState } from "react";
import { SeeAllUsers, UserCard } from "..";
import { Button, Typography } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { auth } from "../../firebase/config";

const SuggestedUsers = () => {
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);

  const { profile, allAccounts } = useSelector((state) => state.profile);
  const currentUsername = auth?.currentUser?.displayName;

  const filterAccounts = () => {
    const account = allAccounts?.filter(
      (item) => !profile?.following?.includes(item.username) && item.username !== currentUsername
    );
    setAccounts(account);
  };

  useEffect(() => {
    if (allAccounts && accounts.length <= 5) {
      filterAccounts();
    }
  }, [allAccounts]);

  console.log(accounts);

  const handleOpen = () => setOpen((prev) => !prev);
  return (
    <>
      <div className="mt-10 w-96">
        <UserCard user={profile} isCurrentuser={true} />
        <div className="flex justify-between">
          <Typography className="text-gray-600">Suggested for you</Typography>
          <Button
            variant="text"
            className="text-gray-600 p-0"
            onClick={handleOpen}
          >
            See all
          </Button>
        </div>

        {accounts?.map((user, index) => (
          <UserCard user={user} key={index} />
        ))}
        <Typography color="gray" className="mt-3">
          © 2024 Instagram Made by Hasanboy
        </Typography>
      </div>
      <SeeAllUsers open={open} handleOpen={handleOpen} />
    </>
  );
};

export default SuggestedUsers;
