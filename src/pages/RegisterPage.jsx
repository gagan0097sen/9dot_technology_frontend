import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { registerUser } from '../api.js';
import { Input, Button, Card, Typography } from 'antd';
import { toast } from 'react-toastify';

const { Title } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error,setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirm) {
      toast.error('Please fill required fields');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { result } = await registerUser({ name, email, password, confirmPassword: confirm });
      toast.success('Registration successful');
      navigate('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Card className="auth-card" title={<Title level={3}>Register</Title>}>
        <form onSubmit={handleSubmit}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (optional)"
            className="form-field"
          />
            {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="form-field"
          />
          {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="form-field"
          />
              {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
          <Input.Password
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm Password"
            className="form-field"
          />
                {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
          <Button type="primary" htmlType="submit" block loading={loading}>
            Register
          </Button>
        </form>
        <div style={{ marginTop: 16 }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
