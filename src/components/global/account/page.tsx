import React, { useState } from "react";
import { X, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EditProfile = ({ onClose }: { onClose: () => void }) => {
  const [profileData, setProfileData] = useState({
    fullName: "David Soinfir",
    userId: "SK753499",
    email: "davidsoinfir@gmail.com",
    phoneNumber: "+1234 5678 1011",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile updated:", profileData);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose} // Close when clicking outside
    >
      <Card
        className="w-[95%] max-w-xl bg-white p-6 rounded-2xl shadow-xl relative"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
      >
        {/* Close Button (X) */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-8 w-8"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">Edit Profile</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <img
                    src="/1.jpeg"
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8"
                >
                  <Camera className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <Input
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleChange}
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  User ID
                </label>
                <Input
                  name="userId"
                  value={profileData.userId}
                  disabled
                  className="h-10 bg-gray-50 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleChange}
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Phone Number
                </label>
                <Input
                  name="phoneNumber"
                  type="tel"
                  value={profileData.phoneNumber}
                  onChange={handleChange}
                  className="h-10 text-sm"
                />
              </div>
            </div>

            {/* Save Button - Aligned Right */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm px-6 rounded-lg"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfile;
