import "./index.css";
import "./globals.css";
import { Composition } from "remotion";
import { VisionXDemo } from "./VisionXDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VisionXDemo"
        component={VisionXDemo}
        durationInFrames={3600}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
