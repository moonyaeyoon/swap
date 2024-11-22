// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // 브라우저 환경에서 `fs` 모듈을 빈 모듈로 대체하여 무시합니다.
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
            };
        }
        return config;
    },
    // 추가적인 설정 옵션을 여기에 추가할 수 있습니다.
};

export default nextConfig;
