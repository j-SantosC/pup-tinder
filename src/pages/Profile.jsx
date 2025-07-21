import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Card,
  Avatar,
  Typography,
  Divider,
  Spin,
  Upload,
  Button,
  message,
  Form,
  Input,
  Space,
  Modal,
  List,
  Popconfirm,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./Profile.css";

const { Title, Text } = Typography;

const ProfileWithUsers = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [currentUser, setCurrentUser] = useState(null);
  const [dogs, setDogs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  const fetchCurrentUser = async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch("http://localhost:3001/api/users/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setCurrentUser(data);
      setDogs(data.dogs || []);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentUser();
    }
  }, [isAuthenticated]);

  const handleUpload = async ({ file }) => {
    if (!currentUser?._id) return;

    const token = await getAccessTokenSilently();
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `http://localhost:3001/api/users/${currentUser._id}/image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");
      message.success("Imagen subida correctamente");
      fetchCurrentUser(); // Refresh user data
    } catch (err) {
      console.error("Upload error:", err);
      message.error("Error al subir imagen");
    }
  };

  const handleAddDog = async (values) => {
    if (!currentUser?._id || !values.dogImage) return;

    setUploading(true);
    const token = await getAccessTokenSilently();
    const formData = new FormData();
    formData.append("image", values.dogImage.file);
    formData.append("name", values.name);
    formData.append("breed", values.breed);
    formData.append("age", values.age);

    try {
      const res = await fetch(
        `http://localhost:3001/api/users/${currentUser._id}/dogs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to add dog");

      message.success("Perro agregado correctamente");
      setIsModalVisible(false);
      form.resetFields();
      fetchCurrentUser(); // Refresh user data
    } catch (err) {
      console.error("Add dog error:", err);
      message.error("Error al agregar perro");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDog = async (dogId) => {
    const token = await getAccessTokenSilently();

    try {
      const res = await fetch(
        `http://localhost:3001/api/users/${currentUser._id}/dogs/${dogId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete dog");

      message.success("Perro eliminado correctamente");
      fetchCurrentUser(); // Refresh user data
    } catch (err) {
      console.error("Delete dog error:", err);
      message.error("Error al eliminar perro");
    }
  };

  if (!isAuthenticated) return <p>Please log in to view your profile.</p>;
  if (!currentUser)
    return (
      <div className="spin-container">
        <Spin tip="Loading profile..." size="large" />;
      </div>
    );

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <Card
        bordered
        hoverable
        style={{ textAlign: "center", marginBottom: "1rem" }}
      >
        <Avatar
          src={currentUser?.imageUrl}
          size={100}
          style={{ marginBottom: "1rem" }}
        />
        <Title level={3}>{currentUser.name}</Title>
        <Text type="secondary">{currentUser.email}</Text>

        <Divider />

        <Upload
          customRequest={handleUpload}
          showUploadList={false}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>Upload Profile Image</Button>
        </Upload>
      </Card>

      {/* Dogs Section */}
      <Card title="Mis Perros" bordered hoverable>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button
            color="default"
            variant="outlined"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            style={{ marginBottom: "1rem" }}
          >
            Add Pup
          </Button>

          {dogs.length === 0 ? (
            <Text type="secondary">No pups yet</Text>
          ) : (
            <List
              dataSource={dogs}
              renderItem={(dog) => (
                <List.Item
                  actions={[
                    <Popconfirm
                      title="¿Estás seguro de eliminar este perro?"
                      onConfirm={() => handleDeleteDog(dog._id)}
                      okText="Sí"
                      cancelText="No"
                    >
                      <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={dog.imageUrl} size={64} />}
                    title={dog.name}
                    description={`${dog.breed} - ${dog.age} años`}
                  />
                </List.Item>
              )}
            />
          )}
        </Space>
      </Card>

      {/* Add Dog Modal */}
      <Modal
        title="Agregar Nuevo Perro"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleAddDog} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre"
            rules={[
              {
                required: true,
                message: "Por favor ingresa el nombre del perro",
              },
            ]}
          >
            <Input placeholder="Nombre del perro" />
          </Form.Item>

          <Form.Item
            name="breed"
            label="Raza"
            rules={[{ required: true, message: "Por favor ingresa la raza" }]}
          >
            <Input placeholder="Raza del perro" />
          </Form.Item>

          <Form.Item
            name="age"
            label="Edad"
            rules={[{ required: true, message: "Por favor ingresa la edad" }]}
          >
            <Input placeholder="Edad en años" type="number" />
          </Form.Item>

          <Form.Item
            name="dogImage"
            label="Foto del Perro"
            rules={[{ required: true, message: "Por favor sube una foto" }]}
          >
            <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
              <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={uploading}>
                Agregar Perro
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfileWithUsers;
