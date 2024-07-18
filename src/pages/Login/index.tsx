import axios from 'axios';
import type { FormProps } from 'antd';
import { Button, Form, Input, Modal } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { useForm } from '../../hooks/useForm';
import { envConfig } from '../../config/env';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

type FieldType = {
  email?: string;
  password?: string;
  name?: string;
};

export const Login = () => {

  const { onInputChange, email, password } = useForm({
    email: '',
    password: '',
  });

  const navigation = useNavigate();

  const { login } = useContext(AuthContext);

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      return await axios.post(`${envConfig.apiUrl}/api/auth/login`, values);
    },
    onSuccess: ({data}: any) => {
      console.log(data)
      login(data);
      return navigation('/');
    },
    onError: () => {
      return Modal.error({
        title: '¡Ups! Error al iniciar sesión',
        content: 'Revisa los datos y vuelve a intentarlo',
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
    if ( values.email!.length < 5 || values.password!.length < 5) return;

    mutation.mutate(values)
  };

  return (
    <div className={styles['container-page']}>
      <div className={styles.content}>
        <h1>Inicia sesión!</h1>
        <div style={{width: '100%'}}>
          <Form
            name="basic"
            style={{ maxWidth: 'none' }}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
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

            <Form.Item style={{ display: 'flex', justifyContent: 'center',}}>
              <Button type="primary" htmlType="submit" className={styles.btn}>
                Iniciar sesión
              </Button>
            </Form.Item>
          </Form>

          <p 
            onClick={() => navigation('/enrollment')}
            className={styles['login-btn']}
          >No tienes cuenta?, ¡registrate acá!</p>
        </div>
      </div>
    </div>
  )
}
