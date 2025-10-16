import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // 完全禁用静态生成，强制所有页面动态渲染
  output: 'standalone',
  trailingSlash: true,
  webpack: (config, { isServer }) => {
    // 只在服务器端处理 swisseph-wasm
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'swisseph-wasm': false,
      };
    } else {
      // 在服务器端支持 WASM 和数据文件
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
        layers: true,
      };

      // 处理 .wasm 和 .data 文件
      config.module.rules.push({
        test: /\.(wasm|data)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/wasm/[name].[hash][ext]',
        },
      });
    }

    // 添加 alias 指向根目录文件
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@root/calculate-chart': path.resolve(__dirname, '../calculate-chart.js'),
      };
    }

    return config;
  },
};

export default nextConfig;
