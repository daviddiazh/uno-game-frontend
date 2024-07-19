import { useContext, useState } from "react";
import { Button, GetProp, Input, Menu, MenuProps, Modal, Space, Spin } from "antd";
import { Navbar } from "../../../components/Navbar";
import styles from './styles.module.css';
import { TeamOutlined, UserAddOutlined, SendOutlined, LoadingOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from "@tanstack/react-query";
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
    {
      key: '3',
      icon: <UserAddOutlined />,
      label: 'Solicitudes recibidas',
      onClick: () => setOption('3'),
    },
  ];

  const item: any = menuItems.find(item => item?.key === option);

  const { data: findUsers, isLoading: isLoadingFindUsers, refetch: refetchFindUsers } = useQuery<any>({ queryKey: ['users'], queryFn: async () => {
    return await axios.post(`${envConfig.apiUrl}/api/auth/find-users`, { name })
  } })

  const sendRequest = useMutation({
    mutationFn: async (values: any) => {
      return await axios.post(`${envConfig.apiUrl}/api/friends-request/send`, values);
    },
    onSuccess: () => {
      Modal.success({
        title: 'Solicitud de amistad envíada',
        content: 'Ahora puedes jugar con ese usuario.',
        centered: true,
        closable: true,
        okText: 'Aceptar',
        okButtonProps: {
          className: styles.btn
        },
      });
      refetchFindUsers();
      refetchSended();
      refetchReceived();
    },
    onError: () => {
      return Modal.error({
        title: '¡Ups! Error al envíar la solicitud',
        content: 'Parece que ocurrio un error al envíar tu solicitud de amistad a ese usuario.',
        centered: true,
        closable: true,
        okText: 'Aceptar',
        okButtonProps: {
          className: styles.btn
        },
      });
    }
  })

  const { data: requestSended, refetch: refetchSended } = useQuery<any>({ queryKey: ['sended'], queryFn: async () => {
    return await axios.get(`${envConfig.apiUrl}/api/friends-request/sended/${user?._id}`,)
  } })

  const { data: requestReceived, refetch: refetchReceived } = useQuery<any>({ queryKey: ['received'], queryFn: async () => {
    return await axios.get(`${envConfig.apiUrl}/api/friends-request/received/${user?._id}`,)
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
                  <Button type="primary" style={{padding: '20px 15px'}} onClick={() => refetchFindUsers()} disabled={isLoadingFindUsers}>
                    {
                      isLoadingFindUsers ? <Spin indicator={<LoadingOutlined style={{ fontSize: 20, color: '#fff' }} spin />} /> : 'Buscar'
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
                        <Button type="primary" onClick={() => sendRequest.mutate({userIdFrom: user?._id, userIdTo: userMapped?._id})}>
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
              <div style={{ marginTop: 40 }}>
                  {
                    requestSended?.data?.map((userMapped: any) => (
                      <div key={userMapped?.userIdTo?._id} className={styles['user-container']}>
                        <div className={styles['user']}>
                          <div className={styles['badge-container']}>
                            <img src={userMapped?.userIdTo?.avatar} alt={`Avatar de ${userMapped?.userIdTo?.name}`} className={styles.avatar} />
                            <div className={styles[user?.online ? 'badge-online' : 'badge-off']} />
                          </div>
                          <p>{userMapped?.userIdTo?.name}</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
            )
          }

          {
            option === '3' && (
              <div>
                {
                  requestReceived?.data?.map((userMapped: any) => (
                    <div key={userMapped?.userIdFrom?._id} className={styles['user-container']}>
                      <div className={styles['user']}>
                        <div className={styles['badge-container']}>
                          <img src={userMapped?.userIdFrom?.avatar} alt={`Avatar de ${userMapped?.userIdFrom?.name}`} className={styles.avatar} />
                          <div className={styles[user?.online ? 'badge-online' : 'badge-off']} />
                        </div>
                        <p>{userMapped?.userIdFrom?.name}</p>
                      </div>
                      <Button type="primary" onClick={() => console.log('aceptar solicitud')}>
                        Aceptar solicitud de amistad
                      </Button>
                    </div>
                  ))
                }
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
