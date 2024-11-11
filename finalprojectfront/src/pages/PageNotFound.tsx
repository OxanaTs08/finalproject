import { Box, Stack, Typography } from "@mui/material";
import bcgImage1 from "../assets/BackgroundLoginPage.png";

const PageNotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "80px",
        gap: "30px",
      }}
    >
      <Box>
        <img
          src={bcgImage1}
          alt="background"
          style={{
            width: "380px",
            height: "581px",
          }}
        />
      </Box>
      <Stack sx={{ gap: "10px" }}>
        <Typography sx={{ fontWeight: "bold" }}>
          {" "}
          Oops! Page Not Found (404 Error){" "}
        </Typography>
        <Typography>
          We're sorry, but the page you're looking for doesn't seem to exist. If
          you typed the URL manually, please double-check the spelling. If you
          clicked on a link, it may be outdated or broken.
        </Typography>
      </Stack>
    </Box>
  );
};
export default PageNotFound;
