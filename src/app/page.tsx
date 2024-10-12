"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";

const Home = () => {
  const theme = useTheme();
  return (
    <Box>
      <Typography variant="h2" sx={{ color: theme.palette.primary.main }}>
        Welcome, Angie
      </Typography>
      <Typography>
        Welcome to Earth Watcher, the center for all climate disasters.
      </Typography>
      <Box
        sx={{
          margin: theme.spacing(6),
          borderRadius: theme.spacing(4),
          padding: theme.spacing(3),
          backgroundColor: theme.palette.primary.dark,
        }}
      >
        <Typography variant="h2" sx={{ color: theme.palette.neutral.white }}>
          Recent Disasters
        </Typography>
        <Typography
          sx={{
            color: theme.palette.neutral.white,
            marginTop: theme.spacing(2),
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
          lacus leo, egestas vel justo sit amet, mollis semper nisi. Donec non
          convallis enim, quis tincidunt velit. Vivamus vel volutpat libero.
          Aliquam mauris dolor, condimentum eu dictum at, viverra eu tortor. Sed
          id imperdiet dolor, nec luctus augue. Nam et enim velit. Nullam a urna
          at tellus molestie mollis nec quis ex. Vivamus pharetra a lorem nec
          porttitor. Morbi egestas nulla nibh, id aliquam libero mollis at.
          Integer vel vulputate ex, eu dignissim augue.
        </Typography>

        <Stack direction="row" spacing={2} sx={{ marginTop: theme.spacing(4) }}>
          <Box
            sx={{
              flex: 1,
              borderRadius: theme.spacing(2),
              padding: theme.spacing(2),
              backgroundColor: theme.palette.primary.light,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: theme.palette.neutral.white }}
            >
              Recent Updates
            </Typography>
            <Typography sx={{ color: theme.palette.neutral.white }}>
              In hac habitasse platea dictumst. Vivamus egestas ullamcorper nibh
              vitae vehicula. Mauris placerat ultricies purus. Interdum et
              malesuada fames ac ante ipsum primis in faucibus. Aliquam nec
              convallis est, et consequat massa. Nulla ut nibh vestibulum,
              egestas velit vel, gravida turpis. Maecenas a magna sit amet
              tellus ornare pulvinar rutrum sit amet tortor..
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              borderRadius: theme.spacing(2),
              padding: theme.spacing(2),
              backgroundColor: theme.palette.primary.main,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: theme.palette.neutral.white }}
            >
              Resources
            </Typography>
            <Typography sx={{ color: theme.palette.neutral.white }}>
              Ut suscipit non eros in consectetur. Phasellus interdum, erat
              vitae feugiat auctor, lorem felis euismod mi, id pharetra mauris
              libero vitae mauris. Vestibulum bibendum sagittis pretium. Nunc
              massa arcu, commodo sed dignissim blandit, dictum non leo. Donec
              cursus consectetur massa, vel blandit elit aliquet non. Proin
              blandit ultrices erat, id malesuada nisi. Nam non dui felis. Donec
              in diam libero. Sed euismod metus a dui elementum, quis posuere
              urna vehicula. Donec pellentesque lectus nec metus vestibulum
              feugiat.
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Home;
