import { app } from "../service";
import request from "supertest";
import { mockProfile } from "./mock/mockData.mock";

describe("API tests", () => {
  const agent = request.agent(app);
  it("Should register, login, logout and delete user successfully", async () => {
    // Register mock user
    const profile = mockProfile;
    const password = "password";
    const response = await agent
      .post("/api/register")
      .send({ profile, password });
    expect(response.text).toBe("User registered successfully");
    expect(response.status).toBe(200);

    // Login with mock user
    const loginResponse = await agent
      .put("/api/login")
      .send({ email: profile.email, password });
    expect(loginResponse.text).toBe("Logged in successfully");
    expect(loginResponse.status).toBe(200);
    let token = getTokenFromResponse(loginResponse);

    // Logout mock user
    const logoutResponse = await request(app)
      .delete("/api/logout")
      .set("Cookie", [`token=${token}`]);
    expect(logoutResponse.text).toBe("Logged out successfully");
    expect(logoutResponse.status).toBe(200);

    // Log back in to get auth cookie
    const loginResponse2 = await request(app)
      .put("/api/login")
      .send({ email: profile.email, password });
    expect(loginResponse2.status).toBe(200);
    expect(loginResponse2.text).toBe("Logged in successfully");
    token = getTokenFromResponse(loginResponse2);

    // Delete mock user
    const deleteResponse = await request(app)
      .delete("/api/profile")
      .set("Cookie", [`token=${token}`]);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.text).toBe("Profile deleted successfully");
  });
});

function getTokenFromResponse(response: any) {
  const cookies = response.headers["set-cookie"];
  if (!cookies || cookies.length === 0) {
    throw new Error("No cookies found in response");
  }
  const tokenCookie = cookies.find((cookie: string) =>
    cookie.startsWith("token=")
  );
  if (!tokenCookie) {
    throw new Error("Token cookie not found");
  }
  const token = tokenCookie.split(";")[0].split("=")[1];
  return token;
}
