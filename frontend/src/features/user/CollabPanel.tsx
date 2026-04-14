import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface CollabPanelProps {
  title: string;
  Icon: ReactNode;
  children?: ReactNode;
  headerActions?: ReactNode;
  allowOverflow?: boolean;
}

function CollabPanel({
  title,
  Icon,
  children,
  headerActions,
  allowOverflow = false,
}: CollabPanelProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        bgcolor: "white",
        border: "1px solid",
        borderColor: "grey.400",
        borderRadius: 2,
        overflow: allowOverflow ? "visible" : "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1,
          bgcolor: "grey.200",
          borderBottom: "1px solid",
          borderColor: "grey.300",
          flexShrink: 0,
        }}
      >
        {Icon}
        <Typography
          variant="body2"
          fontWeight={600}
          color="grey.700"
          sx={{ flexGrow: 1 }}
        >
          {title}
        </Typography>
        {headerActions}
      </Box>

      {/* Content */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflow: allowOverflow ? "visible" : "auto",
          p: 2.5,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default CollabPanel;
