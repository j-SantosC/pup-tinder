import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Profile</h1>
      <img
        src={user.picture}
        alt={user.name}
        style={{ borderRadius: "50%", width: "100px", marginBottom: "1rem" }}
      />
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
    </div>
  );
};

export default Profile;
