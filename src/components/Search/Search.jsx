import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";
import { UserCard } from "../";
import { useSelector } from "react-redux";

const Search = ({ handleShowModul }) => {
  const [username, setUsername] = useState("");
  const [searchingUser, setSearchingUser] = useState([]);
  const [openModal, setopenModal] = useState(true);
  const { allAccounts, profile } = useSelector((state) => state.profile);

  useEffect(() => {
    if (allAccounts) {
      searchUserHandler();
    }
  }, [username]);

  useEffect(() => {
    console.log("search render");
  }, []);

  const searchUserHandler = () => {
    if (username.trim() === "") {
      setSearchingUser(
        allAccounts.filter(
          (item) =>
            item.username.toLowerCase() !== profile.username.toLowerCase()
        )
      );
    } else {
      const searching = allAccounts.filter((item) =>
        item.username.toLowerCase().includes(username.trim().toLowerCase())
      );
      const withoutAuth = searching.filter(
        (item) => item.username.toLowerCase() !== profile.username.toLowerCase()
      );
      setSearchingUser(withoutAuth);
    }
  };

  const closeHandler = (modal) => {
    setopenModal(false);
    setTimeout(() => {
      handleShowModul(modal);
    }, 500);
  };

  console.log(searchingUser);

  return (
    <>
      <Dialog
        open={openModal}
        handler={() => closeHandler("")}
        className="shadow-none max-w-[500px] bg-black"
      >
        <Card className="mx-auto w-full max-w-[500px] bg-black">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="white">
              Search
            </Typography>
            <Input
              label="Username"
              color="white"
              placeholder="Search by username..."
              className="text-white"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <div className="users overflow-y-auto h-96">
              {searchingUser.map((profile, index) => (
                <UserCard user={profile} key={index} />
              ))}
            </div>
          </CardBody>
          <CardFooter className="pt-0 text-right">
            <Button
              variant="text"
              onClick={() => closeHandler("")}
              className="w-20 mx-auto text-white"
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
};

export default Search;
