import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  PowerIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { PlusCircle } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CreatePost, Search } from "../";
import { useDispatch, useSelector } from "react-redux";
import { reloadProfile } from "../../slice/profileSlice";

const Sidebar = ({ inOnProfile }) => {
  const [showModul, setShowModul] = useState(false);

  const { profile } = useSelector((state) => state.profile);

  const username = auth?.currentUser?.displayName;

  const handleShowModul = (modul) => {
    setShowModul(modul);
  };
  const navigate = useNavigate();

  const logout = () => {
    signOut(auth);
    navigate("/login");
  };

  const dispatch = useDispatch()

  const navigateprofile = () => {
    if (inOnProfile) {

      navigate(`/${username}/`)
      dispatch(reloadProfile(true))
    }
  }

  return (
    <>
      <Card className="h-[100vh] w-full max-w-[20rem] p-4 fixed top-0 left-0 bg-black border-4 rounded-none border-transparent  border-r-white ">
        <div className="mb-2 p-4">
          <Typography variant="h5" color="white">
            <Link to={"/"}>Instagram</Link>
          </Typography>
        </div>
        <List>
          <Link to={"/"}>
            <ListItem className="text-white hover:text-black">
              <ListItemPrefix>
                <HomeIcon className="h-5 w-5" />
              </ListItemPrefix>
              Home
            </ListItem>
          </Link>

          <ListItem
            onClick={() => setShowModul("search")}
            className="text-white hover:text-black"
          >
            <ListItemPrefix>
              <MagnifyingGlassIcon className="h-5 w-5" />
            </ListItemPrefix>
            Search
          </ListItem>
          <ListItem
            onClick={() => setShowModul("create")}
            className="text-white hover:text-black"
          >
            <ListItemPrefix>
              <PlusCircle className="h-5 w-5" />
            </ListItemPrefix>
            Create
          </ListItem>
          <ListItem
            className="text-white hover:text-black"
            onClick={() => navigateprofile()}
          >
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Profile
          </ListItem>
          <ListItem
            className="text-white hover:text-black"
            onClick={() => logout()}
          >
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </List>
      </Card>
      {showModul === "search" && <Search handleShowModul={handleShowModul} />}
      {showModul === "create" && (
        <CreatePost handleShowModul={handleShowModul} />
      )}
    </>
  );
};

export default Sidebar;
