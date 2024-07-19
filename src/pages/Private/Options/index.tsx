import { useState } from "react";
import { GetProp, Menu, MenuProps } from "antd";
import { Navbar } from "../../../components/Navbar";
import styles from './styles.module.css';
import { TeamOutlined, UserAddOutlined, SendOutlined } from '@ant-design/icons';

type MenuItem = GetProp<MenuProps, 'items'>[number];

export const Options = () => {

  const [ option, setOption ] = useState<string>('0');

  const menuItems: MenuItem[] = [
    {
      key: '0',
      label: 'Mis amigos',
      icon: <TeamOutlined />,
      onClick: () => setOption('0'),
    },
    {
      key: '1',
      icon: <UserAddOutlined />,
      label: 'Agregar amigo(a)',
      onClick: () => setOption('1'),
    },
    {
      key: '2',
      icon: <SendOutlined />,
      label: 'Solicitudes enviadas',
      onClick: () => setOption('2'),
    },
  ];

  const item: any = menuItems.find(item => item?.key === option);
  
  return (
    <div className={styles.container}>
      <Navbar /> 
      <div className={styles['menu-container']}>
        <Menu
          style={{ width: 270, }}
          defaultSelectedKeys={[option]}
          mode={'vertical'}
          theme='light'
          items={menuItems}
          className={styles['menu']}
        />

        <div>
          <h1 className={styles['section-title']}>{item?.label}</h1>
        </div>
      </div>
    </div>
  )
}
