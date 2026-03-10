import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function SearchBar() {
  return (
    <TextField
      variant="outlined"
      placeholder="Search"
      name="search"
      type="text"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 4,
          height: 32,
          width: 300,
          fontSize: 13,
        },
        "& .MuiOutlinedInput-input": {
          py: 0,
        },
      }}
    ></TextField>
  );
}

export default SearchBar;
