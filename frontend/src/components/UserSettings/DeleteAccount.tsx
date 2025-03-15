import { Container, Heading, Text } from "@chakra-ui/react"

import DeleteConfirmation from "./DeleteConfirmation"

const DeleteAccount = () => {
  return (
    <Container maxW="full">
      <Heading size="sm" py={4}>
        删除账户
      </Heading>
      <Text>
        该行为将永久删除您的数据和与您的帐户相关的所有内容。
      </Text>
      <DeleteConfirmation />
    </Container>
  )
}
export default DeleteAccount
