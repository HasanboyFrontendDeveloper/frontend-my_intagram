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
  Textarea,
} from "@material-tailwind/react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, imgdb } from "../../firebase/config";
import { useForm } from "../../hooks";
import { useSelector } from "react-redux";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { CircleCheckBig, CircleX } from "lucide-react";

const EditProfile = ({ open, handleOpen }) => {
  const { allAccounts, profile } = useSelector((state) => state.profile);


  const [photo, setPhoto] = useState(profile?.userImg);

  const [value, setValue] = useForm({
    username: profile?.username,
    fullname: profile?.fullname,
    bio: profile?.bio,
  });

  const isUsernameFree = () => {
    const a = allAccounts?.find((user) => user.username === value.username);
    return !a || value.username === profile?.username;
  };

  useEffect(() => {
    isUsernameFree();
  }, [value.username]);

  const username = auth?.currentUser?.displayName;

  const submitHandler = async (e) => {
    e.preventDefault();
    const imgRef = ref(imgdb, `profile/${v4()}`);
    await uploadBytes(imgRef, photo).then(() =>
      getDownloadURL(imgRef).then((url) => setPhoto(url))
    );

    const userRef = doc(db, "users", username);
    const accountsRef = doc(db, "accounts", username);
    const user = {
      username: value.username,
      fullname: value.fullname,
      bio: value.bio,
      userImg: photo,
    };
    await setDoc(userRef, user, { merge: true })
      .then(() => window.location.reload())
      .catch(() => alert("Failure"));
    await setDoc(accountsRef, user, { merge: true });
  };

  useEffect(() => {
    if (profile) {
      setValue({
        username: profile?.username,
        fullname: profile?.fullname,
        bio: profile?.bio,
      });
    }
  }, [profile]);

  return (
    <>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem] bg-black">
          <form onSubmit={submitHandler}>
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4" color="white">
                Edit Profile
              </Typography>

              <Typography className="-mb-2" variant="h6">
                Your Username
              </Typography>
              <div className="flex relative">
                <Input
                  label="Username"
                  size="lg"
                  color="white"
                  id="username"
                  onChange={setValue}
                  value={value.username}
                />

                {value.username !== "" ? (
                  isUsernameFree() ? (
                    <CircleCheckBig className="check text-green-500 absolute right-2 top-2" />
                  ) : (
                    <CircleX className="check text-red-500 absolute right-2 top-2" />
                  )
                ) : null}
              </div>
              <Typography className="-mb-2" variant="h6">
                Your Full Name
              </Typography>
              <Input
                label="Full Name"
                size="lg"
                color="white"
                id="fullname"
                onChange={setValue}
                value={value.fullname}
              />
              <Typography className="-mb-2" variant="h6">
                Uplad Photo
              </Typography>
              <label
                htmlFor="inputFile"
                className="border rounded p-3 text-white"
              >
                Choose Image
                <input
                  type="file"
                  hidden
                  id="inputFile"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
              </label>
              <Typography className="-mb-2" variant="h6">
                Your BIO
              </Typography>
              <Textarea
                label="Bio"
                className="text-white border-white"
                id="bio"
                onChange={setValue}
                value={value.bio}
              />
            </CardBody>
            <CardFooter className="pt-0">
              <Button variant="gradient" type="submit" fullWidth>
                Submit
              </Button>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </>
  );
};

export default EditProfile;
