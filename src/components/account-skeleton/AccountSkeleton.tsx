import { Box, Skeleton, useTheme } from "@mui/material";

const AccountSkeleton = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: theme.spacing(2),
        px: theme.spacing(2),
        border: `1px solid ${theme.palette.neutral.gray}`,
        borderRadius: theme.spacing(1),
        mb: theme.spacing(2),
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
        <Box sx={{ marginLeft: theme.spacing(2) }}>
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="text" width={100} height={20} />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <Skeleton variant="text" width={80} height={24} />
        <Skeleton variant="text" width={100} height={20} />
      </Box>
    </Box>
  );
};

export default AccountSkeleton;
