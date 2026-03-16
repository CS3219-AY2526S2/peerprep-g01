import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface MyInputProps {
  submitHandler: (keyword: string) => void;
}

function SearchBar({ submitHandler }: MyInputProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        submitHandler(form.search.value);
      }}
    >
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
    </form>
  );
}

export default SearchBar;
