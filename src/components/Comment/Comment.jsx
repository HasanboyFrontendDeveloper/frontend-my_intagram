import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { UserComment } from "../";

const Comment = ({ comments }) => {
  return (
    <>
      <Card className=" w-[450px]  bg-black">
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="white">
            Comments
          </Typography>
          <div className="overflow-y-auto h-96">
            {comments && comments.map((comment) => (<UserComment comment={comment} />))}
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default Comment;
