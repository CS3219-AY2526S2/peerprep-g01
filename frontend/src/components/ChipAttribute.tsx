import { Chip } from "@mui/material";

function ChipAttribute({
  label,
  color,
}: {
  label: string;
  color: Record<string | number, string>;
}) {
  return (
    <Chip
      variant="outlined"
      label={label}
      size="small"
      sx={{
        borderColor: color[400],
        bgcolor: color[50],
        color: color[400],
      }}
    />
  );
}

export default ChipAttribute;
