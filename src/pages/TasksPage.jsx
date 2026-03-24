import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask } from '../api.js';
import { toast } from 'react-toastify';
import {
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Spin,
  Row,
  Col,
  Typography,
} from 'antd';
import { PlusOutlined, LogoutOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Paragraph } = Typography;
const statusOptions = ['Pending', 'In Progress', 'Completed'];

const TasksPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [detailsTask, setDetailsTask] = useState(null);

  const [form] = Form.useForm();

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks({ status: statusFilter || undefined, search: search || undefined });
      setTasks(data.tasks);
      setTotal(data.total);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load tasks');
      if (err?.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      loadTasks();
    }
  }, [user, statusFilter, search]);

  const openCreate = () => {
    setEditTask(null);
    form.resetFields();
    setModalVisible(true);
  };

  const openEdit = (record) => {
    setEditTask(record);
    form.setFieldsValue({
      ...record,
      dueDate: dayjs(record.dueDate),
    });
    setModalVisible(true);
  };

  const saveTask = async (values) => {
    const payload = {
      title: values.title,
      description: values.description,
      dueDate: values.dueDate.toISOString(),
      status: values.status,
    };
    try {
      if (editTask) {
        await updateTask(editTask._id, payload);
        toast.success('Task updated');
      } else {
        await createTask(payload);
        toast.success('Task created');
      }
      setModalVisible(false);
      loadTasks();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save task');
    }
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: 'Delete task? ',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteTask(id);
          toast.success('Task deleted');
          loadTasks();
        } catch (err) {
          toast.error(err?.response?.data?.message || 'Failed to delete task');
        }
      },
    });
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title', sorter: true },
    { title: 'Description', dataIndex: 'description', key: 'description', render: (t) => <Paragraph ellipsis={{ rows: 1 }}>{t}</Paragraph> },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate', render: (date) => dayjs(date).format('YYYY-MM-DD') },
    {
      title: 'Status', dataIndex: 'status', key: 'status', render: (status) => {
        const color = status === 'Completed' ? 'green' : status === 'In Progress' ? 'blue' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
      filters: statusOptions.map((s) => ({ text: s, value: s })),
      onFilter: (value) => setStatusFilter(value)
    },
    {
      title: 'Actions', key: 'actions', render: (_, record) => (
        <Space>
          <Button onClick={() => setDetailsTask(record)} size="small">Details</Button>
          <Button type="primary" onClick={() => openEdit(record)} size="small">Edit</Button>
          <Button danger onClick={() => confirmDelete(record._id)} size="small">Delete</Button>
        </Space>
      )
    }
  ];

  return (
    <div className="page-container">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Typography.Title level={3}>Tasks: {user?.name || user?.email}</Typography.Title>
        </Col>
        <Col>
          <Button key="logout" icon={<LogoutOutlined />} onClick={() => { logout(); navigate('/login'); }}>
            Logout
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 12 }}>
        <Col xs={24} md={8}>
          <Input
            placeholder="Search title or description"
            allowClear
            value={search}
            onChange={(evt) => setSearch(evt.target.value)}
          />
        </Col>
        <Col xs={24} md={8}>
          <Select
            placeholder="Filter by status"
            style={{ width: '100%' }}
            value={statusFilter || undefined}
            onChange={(val) => setStatusFilter(val)}
            allowClear
          >
            {statusOptions.map((s) => <Select.Option value={s} key={s}>{s}</Select.Option>)}
          </Select>
        </Col>
        <Col xs={24} md={8}> 
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            New Task
          </Button>
        </Col>
      </Row>

      <Spin spinning={loading}>
        <Table
          dataSource={tasks.map((task) => ({ ...task, key: task._id }))}
          columns={columns}
          pagination={{ pageSize: 25, total, showTotal: (t) => `${t} tasks` }}
          scroll={{ x: true }}
        />
      </Spin>

      <Modal
        title={editTask ? 'Edit Task' : 'Create Task'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={saveTask} initialValues={{ status: 'Pending' }}>
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Title is required' }]}> 
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description"> 
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Due Date" name="dueDate" rules={[{ required: true, message: 'Due date is required' }, { validator(_, value) { return value && value.isAfter(dayjs().subtract(1, 'day')) ? Promise.resolve() : Promise.reject(new Error('Future due date required')); } }]}> 
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Status is required' }]}> 
            <Select>
              {statusOptions.map((opt) => <Select.Option value={opt} key={opt}>{opt}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Task details"
        open={!!detailsTask}
        footer={<Button onClick={() => setDetailsTask(null)}>Close</Button>}
        onCancel={() => setDetailsTask(null)}
      >
        {detailsTask && (
          <div>
            <p><strong>Title:</strong> {detailsTask.title}</p>
            <p><strong>Description:</strong> {detailsTask.description || 'N/A'}</p>
            <p><strong>Due Date:</strong> {dayjs(detailsTask.dueDate).format('YYYY-MM-DD')}</p>
            <p><strong>Status:</strong> {detailsTask.status}</p>
            <p><strong>Owner:</strong> {user?.email}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TasksPage;
