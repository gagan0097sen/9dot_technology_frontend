import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { loginUser } from '../api.js';
import { Input, Button, Card, Typography } from 'antd';
import { toast } from 'react-toastify';

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await loginUser({ email, password });
      login(user, token);
      toast.success('Login successful');
      navigate('/tasks');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Card className="auth-card" title={<Title level={3}>Login</Title>}>
        <form onSubmit={handleSubmit}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="form-field"
          />
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="form-field"
          />
          <Button type="primary" htmlType="submit" block loading={loading} >
            Login
          </Button>
        </form>
        <div style={{ marginTop: 16 }}>
          New? <Link to="/register">Create account</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
