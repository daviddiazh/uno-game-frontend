import { useContext, useState } from "react";
import { Button, GetProp, Input, Menu, MenuProps, Space, Spin } from "antd";
import { Navbar } from "../../../components/Navbar";
import styles from './styles.module.css';
import { TeamOutlined, LoadingOutlined } from '@ant-design/icons';
import { useForm } from "../../../hooks/useForm";
import { IUser } from "../../../interfaces/user";
import { AuthContext } from "../../../context/auth/AuthContext";
import { User } from "../../../components/User";
import { SocketContext } from "../../../context/sockets/SocketContext";

type MenuItem = GetProp<MenuProps, 'items'>[number];

export const Options = () => {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const [ option, setOption ] = useState<string>('0');

  const { name, onInputChange } = useForm({
    name: '',
  });

  const menuItems: MenuItem[] = [
    {
      key: '0',
      label: 'Usuarios',
      icon: <TeamOutlined />,
      onClick: () => setOption('0'),
    },
  ];

  const item: any = menuItems.find(item => item?.key === option);

  const [ users, setUsers ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  
  socket?.on('get-users-list', (users) => {
    const filtered = users?.filter((u: any) => u._id != user?._id);
    setUsers(filtered)
    setIsLoading(false);
  });

  const sendEvent = () => {
    setIsLoading(true);
    socket?.emit('get-users-list', name);
    setIsLoading(false);
  }

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

        <div style={{width: '100%'}}>
          <h1 className={styles['section-title']}>{item?.label}</h1>

          {
            option === '0' && (
              <div>
                <Space.Compact style={{ width: '100%' }}>
                  <Input 
                    placeholder="Buscar personas" 
                    size="large" 
                    value={name}
                    onChange={onInputChange}
                    name="name"
                    autoComplete="off"
                  />
                  <Button type="primary" style={{padding: '20px 15px'}} onClick={sendEvent} disabled={isLoading}>
                    {
                      isLoading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 20, color: '#fff' }} spin />} /> : 'Buscar'
                    }
                  </Button>
                </Space.Compact>

                <div style={{ marginTop: 30 }}>
                  {
                    users?.map((userMapped: IUser['user']) => (
                      <div key={userMapped?._id} className={styles['user-container']}>
                        <User {...userMapped} />
                        <Button type="primary" onClick={() => console.log('play')}>
                          Invitar a jugar
                        </Button>
                      </div>
                    ))
                  }
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
