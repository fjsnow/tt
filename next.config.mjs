import pwa from "@ducanh2912/next-pwa";

const withPWA = pwa({
    dest: "public",
});

const nextConfig = {};

export default withPWA(nextConfig);
