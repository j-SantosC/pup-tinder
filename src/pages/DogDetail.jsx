import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Card,
  Avatar,
  Typography,
  Spin,
  Button,
  Tag,
  Space,
  Divider,
  Row,
  Col,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  HeartFilled,
  HeartOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export default function DogDetail() {
  const { userId, dogId } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [dogData, setDogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const fetchDogDetail = async () => {
    if (!isAuthenticated) return;

    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(
        `http://localhost:3001/api/users/${userId}/dogs/${dogId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setDogData(data);
        checkIfLiked(data.dog._id);
      } else {
        message.error("No se pudo cargar la información del perro");
        navigate(-1);
      }
    } catch (err) {
      console.error("Error fetching dog detail:", err);
      message.error("Error al cargar los detalles");
    } finally {
      setLoading(false);
    }
  };

  const checkIfLiked = async (dogId) => {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch("http://localhost:3001/api/users/likes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const likes = await res.json();
        setIsLiked(likes.some((like) => like.dogId === dogId));
      }
    } catch (err) {
      console.error("Error checking likes:", err);
    }
  };

  const toggleLike = async () => {
    try {
      const token = await getAccessTokenSilently();

      if (isLiked) {
        // Quitar like
        await fetch(
          `http://localhost:3001/api/users/likes/${dogData.dog._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsLiked(false);
        message.success("Me gusta eliminado");
      } else {
        // Agregar like
        await fetch("http://localhost:3001/api/users/likes", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dogId: dogData.dog._id,
            ownerId: dogData.owner._id,
            dogName: dogData.dog.name,
            dogBreed: dogData.dog.breed,
            dogAge: dogData.dog.age,
            dogImageUrl: dogData.dog.imageUrl,
            ownerName: dogData.owner.name,
            ownerCity: dogData.owner.city,
            ownerImageUrl: dogData.owner.imageUrl,
            ownerBio: dogData.owner.bio,
          }),
        });
        setIsLiked(true);
        message.success("Me gusta agregado");
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      message.error("Error al actualizar me gusta");
    }
  };

  useEffect(() => {
    fetchDogDetail();
  }, [isAuthenticated, userId, dogId]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Spin size="large" tip="Cargando detalles..." />
      </div>
    );
  }

  if (!dogData) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <Text>No se encontró información del perro</Text>
        <br />
        <Button onClick={() => navigate(-1)} style={{ marginTop: "20px" }}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 20px" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 20 }}
      >
        Volver
      </Button>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={10}>
          <Card
            cover={
              <img
                alt={dogData.dog.name}
                src={
                  dogData.dog.imageUrl ||
                  "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600"
                }
                style={{
                  height: 400,
                  objectFit: "cover",
                  borderRadius: "8px 8px 0 0",
                }}
              />
            }
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Title level={2} style={{ margin: 0 }}>
                {dogData.dog.name}
              </Title>
              <Button
                type={isLiked ? "primary" : "default"}
                danger={isLiked}
                icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
                onClick={toggleLike}
                size="large"
                shape="circle"
              />
            </div>

            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text type="secondary">Raza</Text>
                <br />
                <Text strong style={{ fontSize: 16 }}>
                  {dogData.dog.breed}
                </Text>
              </div>

              <div>
                <CalendarOutlined style={{ marginRight: 8 }} />
                <Text>{dogData.dog.age} años</Text>
              </div>

              {dogData.dog.description && (
                <>
                  <Divider />
                  <Paragraph>{dogData.dog.description}</Paragraph>
                </>
              )}

              {dogData.dog.personality && (
                <div>
                  <Text type="secondary">Personalidad</Text>
                  <br />
                  <Space wrap style={{ marginTop: 8 }}>
                    {dogData.dog.personality.split(",").map((trait, index) => (
                      <Tag key={index} color="blue">
                        {trait.trim()}
                      </Tag>
                    ))}
                  </Space>
                </div>
              )}
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={14}>
          <Card title="Información del dueño">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <Avatar
                src={dogData.owner.imageUrl}
                size={80}
                icon={<UserOutlined />}
              />
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {dogData.owner.name}
                </Title>
                <Text type="secondary">
                  <EnvironmentOutlined />{" "}
                  {dogData.owner.city || "Ciudad no especificada"}
                </Text>
              </div>
            </div>

            {dogData.owner.bio && (
              <>
                <Divider />
                <Paragraph>{dogData.owner.bio}</Paragraph>
              </>
            )}

            <Divider />

            <Title level={5}>Otros perros de {dogData.owner.name}</Title>
            {dogData.otherDogs && dogData.otherDogs.length > 0 ? (
              <Row gutter={[16, 16]}>
                {dogData.otherDogs.map((otherDog) => (
                  <Col xs={12} sm={8} key={otherDog._id}>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={otherDog.name}
                          src={
                            otherDog.imageUrl ||
                            "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200"
                          }
                          style={{ height: 120, objectFit: "cover" }}
                        />
                      }
                      onClick={() =>
                        navigate(`/app/dog/${userId}/${otherDog._id}`)
                      }
                    >
                      <Card.Meta
                        title={otherDog.name}
                        description={`${otherDog.breed}, ${otherDog.age} años`}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Text type="secondary">No tiene otros perros registrados</Text>
            )}

            <Divider />

            <Space>
              <Button type="primary" size="large">
                Enviar mensaje
              </Button>
              <Button size="large">Ver perfil completo</Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
