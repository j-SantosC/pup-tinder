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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./Profile.css";

const { Title, Text } = Typography;

const ProfileWithUsers = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [currentUser, setCurrentUser] = useState(null);

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
    } catch (err) {
      console.error("Upload error:", err);
      message.error("Error al subir imagen");
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
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <Card bordered hoverable style={{ textAlign: "center" }}>
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
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
      </Card>
    </div>
  );
};

export default ProfileWithUsers;
