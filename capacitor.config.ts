import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "neat.memos",
  appName: "neatMemos",
  webDir: "dist",
  server: {
    androidScheme: "https"
  }
};

export default config;
