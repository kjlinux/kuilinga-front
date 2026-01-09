import { client } from "@/api/client.gen";

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface AvatarUploadResponse {
  avatar_url: string;
  message: string;
}

class ProfileService {
  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await client.post<{ message: string }>({
      url: "/api/v1/auth/change-password",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.error) {
      throw response.error;
    }

    return response.data as unknown as { message: string };
  }

  async uploadAvatar(userId: string, file: File): Promise<AvatarUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await client.post<AvatarUploadResponse>({
      url: `/api/v1/users/${userId}/avatar`,
      body: formData,
    });

    if (response.error) {
      throw response.error;
    }

    return response.data as AvatarUploadResponse;
  }

  async deleteAvatar(userId: string): Promise<{ message: string }> {
    const response = await client.delete<{ message: string }>({
      url: `/api/v1/users/${userId}/avatar`,
    });

    if (response.error) {
      throw response.error;
    }

    return response.data as unknown as { message: string };
  }
}

export default new ProfileService();
