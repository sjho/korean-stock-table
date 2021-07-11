import { Box } from "@chakra-ui/react";

function Layout({ children }) {
  return (
    <Box minH="100vh" bg="orange.100">
      {children}
    </Box>
  );
}

export { Layout };
