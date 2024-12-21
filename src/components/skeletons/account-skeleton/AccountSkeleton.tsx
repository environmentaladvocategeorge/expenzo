import { Box, Skeleton, useTheme } from "@mui/material";

const AccountSkeleton = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: theme.spacing(1.5),
        borderBottom: `1px solid ${theme.palette.neutral.gray}`,
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
          <Skeleton variant="text" width={120} height={20} />
          <Skeleton variant="text" width={100} height={16} />
        </Box>
      </Box>

      <Box>
        <Skeleton variant="text" width={80} height={20} />
        <Skeleton variant="text" width={100} height={16} />
      </Box>
    </Box>
  );
};

export default AccountSkeleton;
