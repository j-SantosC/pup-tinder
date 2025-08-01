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
  Row,
  Col,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "./Profile.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ProfileWithUsers = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [currentUser, setCurrentUser] = useState(null);
  const [dogs, setDogs] = useState([]);
  const [isDogModalVisible, setIsDogModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [dogForm] = Form.useForm();
  const [editForm] = Form.useForm();
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
      fetchCurrentUser();
    } catch (err) {
      console.error("Upload error:", err);
      message.error("Error al subir imagen");
    }
  };

  const handleEditProfile = async (values) => {
    if (!currentUser?._id) return;

    const token = await getAccessTokenSilently();

    try {
      const res = await fetch(
        `http://localhost:3001/api/users/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            city: values.city,
            bio: values.bio,
          }),
        }
      );

      if (!res.ok) throw new Error("Update failed");
      message.success("Perfil actualizado correctamente");
      setIsEditModalVisible(false);
      fetchCurrentUser();
    } catch (err) {
      console.error("Update error:", err);
      message.error("Error al actualizar perfil");
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
      setIsDogModalVisible(false);
      dogForm.resetFields();
      fetchCurrentUser();
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
      fetchCurrentUser();
    } catch (err) {
      console.error("Delete dog error:", err);
      message.error("Error al eliminar perro");
    }
  };

  const openEditModal = () => {
    editForm.setFieldsValue({
      name: currentUser.name,
      city: currentUser.city,
      bio: currentUser.bio || "",
    });
    setIsEditModalVisible(true);
  };

  if (!isAuthenticated) return <p>Please log in to view your profile.</p>;
  if (!currentUser)
    return (
      <div className="spin-container">
        <Spin tip="Loading profile..." size="large" />
      </div>
    );

  return (
    <div style={{ maxWidth: 1200, margin: "2rem auto", padding: "0 1rem" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={10}>
          <Card
            className="card"
            bordered
            hoverable
            style={{ textAlign: "center" }}
          >
            <Avatar
              src={currentUser?.imageUrl}
              size={100}
              style={{ marginBottom: "1rem" }}
            />
            <Title level={3}>{currentUser.name}</Title>
            <Text type="secondary">{currentUser.email}</Text>
            <br />
            <Text type="secondary">{currentUser.city || "No city"}</Text>

            {currentUser.bio && (
              <>
                <Divider />
                <Text>{currentUser.bio}</Text>
              </>
            )}

            <Divider />

            <Space>
              <div className="button-wrapper">
                <Upload
                  customRequest={handleUpload}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>Subir Imagen</Button>
                </Upload>

                <Button icon={<EditOutlined />} onClick={openEditModal}>
                  Editar Perfil
                </Button>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card title="Mis Perros" bordered hoverable>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => setIsDogModalVisible(true)}
              style={{ marginBottom: "1rem", width: "100%" }}
            >
              Agregar Perro
            </Button>

            {dogs.length === 0 ? (
              <Text type="secondary">No tienes perros registrados</Text>
            ) : (
              <List
                dataSource={dogs}
                renderItem={(dog) => (
                  <List.Item
                    actions={[
                      <Popconfirm
                        title="¿Eliminar este perro?"
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
          </Card>
        </Col>
      </Row>

      <Modal
        title="Editar Perfil"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={editForm} onFinish={handleEditProfile} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: "Ingresa tu nombre" }]}
          >
            <Input placeholder="Tu nombre" />
          </Form.Item>

          <Form.Item
            name="city"
            label="Ciudad"
            rules={[{ required: true, message: "Donde vives?" }]}
          >
            <Input placeholder="Tu ciudad" />
          </Form.Item>

          <Form.Item name="bio" label="Biografía">
            <TextArea
              placeholder="Cuéntanos sobre ti..."
              rows={4}
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
              <Button onClick={() => setIsEditModalVisible(false)}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Agregar Perro"
        open={isDogModalVisible}
        onCancel={() => {
          setIsDogModalVisible(false);
          dogForm.resetFields();
        }}
        footer={null}
      >
        <Form form={dogForm} onFinish={handleAddDog} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: "Nombre del perro" }]}
          >
            <Input placeholder="Nombre" />
          </Form.Item>

          <Form.Item
            name="breed"
            label="Raza"
            rules={[{ required: true, message: "Raza del perro" }]}
          >
            <Input placeholder="Raza" />
          </Form.Item>

          <Form.Item
            name="age"
            label="Edad"
            rules={[{ required: true, message: "Edad del perro" }]}
          >
            <Input placeholder="Años" type="number" />
          </Form.Item>

          <Form.Item
            name="dogImage"
            label="Foto"
            rules={[{ required: true, message: "Sube una foto" }]}
          >
            <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
              <Button icon={<UploadOutlined />}>Seleccionar</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={uploading}>
                Agregar
              </Button>
              <Button onClick={() => setIsDogModalVisible(false)}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfileWithUsers;
