import { useContext, useState } from "react";
import { Button, GetProp, Input, Menu, MenuProps, Space, Spin } from "antd";
import { Navbar } from "../../../components/Navbar";
import styles from './styles.module.css';
import { TeamOutlined, UserAddOutlined, SendOutlined, LoadingOutlined } from '@ant-design/icons';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { envConfig } from "../../../config/env";
import { useForm } from "../../../hooks/useForm";
import { IUser } from "../../../interfaces/user";
import { AuthContext } from "../../../context/auth/AuthContext";

type MenuItem = GetProp<MenuProps, 'items'>[number];

export const Options = () => {
  const { user } = useContext(AuthContext);

  const [ option, setOption ] = useState<string>('0');

  const { name, onInputChange } = useForm({
    name: '',
  });

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

  const { data: findUsers, isLoading, refetch } = useQuery<any>({ queryKey: ['users'], queryFn: async () => {
    return await axios.post(`${envConfig.apiUrl}/api/auth/find-users`, { name })
  } })
  
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
                
              </div>
            )
          }

          {
            option === '1' && (
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
                  <Button type="primary" style={{padding: '20px 15px'}} onClick={() => refetch()} disabled={isLoading}>
                    {
                      isLoading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 20, color: '#fff' }} spin />} /> : 'Buscar'
                    }
                  </Button>
                </Space.Compact>
                
                <div style={{ marginTop: 40 }}>
                  {
                    findUsers?.data?.filter((i: any) => !(i._id === user?._id))?.map((userMapped: IUser['user']) => (
                      <div key={userMapped?._id} className={styles['user-container']}>
                        <div className={styles['user']}>
                          <div className={styles['badge-container']}>
                            <img src={userMapped?.avatar} alt={`Avatar de ${userMapped?.name}`} className={styles.avatar} />
                            <div className={styles[user?.online ? 'badge-online' : 'badge-off']} />
                          </div>
                          <p>{userMapped.name}</p>
                        </div>
                        <Button type="primary">
                          Envíar Solicitud de amistad
                        </Button>
                      </div>
                    ))
                  }
                </div>
              </div>
            )
          }

          {
            option === '2' && (
              <div>
                
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
