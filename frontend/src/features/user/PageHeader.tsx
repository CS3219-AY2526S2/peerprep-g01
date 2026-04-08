import { Box, useTheme } from "@mui/material";
import logo from "../../assets/peerprep-logo-nobg.png";

function PageHeader() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: 0,
        display: "flex",
        alignItems: "center",
        bgcolor: "white",
        borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
      }}
    >
      <img
        src={logo}
        alt="logo icon"
        style={{
          width: "100%",
          maxWidth: 150,
          filter: "invert(20%)",
          padding: theme.spacing(0.8, 1, 0.6, 1),
        }}
      />
    </Box>
  );
}

export default PageHeader;
