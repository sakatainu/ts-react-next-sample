const {
  env: {
    NEXT_PUBLIC_SENTRY_DSN,
    SENTRY_AUTH_TOKEN,
    SENTRY_RELEASE,
    SENTRY_ENVIRONMENT,
    SENTRY_HIDDEN_SOURCE_MAP,
    ANALYZE,
    SKIP_TYPE_CHECK,
    SKIP_NEXT_LINT,
  },
} = process

const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: ANALYZE === 'true' })
const { withSentryConfig } = require('@sentry/nextjs')

const isSentry = Boolean(NEXT_PUBLIC_SENTRY_DSN)
              && Boolean(SENTRY_AUTH_TOKEN)
              && Boolean(SENTRY_RELEASE)
              && Boolean(SENTRY_ENVIRONMENT)

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const moduleExports = withBundleAnalyzer({
  reactStrictMode: true,
  distDir: '.next/buildDir',
  ...SKIP_TYPE_CHECK === 'true' && { typescript: { ignoreBuildErrors: true } },
  ...SKIP_NEXT_LINT === 'true' && { eslint: { ignoreDuringBuilds: true } },
  productionBrowserSourceMaps: true,
  ...isSentry && {
    sentry : {
      disableServerWebpackPlugin: true,
      hideSourceMaps: SENTRY_HIDDEN_SOURCE_MAP === 'true',
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
})

module.exports = isSentry ? withSentryConfig(moduleExports) : moduleExports
