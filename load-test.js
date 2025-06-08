import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 600,
  duration: "5m",
};

export default function () {
  // 1. Login lấy token
  const loginPayload = JSON.stringify({
    username: "DuyTran1",
    password: "0903471112",
  });

  const loginHeaders = { "Content-Type": "application/json" };

  const loginRes = http.post(
    "http://localhost:8080/api/auth/login",
    loginPayload,
    { headers: loginHeaders }
  );

  const token = loginRes.json("jwt");
  console.log("Received token:", token);

  check(loginRes, {
    "login status is 200": (r) => r.status === 200,
    "token is present": () =>
      token !== undefined && token !== null && token !== "",
  });

  if (!token) {
    console.error("No token received, aborting this iteration");
    return;
  }

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  // 2. Get all mangas (có thể có paging)
  const allMangasRes = http.get(
    "http://localhost:8080/api/manga?page=0&size=50",
    { headers: authHeaders }
  );
  console.log("all mangas status:", allMangasRes.status);
  check(allMangasRes, {
    "get all mangas status is 200": (r) => r.status === 200,
  });

  // 3. Get featured mangas
  const featuredRes = http.get("http://localhost:8080/api/manga/featured", {
    headers: authHeaders,
  });
  console.log("featured mangas status:", featuredRes.status);
  check(featuredRes, {
    "get featured mangas status is 200": (r) => r.status === 200,
  });

  // 4. Get latest mangas
  const latestRes = http.get("http://localhost:8080/api/manga/latest", {
    headers: authHeaders,
  });
  console.log("latest mangas status:", latestRes.status);
  check(latestRes, {
    "get latest mangas status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
