const isGH = process.env.GITHUB_PAGES === "true";
const customDomain = process.env.CUSTOM_DOMAIN === "true";
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";

export default {
  output: "export",
  images: { unoptimized: true },
  basePath: customDomain ? undefined : (isGH && repo ? `/${repo}` : undefined),
  assetPrefix: customDomain ? undefined : (isGH && repo ? `/${repo}/` : undefined),
};
