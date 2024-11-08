import { Stack, Typography } from "@mui/material";
import AllSeen from "../assets/allseen.png.svg";

const InfoUpdates = () => {
  return (
    <Stack sx={{ alignItems: "center" }}>
      <img
        src={AllSeen}
        alt="Finished"
        style={{ width: "82px", height: "82px" }}
      />
      <Typography>You've seen all the updates</Typography>
      <Typography color="#737373">
        You have viewed all new publications
      </Typography>
    </Stack>
  );
};
export default InfoUpdates;
