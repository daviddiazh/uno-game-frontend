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
    return await axios.post(`${envConfig.apiUrl}/api/auth/find-users`, { userIdFrom: user?._id, nameUserTo: name })
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

  const [ myFriends, setMyFriends ] = useState([]);

  socket?.on('get-friends-list', (users) => {
    const filtered = users?.filter((u: any) => !(u._id === user?._id));
    setMyFriends(filtered)
  });

  const handleFriendsRequest = (userIdFrom: string | undefined, userIdTo: string | undefined, action: string) => {
    if ( action === 'none' ) return;

    if ( action === 'acept' ) {
      // aceptRequest.mutate({userIdFrom: user?._id, userIdTo})
      console.log('aceptar')
    }

    if ( action === 'send' ) {
      sendRequest.mutate({userIdFrom, userIdTo})
    }
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
                {
                  myFriends?.length === 0 
                  ? (<div>
                    <p>Aún no tienes amigos</p>
                  </div>) 
                  : myFriends?.map((userMapped: IUser['user']) => (
                    <div key={userMapped?._id} className={styles['user-container']}>
                      <User {...userMapped} />
                      <Button type="primary" onClick={() => console.log('play')}>
                        Invitar a jugar
                      </Button>
                    </div>
                  ))
                }
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
                    findUsers?.data?.filter((i: any) => !(i._id === user?._id))?.map((userMapped: any) => (
                      <div key={userMapped?._id} className={styles['user-container']}>
                        <User {...userMapped} />
                        <Button 
                          type="primary" 
                          onClick={() => {
                            let action = '';
                            if (userMapped?.sended) {
                              action = 'none';
                            } else if ( userMapped?.received ) {
                              action = 'acept'
                            } else {
                              action = 'send'
                            }
                            handleFriendsRequest(user?._id, userMapped?._id, action)
                          }} 
                          disabled={userMapped?.sended}
                        >
                          { 
                          userMapped?.sended 
                            ? 'Solicitud de amistad envíada' 
                            : userMapped?.received ? 'Aceptar solicitud de amistad' 
                            : 'Envíar Solicitud de amistad' 
                          }
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
                    requestSended?.data?.length === 0 
                    ? (<div>
                      <p>No hay solicitudes de amistad envíadas</p>
                    </div>) 
                    : requestSended?.data?.map((userMapped: any) => (
                      <div key={userMapped?.userIdTo?._id} className={styles['user-container']}>
                        <User {...userMapped?.['userIdTo']} />
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
                  requestReceived?.data?.length === 0 
                  ? (<div>
                    <p>No hay solicitudes por aceptar.</p>
                  </div>) 
                  : requestReceived?.data?.map((userMapped: any) => (
                    <div key={userMapped?.userIdFrom?._id} className={styles['user-container']}>
                      <User {...userMapped?.['userIdFrom']} />
                      <Button type="primary" onClick={() => handleFriendsRequest(userMapped?.['userIdFrom']?._id, user?._id, 'acept')}>
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
