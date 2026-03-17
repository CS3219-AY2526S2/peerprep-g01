import { createTheme } from "@mui/material/styles";

const tableTheme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          paddingLeft: "32px",
          paddingRight: "32px",
        },
      },
    },
  },
});

export default tableTheme;
