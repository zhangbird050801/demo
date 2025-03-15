import { Box, Container, Text } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/kg")({
  component: KnowledgeGraph,
});

function KnowledgeGraph() {
  return (
    <>
      <Container maxW="full">
        <Box pt={12} m={4}>
          <Text>Welcome to the Knowledge Graph!</Text>
		  {/* TODO: 待完善 */}
        </Box>
      </Container>
    </>
  );
}
