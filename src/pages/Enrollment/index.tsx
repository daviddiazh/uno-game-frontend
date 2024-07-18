import { useState } from 'react';
import axios from 'axios';
import type { FormProps } from 'antd';
import { Button, Form, Input, Modal } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { avatars } from '../../utils/avatars';
import { useForm } from '../../hooks/useForm';
import { envConfig } from '../../config/env';

type FieldType = {
  email?: string;
  password?: string;
  name?: string;
};

export const Enrollment = () => {

  const { onInputChange, name, email, password } = useForm({
    name: '',
    email: '',
    password: '',
  });
  const [avatar, setAvatar] = useState('');

  const navigation = useNavigate();

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      return await axios.post(`${envConfig.apiUrl}/api/auth/enrollment`, {...values, avatar});
    },
    onSuccess: () => {
      Modal.success({
        title: 'Registro existoso',
        content: 'Ahora puedes iniciar sesión con tus datos.',
        centered: true,
        closable: true,
        okText: 'Aceptar',
        okButtonProps: {
          className: styles.btn
        },
      });
      return navigation('/');
    },
    onError: (data: any) => {
      return Modal.error({
        title: 'Registro fallido',
        content: data?.response?.data.message,
        centered: true,
        closable: true,
        okText: 'Aceptar',
        okButtonProps: {
          className: styles.btn
        },
      });
    }
  })

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    if ( values.name!.length < 2 || values.email!.length < 5 || values.password!.length < 5 || avatar.length < 10 ) return;

    mutation.mutate(values)
  };

  return (
    <div className={styles['container-page']}>
      <div className={styles.content}>
        <h1>Registrate!</h1>
        <div style={{width: '100%'}}>
          <Form
            name="basic"
            style={{ maxWidth: 'none' }}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<FieldType>
              label="Nombre"
              name="name"
              rules={[{ required: true, message: 'El nombre es obligatorio' }]}
            >
              <Input 
                placeholder="Nombre completo" 
                style={{maxWidth: 450}} 
                value={name} 
                onChange={ onInputChange } 
              />
            </Form.Item>

            <Form.Item<FieldType>
              label="Correo"
              name="email"
              rules={[{ required: true, message: 'El correo es obligatorio' }]}
            >
              <Input 
                placeholder="Correo electrónico" 
                style={{maxWidth: 450}}
                value={email} 
                onChange={ onInputChange } 
              />
            </Form.Item>

            <Form.Item<FieldType>
              label="Contraseña"
              name="password"
              rules={[{ required: true, message: 'La contraseña es obligatoria' }]}
            >
              <Input.Password 
                placeholder="Contraseña" 
                style={{maxWidth: 450}}
                value={password} 
                onChange={ onInputChange } 
              />
            </Form.Item>

            <p className={styles['avatar-text']}>Escoge tu avatar</p>
            <div className={styles['container-avatar']}>
              {
                avatars.map(item => (
                  <div key={item.id} onClick={() => setAvatar(item.url)}>
                    <img src={item.url} alt="Avatar" className={avatar === item.url ? styles['avatar-picked'] : styles.avatar} />
                  </div>
                ))
              }
            </div>

            <Form.Item style={{ display: 'flex', justifyContent: 'center',}}>
              <Button type="primary" htmlType="submit" className={styles.btn}>
                Crear cuenta
              </Button>
            </Form.Item>
          </Form>

          <p 
            onClick={() => navigation('/')}
            className={styles['login-btn']}
          >¿Ya tienes cuenta?, ¡inicia sesión!</p>
        </div>
      </div>
    </div>
  )
}
