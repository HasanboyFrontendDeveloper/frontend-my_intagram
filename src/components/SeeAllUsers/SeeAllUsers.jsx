import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { UserCard } from "../";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { auth } from "../../firebase/config";

const SeeAllUsers = ({ open, handleOpen }) => {
  const [accounts, setAccounts] = useState([]);
  const { allAccounts } = useSelector((state) => state.profile);

  const currentUsername = auth?.currentUser?.displayName;

  const filterAccounts = () => {
    const account = allAccounts?.filter(
      (item) => item.username !== currentUsername
    );
    setAccounts(account);
  };

  useEffect(() => {
    if (allAccounts) {
      filterAccounts();
    }
  }, [allAccounts]);

  return (
    <>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none mx-auto"
      >
        <Card className="mx-auto w-[450px]  bg-black">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="white">
              Suggested for you
            </Typography>
            <div className="overflow-y-scroll h-96">
              {accounts?.map((user, index) => (
                <UserCard user={user} key={index} />
              ))}
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="text" color="red" onClick={handleOpen} fullWidth>
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
};

export default SeeAllUsers;
