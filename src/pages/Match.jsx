import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, Button, Avatar, Spin } from "antd";
import {
  HeartFilled,
  CloseOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";

export default function DogTinderMatch() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [dogProfiles, setDogProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDogProfiles = async () => {
    if (!isAuthenticated) return;

    try {
      const token = await getAccessTokenSilently();
      const res = await fetch("http://localhost:3001/api/users/match", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dogsData = await res.json();

      const profiles = dogsData.map((dog) => ({
        id: `${dog.owner.userId}-${dog.dogId}`,
        dogId: dog.dogId,
        name: dog.name,
        breed: dog.breed,
        age: dog.age,
        image: dog.imageUrl,
        owner: {
          name: dog.owner.name,
          city: dog.owner.city,
          image: dog.owner.imageUrl,
          bio: dog.owner.bio,
        },
      }));

      setDogProfiles(profiles);
    } catch (err) {
      console.error("Error fetching dogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogProfiles();
  }, [isAuthenticated]);

  const currentDog = dogProfiles[currentIndex];

  const handleReject = () => {
    if (currentIndex < dogProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleAccept = () => {
    setMatches([...matches, currentDog]);
    if (currentIndex < dogProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const cardStyle = {
    width: 350,
    margin: "20px auto",
    borderRadius: "15px",
    overflow: "hidden",
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#ffffff1a",
    padding: "20px",
  };

  const ownerInfoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
    padding: "10px",
    backgroundColor: "#fafafa",
    borderRadius: "10px",
    cursor: "pointer",
  };

  const buttonStyle = {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
  };

  const matchesStyle = {
    marginTop: "20px",
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "15px",
    width: "350px",
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <Spin size="large" />
        <p>Cargando perros...</p>
      </div>
    );
  }

  if (!currentDog) {
    return (
      <div style={containerStyle}>
        <p>No hay más perros disponibles</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Card
        style={cardStyle}
        cover={
          <img
            alt={currentDog.name}
            src={
              currentDog.image ||
              "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=600&fit=crop"
            }
            style={{ height: 400, objectFit: "cover" }}
          />
        }
        actions={[
          <Button
            key="reject"
            icon={<CloseOutlined />}
            onClick={handleReject}
            size="large"
            style={buttonStyle}
          />,
          <Button
            key="accept"
            type="primary"
            danger
            icon={<HeartFilled />}
            onClick={handleAccept}
            size="large"
            style={buttonStyle}
          />,
        ]}
      >
        <div
          style={ownerInfoStyle}
          onClick={() => (window.location.href = "/profile")}
        >
          <Avatar
            src={
              currentDog.owner.image ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            }
            size={50}
          />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <UserOutlined />
              <strong>{currentDog.owner.name}</strong>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                color: "#666",
              }}
            >
              <EnvironmentOutlined />
              <span>{currentDog.owner.city}</span>
            </div>
          </div>
        </div>

        <h2 style={{ margin: "0 0 5px 0" }}>
          {currentDog.name}, {currentDog.age} años
        </h2>
        <p style={{ color: "#666", margin: "0 0 15px 0" }}>
          {currentDog.breed}
        </p>

        {currentDog.owner.bio && (
          <p style={{ fontStyle: "italic", color: "#888" }}>
            "{currentDog.owner.bio}"
          </p>
        )}
      </Card>

      {matches.length > 0 && (
        <div style={matchesStyle}>
          <h3>Matches ({matches.length})</h3>
          <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
            {matches.map((dog) => (
              <div
                key={dog.id}
                style={{ textAlign: "center", minWidth: "60px" }}
              >
                <Avatar
                  src={
                    dog.image ||
                    "https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop"
                  }
                  size={50}
                />
                <p style={{ fontSize: "12px", margin: "5px 0 0 0" }}>
                  {dog.name}
                </p>
                <p style={{ fontSize: "10px", color: "#666", margin: 0 }}>
                  {dog.owner.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
