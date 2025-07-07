// src/pages/EditProfilePage.tsx
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCookies } from "react-cookie";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const EditProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [cookies] = useCookies(["authToken"]);

  console.log(user)

  const [username, setUsername] = useState(user[0]?.username || "");
  const [email, setEmail] = useState(user[0]?.email || "");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSave = async () => {
    if (!username.trim() || !email.trim()) {
      toast({
        title: "Validation Error",
        description: "Username and email are required.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.authToken}`,
        },
        body: JSON.stringify({ username, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const result = await response.json();

      toast({
        title: "Profile Updated",
        description: "Your profile was updated successfully.",
      });

      updateUser(result.user);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 pt-20 space-y-6">
      <h1 className="text-2xl font-bold text-white text-center">
        Edit Profile
      </h1>
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button
        className="w-full bg-green-500 hover:bg-green-600"
        disabled={loading}
        onClick={handleSave}
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default EditProfilePage;
