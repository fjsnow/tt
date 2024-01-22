import pwa from "next-pwa";

const withPWA = pwa({
  dest: "public",
});

const nextConfig = {};

export default withPWA(nextConfig);
