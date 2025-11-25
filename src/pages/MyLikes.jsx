import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Avatar,
  Empty,
  Spin,
  Row,
  Col,
  Typography,
  Button,
  message,
} from "antd";
import {
  HeartFilled,
  EnvironmentOutlined,
  UserOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function MyLikes() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [likedDogs, setLikedDogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLikedDogs = async () => {
    if (!isAuthenticated) return;

    try {
      const token = await getAccessTokenSilently();
      const res = await fetch("http://localhost:3001/api/users/likes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setLikedDogs(data);
      }
    } catch (err) {
      console.error("Error fetching liked dogs:", err);
      message.error("Error al cargar tus me gusta");
    } finally {
      setLoading(false);
    }
  };

  const removeLike = async (dogId) => {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(
        `http://localhost:3001/api/users/likes/${dogId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setLikedDogs(likedDogs.filter((dog) => dog.dogId !== dogId));
        message.success("Me gusta eliminado");
      }
    } catch (err) {
      console.error("Error removing like:", err);
      message.error("Error al eliminar me gusta");
    }
  };

  const viewDogDetail = (dog) => {
    navigate(`/app/dog/${dog.ownerId}/${dog.dogId}`);
  };

  useEffect(() => {
    fetchLikedDogs();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Spin size="large" tip="Cargando tus me gusta..." />
      </div>
    );
  }

  if (!likedDogs || likedDogs.length === 0) {
    return (
      <div style={{ padding: "40px", maxWidth: 1200, margin: "0 auto" }}>
        <Title level={2}>
          <HeartFilled style={{ color: "#ff4458", marginRight: 10 }} />
          Mis Me Gusta
        </Title>
        <Empty
          description={
            <span>
              Aún no has dado me gusta a ningún perro.
              <br />
              ¡Ve a la página de Match para conocer nuevos amigos peludos!
            </span>
          }
        >
          <Button type="primary" onClick={() => navigate("/app/match")}>
            Ir a Match
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: 1200, margin: "0 auto" }}>
      <Title level={2}>
        <HeartFilled style={{ color: "#ff4458", marginRight: 10 }} />
        Mis Me Gusta ({likedDogs.length})
      </Title>

      <Row gutter={[16, 16]}>
        {likedDogs.map((dog) => (
          <Col xs={24} sm={12} md={8} lg={6} key={dog.dogId}>
            <Card
              hoverable
              cover={
                <div
                  style={{
                    position: "relative",
                    paddingTop: "100%",
                    overflow: "hidden",
                  }}
                >
                  <img
                    alt={dog.name}
                    src={
                      dog.imageUrl ||
                      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400"
                    }
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <Button
                      icon={<EyeOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        viewDogDetail(dog);
                      }}
                      style={{
                        borderRadius: "50%",
                      }}
                    />
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLike(dog.dogId);
                      }}
                      style={{
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                </div>
              }
              onClick={() => viewDogDetail(dog)}
            >
              <Card.Meta
                title={
                  <div>
                    <Text strong style={{ fontSize: 16 }}>
                      {dog.name}, {dog.age} años
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      {dog.breed}
                    </Text>
                  </div>
                }
                description={
                  <div style={{ marginTop: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <Avatar
                        src={dog.owner.imageUrl}
                        size={30}
                        icon={<UserOutlined />}
                      />
                      <div>
                        <Text strong>{dog.owner.name}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <EnvironmentOutlined />{" "}
                          {dog.owner.city || "Ciudad no especificada"}
                        </Text>
                      </div>
                    </div>
                    {dog.owner.bio && (
                      <Text
                        type="secondary"
                        ellipsis={{ rows: 2 }}
                        style={{ fontSize: 12, fontStyle: "italic" }}
                      >
                        "{dog.owner.bio}"
                      </Text>
                    )}
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
