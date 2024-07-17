import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import styles from './styles.module.css';
import { avatars } from '../../utils/avatars';

type FieldType = {
  email?: string;
  password?: string;
  name?: string;
};

export const Enrollment = () => {

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
  };
  
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={styles['container-page']}>
      <div className={styles.content}>
        <h1>Registro!</h1>
        <div style={{width: '100%'}}>
          <Form
            name="basic"
            style={{ maxWidth: 'none' }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<FieldType>
              label="Nombre"
              name="name"
              rules={[{ required: true, message: 'El nombre es obligatorio' }]}
            >
              <Input placeholder="Nombre completo" style={{maxWidth: 450}} />
            </Form.Item>

            <Form.Item<FieldType>
              label="Correo"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input placeholder="Correo electrónico" style={{maxWidth: 450}} />
            </Form.Item>

            <Form.Item<FieldType>
              label="Contraseña"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="Contraseña" style={{maxWidth: 450}} />
            </Form.Item>

            <p>Escoge tu avatar</p>
            <div className={styles['container-avatar']}>
              {
                avatars.map(item => (
                  <div key={item.id} onClick={() => console.log({item})}>
                    <img src={item.url} alt="Avatar" className={styles.avatar} />
                  </div>
                ))
              }
            </div>

            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
              <Button type="primary" htmlType="submit" className={styles.btn}>
                Crear cuenta
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
