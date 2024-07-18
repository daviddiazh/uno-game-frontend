import { Flex, Spin } from "antd"
import { LoadingOutlined } from '@ant-design/icons';

export const Spinner = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Flex align="center" gap="middle">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} />
      </Flex>
    </div>
  )
}
